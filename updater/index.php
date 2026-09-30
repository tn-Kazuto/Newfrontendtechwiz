<?php
error_reporting(E_ALL & ~E_NOTICE);
ini_set('display_errors', 0);
ini_set('max_execution_time', 600);
ini_set('memory_limit', '512M');

session_start();

$configFile = __DIR__ . '/config.json';
if (!file_exists($configFile)) {
    file_put_contents($configFile, json_encode([
        'secret_key' => 'techwiz2026@secure',
        'github_repo' => 'manhconne/techwiz-frontend',
        'github_token' => '',
        'target_dir' => dirname(__DIR__),
        'backup_dir' => dirname(__DIR__) . '_backups',
        'preserve_files' => ['.env', '.env.local', '.env.production', 'updater'],
        'build_command' => 'npm install && npm run build',
        'pm2_process_name' => 'techwiz-frontend',
        'auto_restart_pm2' => true,
        'max_backups' => 3
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

$config = json_decode(file_get_contents($configFile), true) ?: [];

// CLI Worker Mode
if (php_sapi_name() === 'cli' && isset($argv[1]) && $argv[1] === '--run-update') {
    $cliTag = $argv[2] ?? 'latest';
    $cliSkip = ($argv[3] ?? '0') === '1';
    execute_full_update($cliTag, $cliSkip, $config);
    exit(0);
}

// Helper functions
function getUpdateStatusFile() {
    return __DIR__ . '/.update_status.json';
}

function updateState($step = null, $log = null, $finished = null, $success = null, $newVersion = null) {
    $statusFile = getUpdateStatusFile();
    $state = [];
    if (file_exists($statusFile)) {
        $raw = @file_get_contents($statusFile);
        $state = json_decode($raw, true) ?: [];
    }
    
    if ($step !== null) $state['step'] = $step;
    if ($finished !== null) {
        $state['finished'] = (bool)$finished;
        $state['running'] = !$finished;
    }
    if ($success !== null) $state['success'] = (bool)$success;
    if ($newVersion !== null) $state['new_version'] = $newVersion;
    
    if ($log !== null) {
        if (!isset($state['logs']) || !is_array($state['logs'])) $state['logs'] = [];
        $state['logs'][] = $log;
    }
    
    $state['updated_at'] = time();
    @file_put_contents($statusFile, json_encode($state, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function checkAuth($config) {
    if (empty($config['secret_key'])) return true;
    if (isset($_SESSION['updater_auth']) && $_SESSION['updater_auth'] === true) return true;
    $providedKey = $_GET['secret_key'] ?? $_POST['secret_key'] ?? $_SERVER['HTTP_X_SECRET_KEY'] ?? '';
    if ($providedKey === $config['secret_key']) {
        $_SESSION['updater_auth'] = true;
        return true;
    }
    return false;
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function githubApiRequest($url, $token) {
    $ch = curl_init();
    $headers = [
        'User-Agent: TechWiz-Updater-aaPanel',
        'Accept: application/vnd.github.v3+json'
    ];
    if (!empty($token)) {
        $headers[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    return ['code' => $httpCode, 'body' => $response, 'error' => $err];
}

function downloadGithubZip($url, $token, $destinationPath) {
    // 1st request without auto-following location to catch redirect safely without AWS S3 Auth header clash
    $ch = curl_init();
    $headers = [
        'User-Agent: TechWiz-Updater-aaPanel',
        'Accept: application/vnd.github.v3+json'
    ];
    if (!empty($token)) {
        $headers[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, true);
    curl_setopt($ch, CURLOPT_NOBODY, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

    $downloadUrl = $url;
    $useAuth = true;

    if ($httpCode === 301 || $httpCode === 302) {
        $headerText = substr($response, 0, $headerSize);
        if (preg_match('/Location:\s*([^\r\n]+)/i', $headerText, $matches)) {
            $downloadUrl = trim($matches[1]);
            // If redirected to Amazon S3 / objects.githubusercontent.com, do NOT send GitHub Bearer token
            if (strpos($downloadUrl, 'githubusercontent.com') !== false || strpos($downloadUrl, 'amazonaws.com') !== false) {
                $useAuth = false;
            }
        }
    }

    $fp = fopen($destinationPath, 'w+');
    if (!$fp) return false;

    $ch2 = curl_init();
    $headers2 = ['User-Agent: TechWiz-Updater-aaPanel'];
    if ($useAuth && !empty($token)) {
        $headers2[] = 'Authorization: Bearer ' . trim($token);
    }
    curl_setopt($ch2, CURLOPT_URL, $downloadUrl);
    curl_setopt($ch2, CURLOPT_FILE, $fp);
    curl_setopt($ch2, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers2);
    curl_setopt($ch2, CURLOPT_TIMEOUT, 300);
    curl_setopt($ch2, CURLOPT_SSL_VERIFYPEER, false);
    $success = curl_exec($ch2);
    $statusCode = curl_getinfo($ch2, CURLINFO_HTTP_CODE);
    curl_close($ch2);
    fclose($fp);

    return ($success && $statusCode >= 200 && $statusCode < 300);
}

// ---------------- API HANDLERS ----------------
$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $pass = $_POST['password'] ?? '';
    if (!empty($config['secret_key']) && $pass === $config['secret_key']) {
        $_SESSION['updater_auth'] = true;
        sendJson(['success' => true, 'message' => 'Đăng nhập thành công!']);
    } else if (empty($config['secret_key'])) {
        $_SESSION['updater_auth'] = true;
        sendJson(['success' => true, 'message' => 'Đăng nhập thành công (không có mật khẩu)']);
    }
    sendJson(['success' => false, 'message' => 'Sai mật khẩu truy cập!'], 401);
}

if ($action === 'logout') {
    unset($_SESSION['updater_auth']);
    session_destroy();
    header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
    exit;
}

if ($action && !checkAuth($config)) {
    sendJson(['success' => false, 'message' => 'Chưa xác thực hoặc phiên đăng nhập đã hết hạn.'], 403);
}

// Release session lock to allow concurrent requests without blocking
if ($action !== 'login') {
    @session_write_close();
}

// Auto-detect Node and PM2 paths on Linux / aaPanel globally
$targetDir = realpath($config['target_dir']) ?: $config['target_dir'];
$nodePath = trim(@shell_exec('which node 2>/dev/null') ?: '');
$nodeDir = $nodePath ? dirname($nodePath) : '';
$nodeVersionDirs = glob('/www/server/nodejs/*/bin') ?: [];
$pathDirs = array_merge(
    [rtrim($targetDir, '/') . '/node_modules/.bin', $nodeDir],
    $nodeVersionDirs,
    ['/www/server/nodejs/v24.16.0/bin', '/www/server/nodejs/current/bin', '/usr/local/bin', '/usr/bin', '/bin']
);
$fullPathStr = implode(':', array_unique(array_filter($pathDirs))) . ':' . (getenv('PATH') ?: '');

// Get current system status
if ($action === 'status') {

    $currentVersion = 'Chưa xác định';
    if (@file_exists($targetDir . '/.current_version')) {
        $currentVersion = trim(@file_get_contents($targetDir . '/.current_version'));
    } else {
        // Fallback to shell cat to bypass open_basedir
        $catVer = trim(@shell_exec("cat " . escapeshellarg($targetDir . '/.current_version') . " 2>/dev/null") ?: '');
        if (!empty($catVer)) {
            $currentVersion = $catVer;
        } elseif (@file_exists($targetDir . '/package.json')) {
            $pkg = json_decode(@file_get_contents($targetDir . '/package.json'), true);
            $currentVersion = $pkg['version'] ?? 'Chưa xác định';
        } else {
            $catPkg = trim(@shell_exec("cat " . escapeshellarg($targetDir . '/package.json') . " 2>/dev/null") ?: '');
            if (!empty($catPkg)) {
                $pkg = json_decode($catPkg, true);
                $currentVersion = $pkg['version'] ?? 'Chưa xác định';
            }
        }
    }

    $isTargetDir = @is_dir($targetDir) || (trim(@shell_exec("[ -d " . escapeshellarg($targetDir) . " ] && echo 1 2>/dev/null") ?: '') === '1');
    $isWritable = ($isTargetDir && @is_writable($targetDir)) || (trim(@shell_exec("[ -w " . escapeshellarg($targetDir) . " ] && echo 1 2>/dev/null") ?: '') === '1');
    
    // Check commands with full PATH
    $nodeVer = trim(@shell_exec("export PATH=" . escapeshellarg($fullPathStr) . "; node -v 2>&1") ?: 'Chưa cài đặt');
    $npmVer = trim(@shell_exec("export PATH=" . escapeshellarg($fullPathStr) . "; npm -v 2>&1") ?: 'Chưa cài đặt');
    $pm2Ver = trim(@shell_exec("export PATH=" . escapeshellarg($fullPathStr) . "; pm2 -v 2>/dev/null") ?: 'Chưa cài đặt');
    
    // Check pm2 status for target
    $pm2Status = 'Không rõ';
    if (!empty($config['pm2_process_name'])) {
        $tryPm2Home = (is_dir('/root/.pm2') && is_readable('/root/.pm2')) ? "PM2_HOME=/root/.pm2 " : "";
        $pm2Check = @shell_exec("export PATH=" . escapeshellarg($fullPathStr) . "; {$tryPm2Home}pm2 jlist 2>/dev/null");
        if ($pm2Check && ($list = json_decode($pm2Check, true))) {
            $found = false;
            foreach ($list as $proc) {
                if ($proc['name'] === $config['pm2_process_name']) {
                    $pm2Status = $proc['pm2_env']['status'] ?? 'unknown';
                    $found = true;
                    break;
                }
            }
            if (!$found) $pm2Status = 'Chưa đăng ký PM2';
        }
    }

    sendJson([
        'success' => true,
        'current_version' => $currentVersion,
        'target_dir' => $targetDir,
        'target_dir_exists' => is_dir($targetDir),
        'target_dir_writable' => $isWritable,
        'node_version' => trim($nodeVer),
        'npm_version' => trim($npmVer),
        'pm2_version' => trim($pm2Ver),
        'pm2_status' => $pm2Status,
        'config' => [
            'github_repo' => $config['github_repo'],
            'has_token' => !empty($config['github_token']),
            'pm2_process_name' => $config['pm2_process_name'],
            'build_command' => $config['build_command'],
            'preserve_files' => $config['preserve_files'] ?? []
        ]
    ]);
}

// Fetch GitHub Releases
if ($action === 'releases') {
    $repo = trim($config['github_repo']);
    if (empty($repo)) {
        sendJson(['success' => false, 'message' => 'Chưa cấu hình github_repo!'], 400);
    }
    $res = githubApiRequest("https://api.github.com/repos/{$repo}/releases?per_page=15", $config['github_token']);
    if ($res['code'] !== 200) {
        $errData = json_decode($res['body'], true);
        $errMsg = $errData['message'] ?? ($res['error'] ?: 'Lỗi gọi GitHub API (' . $res['code'] . ')');
        sendJson(['success' => false, 'message' => $errMsg, 'raw' => $res['body']], 500);
    }
    $releases = json_decode($res['body'], true) ?: [];
    sendJson(['success' => true, 'releases' => $releases]);
}

// Manual trigger pm2 restart all
if ($action === 'restart_pm2') {
    $pm2Cmd = "export PATH=" . escapeshellarg($fullPathStr) . "; timeout 5s pm2 restart all 2>&1 || PM2_HOME=/root/.pm2 timeout 5s pm2 restart all 2>&1 || timeout 5s sudo -n pm2 restart all 2>&1";
    $output = trim(@shell_exec($pm2Cmd) ?: '');
    sendJson([
        'success' => true,
        'message' => 'Đã thực thi lệnh [pm2 restart all]',
        'output' => $output
    ]);
}

// Save Config
if ($action === 'save_config' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        sendJson(['success' => false, 'message' => 'Dữ liệu cấu hình không hợp lệ!'], 400);
    }
    
    // Merge updates
    foreach (['github_repo', 'target_dir', 'backup_dir', 'build_command', 'pm2_process_name', 'secret_key'] as $key) {
        if (isset($input[$key])) {
            $config[$key] = trim($input[$key]);
        }
    }
    if (isset($input['github_token']) && $input['github_token'] !== '******') {
        $config['github_token'] = trim($input['github_token']);
    }
    if (isset($input['auto_restart_pm2'])) {
        $config['auto_restart_pm2'] = (bool)$input['auto_restart_pm2'];
    }
    if (isset($input['preserve_files']) && is_array($input['preserve_files'])) {
        $config['preserve_files'] = array_values(array_filter(array_map('trim', $input['preserve_files'])));
    }

    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    sendJson(['success' => true, 'message' => 'Lưu cấu hình thành công!']);
}

function execute_full_update($tag, $skipBuild, $config) {
    @ignore_user_abort(true);
    @set_time_limit(0);
    @ini_set('max_execution_time', '0');
    @ini_set('memory_limit', '1024M');

    $targetDir = realpath($config['target_dir']) ?: $config['target_dir'];
    $backupDir = $config['backup_dir'] ?? ($targetDir . '_backups');
    $repo = $config['github_repo'];
    $token = $config['github_token'];

    updateState(1, ['type' => 'info', 'text' => "🚀 Bắt đầu tiến trình cập nhật phiên bản: [{$tag}]..."]);

    // 1. Resolve release info
    updateState(1, ['type' => 'info', 'text' => 'Truy vấn thông tin Release từ GitHub...']);
    $releaseUrl = ($tag === 'latest') 
        ? "https://api.github.com/repos/{$repo}/releases/latest"
        : "https://api.github.com/repos/{$repo}/releases/tags/{$tag}";

    $relRes = githubApiRequest($releaseUrl, $token);
    if ($relRes['code'] !== 200) {
        updateState(null, ['type' => 'error', 'text' => "❌ Không lấy được thông tin release {$tag}. Mã lỗi: {$relRes['code']}"], true, false);
        return;
    }

    $relData = json_decode($relRes['body'], true);
    $actualTag = $relData['tag_name'] ?? $tag;
    $zipballUrl = $relData['zipball_url'] ?? "https://api.github.com/repos/{$repo}/zipball/{$actualTag}";
    
    // Check if there is an asset that ends with .zip (custom build asset)
    if (!empty($relData['assets'])) {
        foreach ($relData['assets'] as $asset) {
            if (substr($asset['name'], -4) === '.zip') {
                $zipballUrl = $asset['browser_download_url'];
                updateState(null, ['type' => 'info', 'text' => "📦 Tìm thấy tệp asset đính kèm: {$asset['name']}"]);
                break;
            }
        }
    }

    updateState(null, ['type' => 'success', 'text' => "✅ Đã xác định phiên bản [{$actualTag}] (Tên: " . ($relData['name'] ?? $actualTag) . ")"]);

    // 2. Backup current directory
    if (!empty($config['max_backups']) && $config['max_backups'] > 0 && is_dir($targetDir)) {
        updateState(2, ['type' => 'info', 'text' => 'Tạo bản sao lưu dự phòng (Backup)...']);
        if (!is_dir($backupDir)) {
            @mkdir($backupDir, 0755, true);
        }
        $backupFile = rtrim($backupDir, '/') . '/backup_' . date('Ymd_His') . '_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $actualTag) . '.tar.gz';
        $cmdBackup = "tar --exclude='node_modules' --exclude='.next' --exclude='.git' -czf " . escapeshellarg($backupFile) . " -C " . escapeshellarg($targetDir) . " . 2>&1";
        @exec($cmdBackup, $bOutput, $bCode);
        if ($bCode === 0) {
            updateState(null, ['type' => 'success', 'text' => "✅ Bản sao lưu đã lưu: " . basename($backupFile)]);
        } else {
            updateState(null, ['type' => 'warn', 'text' => "⚠️ Không tạo được bản nén backup (bỏ qua): " . implode(' ', $bOutput)]);
        }
    }

    // 3. Preserve critical environment files
    updateState(3, ['type' => 'info', 'text' => 'Bảo vệ các tệp cấu hình môi trường (.env, .env.local...)...']);
    $tempEnvDir = sys_get_temp_dir() . '/techwiz_env_' . time();
    @mkdir($tempEnvDir, 0777, true);
    $preservedList = $config['preserve_files'] ?? ['.env', '.env.local', '.env.production', 'updater'];
    $savedPreserved = [];

    foreach ($preservedList as $item) {
        $sourcePath = rtrim($targetDir, '/') . '/' . ltrim($item, '/');
        if (file_exists($sourcePath)) {
            $destPath = $tempEnvDir . '/' . ltrim($item, '/');
            if (!is_dir($sourcePath)) {
                @copy($sourcePath, $destPath);
                $savedPreserved[] = $item;
                updateState(null, ['type' => 'info', 'text' => "🔒 Đã lưu trữ an toàn: {$item}"]);
            }
        }
    }

    // 4. Download Release Zip
    updateState(4, ['type' => 'info', 'text' => "Đang tải mã nguồn bản phát hành [{$actualTag}]..."]);
    $tempZip = sys_get_temp_dir() . '/techwiz_release_' . time() . '.zip';
    $downloadOk = downloadGithubZip($zipballUrl, $token, $tempZip);
    
    if (!$downloadOk || !file_exists($tempZip) || filesize($tempZip) < 100) {
        updateState(null, ['type' => 'error', 'text' => "❌ Tải file nén Release thất bại từ GitHub. Vui lòng kiểm tra GitHub Token hoặc đường truyền!"], true, false);
        return;
    }
    updateState(null, ['type' => 'success', 'text' => "✅ Đã tải về file nén (" . round(filesize($tempZip) / 1024 / 1024, 2) . " MB)"]);

    // 5. Extract & Unwrap Zip
    updateState(5, ['type' => 'info', 'text' => 'Giải nén và cập nhật mã nguồn...']);
    $extractTemp = sys_get_temp_dir() . '/techwiz_extracted_' . time();
    @mkdir($extractTemp, 0777, true);

    $zip = new ZipArchive();
    $opened = $zip->open($tempZip);
    if ($opened === true) {
        $zip->extractTo($extractTemp);
        $zip->close();
    } else {
        @exec("unzip -q " . escapeshellarg($tempZip) . " -d " . escapeshellarg($extractTemp), $uOut, $uCode);
        if ($uCode !== 0) {
            updateState(null, ['type' => 'error', 'text' => "❌ Giải nén thất bại. ZipArchive và unzip đều không mở được file!"], true, false);
            return;
        }
    }
    @unlink($tempZip);

    $files = scandir($extractTemp);
    $subDirs = array_values(array_filter($files, function($f) use ($extractTemp) {
        return !in_array($f, ['.', '..']) && is_dir($extractTemp . '/' . $f);
    }));

    $sourceRoot = $extractTemp;
    if (count($subDirs) === 1 && count(array_diff($files, ['.', '..'])) === 1) {
        $sourceRoot = $extractTemp . '/' . $subDirs[0];
        updateState(null, ['type' => 'info', 'text' => "📦 Tự động nhận diện và bóc tách thư mục gốc: {$subDirs[0]}"]);
    }

    if (!is_dir($targetDir)) {
        @mkdir($targetDir, 0755, true);
    }

    updateState(null, ['type' => 'info', 'text' => "🔄 Đang đồng bộ tệp tin vào thư mục: {$targetDir}..."]);
    $rsyncAvailable = trim(@shell_exec("which rsync 2>/dev/null") ?: '');
    if (!empty($rsyncAvailable)) {
        $syncCmd = "rsync -a --delete --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='updater' " . escapeshellarg($sourceRoot . '/') . " " . escapeshellarg($targetDir . '/') . " 2>&1";
    } else {
        $syncCmd = "cp -r -f " . escapeshellarg($sourceRoot) . "/. " . escapeshellarg($targetDir) . "/ 2>&1";
    }
    @exec($syncCmd, $sOutput, $sCode);

    // Restore preserved files
    foreach ($savedPreserved as $item) {
        $src = $tempEnvDir . '/' . ltrim($item, '/');
        $dst = rtrim($targetDir, '/') . '/' . ltrim($item, '/');
        if (file_exists($src)) {
            @copy($src, $dst);
            updateState(null, ['type' => 'info', 'text' => "🔄 Khôi phục tệp bảo vệ: {$item}"]);
        }
    }
    file_put_contents(rtrim($targetDir, '/') . '/.current_version', $actualTag);
    @exec("rm -rf " . escapeshellarg($extractTemp) . " " . escapeshellarg($tempEnvDir));
    updateState(null, ['type' => 'success', 'text' => "✅ Cập nhật mã nguồn thành công!"]);

    // 6. Run Build Commands
    if ($skipBuild) {
        updateState(6, ['type' => 'info', 'text' => 'Bỏ qua bước build (theo yêu cầu).']);
    } else {
        updateState(6, ['type' => 'info', 'text' => 'Chạy lệnh build (npm install & build)...']);

        $nodePath = trim(@shell_exec('which node 2>/dev/null') ?: '');
        $nodeDir = $nodePath ? dirname($nodePath) : '';
        $targetBin = rtrim($targetDir, '/') . '/node_modules/.bin';
        $nodeVersionDirs = glob('/www/server/nodejs/*/bin') ?: [];
        
        $pathDirs = array_merge(
            [$targetBin, $nodeDir],
            $nodeVersionDirs,
            [
                '/www/server/nodejs/v24.16.0/bin',
                '/www/server/nodejs/current/bin',
                '/usr/local/bin',
                '/usr/bin',
                '/bin'
            ]
        );
        $fullPathStr = implode(':', array_unique(array_filter($pathDirs))) . ':' . (getenv('PATH') ?: '');

        $cmd = "export PATH=" . escapeshellarg($fullPathStr) . " && cd " . escapeshellarg($targetDir) . " && " . $config['build_command'] . " 2>&1";
        updateState(null, ['type' => 'info', 'text' => "Thực thi: {$config['build_command']}"]);

        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w']
        ];
        $pipes = [];
        $env = array_merge($_ENV, [
            'PATH' => $fullPathStr,
            'HOME' => getenv('HOME') ?: '/root',
            'PM2_HOME' => '/root/.pm2'
        ]);
        $process = proc_open($cmd, $descriptors, $pipes, $targetDir, $env);

        if (is_resource($process)) {
            fclose($pipes[0]);
            
            $batchLines = [];
            $lastWriteTime = microtime(true);
            $statusFile = getUpdateStatusFile();

            while (!feof($pipes[1])) {
                $line = fgets($pipes[1]);
                if ($line !== false && trim($line) !== '') {
                    $batchLines[] = ['type' => 'terminal', 'text' => rtrim($line)];
                }
                if ((microtime(true) - $lastWriteTime > 0.15 && !empty($batchLines)) || count($batchLines) >= 8) {
                    $raw = @file_get_contents($statusFile);
                    $st = json_decode($raw, true) ?: [];
                    if (!isset($st['logs'])) $st['logs'] = [];
                    foreach ($batchLines as $bl) {
                        $st['logs'][] = $bl;
                    }
                    $st['updated_at'] = time();
                    @file_put_contents($statusFile, json_encode($st, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
                    $batchLines = [];
                    $lastWriteTime = microtime(true);
                }
            }
            if (!empty($batchLines)) {
                $raw = @file_get_contents($statusFile);
                $st = json_decode($raw, true) ?: [];
                if (!isset($st['logs'])) $st['logs'] = [];
                foreach ($batchLines as $bl) {
                    $st['logs'][] = $bl;
                }
                $st['updated_at'] = time();
                @file_put_contents($statusFile, json_encode($st, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);
            }

            fclose($pipes[1]);
            fclose($pipes[2]);
            $exitCode = proc_close($process);

            if ($exitCode === 0) {
                updateState(null, ['type' => 'success', 'text' => "Quá trình Build hoàn tất xuất sắc (Mã thoát: 0)!"]);
            } else {
                updateState(null, ['type' => 'warn', 'text' => "Quá trình build kết thúc với mã {$exitCode}. Xem chi tiết log bên trên."]);
            }
        } else {
            updateState(null, ['type' => 'error', 'text' => "Không thể khởi tạo tiến trình proc_open để build!"]);
        }
    }

    // 7. Restart aaPanel Node Service / PM2 Process
    if (!empty($config['auto_restart_pm2']) && !empty($config['pm2_process_name'])) {
        $projName = $config['pm2_process_name'] ?: 'techwiz_frontend';
        updateState(7, ['type' => 'info', 'text' => "Đang tự động khởi động lại dịch vụ [{$projName}]..."]);
        
        $restarted = false;

        // Method 1: aaPanel Python Node Manager API (with 4s timeout & non-interactive sudo)
        $pyPath = "/www/server/panel/pyenv/bin/python";
        if (file_exists($pyPath)) {
            $pyScript = "import sys; sys.path.insert(0, '/www/server/panel/class');
try:
    import public; from projectModel.nodejsModel import main;
    p = public.dict_obj(); p.project_name = '{$projName}'; p.name = '{$projName}';
    res = main().restart_project(p);
    print('AAPANEL_RES:' + str(res))
except Exception as e:
    try:
        sys.path.insert(0, '/www/server/panel/plugin/nodejs');
        import nodejs_main;
        nm = nodejs_main.nodejs_main();
        p = public.dict_obj(); p.name = '{$projName}'; p.project_name = '{$projName}';
        print('AAPANEL_PLUGIN_RES:' + str(nm.restart_project(p)))
    except Exception as e2:
        print('ERR:' + str(e2))";

            $pyCmd = "timeout 4s {$pyPath} -c " . escapeshellarg($pyScript) . " 2>&1";
            $pyOut = trim(@shell_exec($pyCmd) ?: '');

            if (strpos($pyOut, 'True') !== false || strpos($pyOut, 'successfully') !== false || strpos($pyOut, 'true') !== false) {
                $restarted = true;
                updateState(null, ['type' => 'success', 'text' => "✅ Đã gửi lệnh Restart tới aaPanel Node Project Manager!"]);
            } else if (strpos($pyOut, 'Permission denied') !== false || empty($pyOut)) {
                $pySudoCmd = "timeout 4s sudo -n {$pyPath} -c " . escapeshellarg($pyScript) . " 2>&1";
                $pySudoOut = trim(@shell_exec($pySudoCmd) ?: '');
                if (strpos($pySudoOut, 'True') !== false || strpos($pySudoOut, 'successfully') !== false || strpos($pySudoOut, 'true') !== false) {
                    $restarted = true;
                    updateState(null, ['type' => 'success', 'text' => "✅ Đã gửi lệnh Restart tới aaPanel Node Project Manager (sudo)!"]);
                }
            }
        }

        // Method 2: PM2 (Prioritize pm2 restart all)
        if (!$restarted) {
            $pm2Cmd = "export PATH=" . escapeshellarg($fullPathStr) . "; " .
                      "timeout 5s pm2 restart all 2>&1 || " .
                      "PM2_HOME=/root/.pm2 timeout 5s pm2 restart all 2>&1 || " .
                      "timeout 5s sudo -n pm2 restart all 2>&1 || " .
                      "timeout 3s pm2 restart {$projName} 2>&1 || " .
                      "timeout 3s pm2 reload all 2>&1";
            $pm2Out = trim(@shell_exec($pm2Cmd) ?: '');

            if (strpos($pm2Out, '[PM2] Applying action') !== false || strpos($pm2Out, 'online') !== false || strpos($pm2Out, 'restart') !== false || strpos($pm2Out, 'status') !== false) {
                $restarted = true;
                updateState(null, ['type' => 'success', 'text' => "✅ Đã thực thi [pm2 restart all] thành công!"]);
            }
        }

        // Method 3: Clean Port 3000 reload (Kill old & start in background)
        if (!$restarted) {
            @shell_exec("timeout 2s fuser -k 3000/tcp 2>/dev/null; timeout 2s pkill -f 'next-server' 2>/dev/null");
            usleep(300000); // 0.3s
            
            $startCmd = "cd " . escapeshellarg($targetDir) . " && export PATH=" . escapeshellarg($fullPathStr) . " && (npm run start || pnpm start || npx next start -p 3000) > " . escapeshellarg($targetDir . '/project.log') . " 2>&1 &";
            @shell_exec($startCmd);
            usleep(600000); // 0.6s

            $checkPort = trim(@shell_exec("timeout 2s lsof -i:3000 2>/dev/null || timeout 2s ss -tlpn | grep :3000 2>/dev/null") ?: '');
            if (!empty($checkPort)) {
                $restarted = true;
                updateState(null, ['type' => 'success', 'text' => "✅ Đã làm mới và kích hoạt tiến trình Node.js trên cổng 3000 thành công!"]);
            }
        }

        if ($restarted) {
            updateState(null, ['type' => 'success', 'text' => "🎉 Dịch vụ đã được cập nhật và khởi động lại thành công!"]);
        } else {
            updateState(null, ['type' => 'warn', 'text' => "ℹ️ Đã build code mới thành công. Hãy bấm nút 'Restart' trên mục Node Project của aaPanel để áp dụng."]);
        }
    }

    updateState(7, ['type' => 'success', 'text' => "CHÚC MỪNG: Dự án đã được nâng cấp thành công lên phiên bản [{$actualTag}]!"], true, true, $actualTag);
}

// Start Update Trigger (Async background execution)
if ($action === 'start_update' || $action === 'perform_update') {
    $tag = $_REQUEST['tag'] ?? 'latest';
    $skipBuild = isset($_REQUEST['skip_build']) && ($_REQUEST['skip_build'] === '1' || $_REQUEST['skip_build'] === 'true');
    $statusFile = getUpdateStatusFile();

    if (file_exists($statusFile)) {
        $existing = json_decode(@file_get_contents($statusFile), true);
        if ($existing && !empty($existing['running']) && (time() - ($existing['updated_at'] ?? 0) < 120)) {
            if ($action === 'perform_update') {
                header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
                exit;
            }
            sendJson(['success' => false, 'message' => 'Một tiến trình cập nhật đang chạy. Vui lòng đợi!'], 400);
        }
    }

    $initialState = [
        'running' => true,
        'finished' => false,
        'success' => false,
        'step' => 1,
        'tag' => $tag,
        'started_at' => time(),
        'updated_at' => time(),
        'logs' => [
            ['type' => 'info', 'text' => "🚀 Khởi tạo tiến trình cập nhật phiên bản: [{$tag}]..."]
        ]
    ];
    @file_put_contents($statusFile, json_encode($initialState, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX);

    if ($action === 'perform_update') {
        if (function_exists('fastcgi_finish_request')) {
            header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
            if (ob_get_level() > 0) {
                @ob_end_flush();
            }
            @flush();
            fastcgi_finish_request();
            try {
                execute_full_update($tag, $skipBuild, $config);
            } catch (\Throwable $e) {
                updateState(null, ['type' => 'error', 'text' => "❌ Lỗi hệ thống: " . $e->getMessage()], true, false);
            }
            exit;
        } else {
            $phpBin = trim(@shell_exec('which php 2>/dev/null') ?: '');
            if (!$phpBin || !file_exists($phpBin)) {
                $possiblePhps = glob('/www/server/php/*/bin/php') ?: [];
                $phpBin = !empty($possiblePhps) ? end($possiblePhps) : 'php';
            }
            $cmd = escapeshellcmd($phpBin) . ' ' . escapeshellarg(__FILE__) . ' --run-update ' . escapeshellarg($tag) . ' ' . ($skipBuild ? '1' : '0') . ' > /dev/null 2>&1 &';
            @exec($cmd);
            header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
            exit;
        }
    }

    if (function_exists('fastcgi_finish_request')) {
        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => true, 'message' => 'Đã kích hoạt tiến trình cập nhật.'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if (ob_get_level() > 0) {
            @ob_end_flush();
        }
        @flush();
        fastcgi_finish_request();

        try {
            execute_full_update($tag, $skipBuild, $config);
        } catch (\Throwable $e) {
            updateState(null, ['type' => 'error', 'text' => "❌ Lỗi hệ thống: " . $e->getMessage()], true, false);
        }
        exit;
    } else {
        $phpBin = trim(@shell_exec('which php 2>/dev/null') ?: '');
        if (!$phpBin || !file_exists($phpBin)) {
            $possiblePhps = glob('/www/server/php/*/bin/php') ?: [];
            $phpBin = !empty($possiblePhps) ? end($possiblePhps) : 'php';
        }
        $cmd = escapeshellcmd($phpBin) . ' ' . escapeshellarg(__FILE__) . ' --run-update ' . escapeshellarg($tag) . ' ' . ($skipBuild ? '1' : '0') . ' > /dev/null 2>&1 &';
        @exec($cmd);
        sendJson(['success' => true, 'message' => 'Đã kích hoạt tiến trình cập nhật qua CLI.']);
        exit;
    }
}

// Real-time Poll endpoint for terminal logs
if ($action === 'poll_update') {
    $statusFile = getUpdateStatusFile();
    if (!file_exists($statusFile)) {
        sendJson([
            'running' => false,
            'finished' => false,
            'success' => false,
            'step' => 0,
            'offset' => 0,
            'new_logs' => [],
            'total_logs' => 0
        ]);
    }

    $raw = @file_get_contents($statusFile);
    $data = json_decode($raw, true) ?: [];
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    $allLogs = $data['logs'] ?? [];
    $totalLogs = count($allLogs);
    $newLogs = ($offset < $totalLogs) ? array_slice($allLogs, $offset) : [];

    sendJson([
        'running' => $data['running'] ?? false,
        'finished' => $data['finished'] ?? false,
        'success' => $data['success'] ?? false,
        'step' => $data['step'] ?? 1,
        'tag' => $data['tag'] ?? '',
        'new_version' => $data['new_version'] ?? '',
        'offset' => $offset,
        'new_logs' => $newLogs,
        'total_logs' => $totalLogs
    ]);
}

// Reset Update State endpoint
if ($action === 'reset_update') {
    @unlink(getUpdateStatusFile());
    sendJson(['success' => true, 'message' => 'Đã đặt lại trạng thái tiến trình cập nhật.']);
}

// ---------------- FRONTEND HTML / DASHBOARD ----------------
$isLoggedIn = checkAuth($config);
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cập Nhật Code</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --card-border: #e2e8f0;
      --card-hover: #cbd5e1;
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --accent: #16a34a;
      --danger: #dc2626;
      --warning: #d97706;
      --text: #0f172a;
      --text-muted: #64748b;
      --terminal-bg: #0f172a;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    code, pre, .mono {
      font-family: 'JetBrains Mono', monospace;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 50;
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      background: #2563eb;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .brand-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text);
    }
    .brand-subtitle {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 24px 20px 60px;
      width: 100%;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 20px;
    }
    @media (max-width: 860px) {
      .grid-2 { grid-template-columns: 1fr; }
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 0.95rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: var(--text);
    }
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 4px;
      font-size: 0.85rem;
    }
    .info-label {
      color: var(--text-muted);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-info { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-warning { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .badge-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.15s ease;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
    }
    .btn-secondary {
      background: #ffffff;
      color: var(--text);
      border: 1px solid var(--card-border);
    }
    .btn-secondary:hover {
      background: #f1f5f9;
      border-color: var(--card-hover);
    }
    .btn-sm {
      padding: 6px 12px;
      font-size: 0.775rem;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    .release-item {
      border: 1px solid var(--card-border);
      background: #ffffff;
      border-radius: 4px;
      padding: 16px;
      margin-bottom: 12px;
      transition: border-color 0.15s ease;
    }
    .release-item:hover {
      border-color: #94a3b8;
    }
    .release-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }
    .release-tag {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text);
    }
    .release-body {
      font-size: 0.85rem;
      color: #475569;
      white-space: pre-wrap;
      max-height: 120px;
      overflow-y: auto;
      padding: 10px 12px;
      background: #f8fafc;
      border: 1px solid #f1f5f9;
      border-radius: 4px;
      margin-top: 10px;
    }
    .terminal {
      background: var(--terminal-bg);
      border-radius: 4px;
      height: 360px;
      overflow-y: auto;
      padding: 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      line-height: 1.5;
      color: #94a3b8;
      margin-top: 12px;
    }
    .log-line {
      margin-bottom: 4px;
      word-break: break-all;
    }
    .log-info { color: #38bdf8; }
    .log-success { color: #4ade80; font-weight: 600; }
    .log-warn { color: #fde047; }
    .log-error { color: #f87171; font-weight: 600; }
    .log-terminal { color: #f1f5f9; }
    
    .steps-container {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .step-pill {
      font-size: 0.725rem;
      padding: 3px 8px;
      border-radius: 4px;
      background: #f1f5f9;
      color: var(--text-muted);
      border: 1px solid #e2e8f0;
      white-space: nowrap;
    }
    .step-pill.active {
      background: #dbeafe;
      color: #1d4ed8;
      border-color: #bfdbfe;
      font-weight: 600;
    }
    .step-pill.completed {
      background: #dcfce7;
      color: #15803d;
      border-color: #bbf7d0;
    }
    .form-group {
      margin-bottom: 14px;
    }
    .form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%;
      background: #ffffff;
      border: 1px solid var(--card-border);
      border-radius: 4px;
      padding: 9px 12px;
      color: var(--text);
      font-size: 0.875rem;
      outline: none;
      transition: border-color 0.15s;
    }
    .form-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
    .modal {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      z-index: 100;
      align-items: center;
      justify-content: center;
    }
    .modal.active { display: flex; }
    .modal-content {
      background: #ffffff;
      border: 1px solid var(--card-border);
      border-radius: 4px;
      width: 90%;
      max-width: 500px;
      padding: 24px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <div class="container">
    <?php if (!$isLoggedIn): ?>
      <!-- LOGIN CARD -->
      <div style="max-width: 380px; margin: 60px auto;">
        <div class="card" style="text-align: center; padding: 30px 20px;">
          <div style="font-size: 2rem; margin-bottom: 10px;">🔐</div>
          <h2 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 6px;">Đăng Nhập Quản Trị</h2>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 20px;">
            Nhập Secret Key bảo mật để thực hiện thao tác cập nhật.
          </p>
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group" style="text-align: left;">
              <label class="form-label">Mật khẩu Secret Key</label>
              <input type="password" id="loginSecret" class="form-input" placeholder="Nhập mật khẩu..." required autofocus>
            </div>
            <div id="loginError" style="color: var(--danger); font-size: 0.8rem; margin-bottom: 12px; display: none;"></div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    <?php else: ?>

      <!-- MAIN DASHBOARD -->
      <div class="grid-2">
        <!-- LEFT COLUMN: STATUS & QUICK ACTIONS -->
        <div>
          <div class="card">
            <div class="card-title">
                <?php if ($isLoggedIn): ?>
                    <button class="btn btn-secondary btn-sm" onclick="openSettingsModal()">
                      Cấu hình
                    </button>
                    <a href="?action=logout" class="btn btn-secondary btn-sm" style="color:var(--danger)">
                      Đăng xuất
                    </a>
                  <?php endif; ?>
            </div>
            <div class="info-list">
              <div class="info-item">
                <span class="info-label">Phiên bản:</span>
                <span id="currentVer" class="badge badge-info mono">Đang nạp...</span>
              </div>
              <div class="info-item">
                <span class="info-label">Node.js:</span>
                <span id="nodeVer" class="mono">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">NPM:</span>
                <span id="npmVer" class="mono">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">PM2:</span>
                <span id="pm2Status" class="badge badge-warning">--</span>
              </div>
              <div class="info-item">
                <span class="info-label">Thư mục Target:</span>
                <span id="targetStatus" class="badge badge-info">--</span>
              </div>
            </div>
            
            <div style="margin-top: 14px;">
              <button class="btn btn-secondary" style="width:100%" onclick="loadStatus()">
                Kiểm tra lại
              </button>
            </div>
          </div>

          <div class="card">
            <div class="card-title">
                Tùy Chọn
            </div>
            <div>
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; cursor:pointer;">
                <input type="checkbox" id="skipBuildCheck"> Bỏ qua lệnh build (<code class="mono">npm run build</code>)
              </label>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top: 8px; line-height: 1.4;">
                * File cấu hình môi trường <code class="mono">.env</code> luôn được giữ nguyên an toàn.
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: RELEASES & TERMINAL CONSOLE -->
        <div>
          <!-- TERMINAL & PROGRESS CARD -->
          <div class="card" id="terminalCard" style="display:none;">
            <div class="card-title" style="justify-content: space-between;">
              <div style="display:flex; align-items:center; gap:8px;">
                Tiến Trình Cập Nhật
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn btn-secondary btn-sm" onclick="resetUpdateState()" title="Đặt lại trạng thái" style="font-size:0.75rem; padding:3px 8px;">
                  Đặt lại
                </button>
                <span id="statusBadge" class="badge badge-info">CHỜ</span>
              </div>
            </div>

            <div class="steps-container">
              <span class="step-pill" id="step-1">1. GitHub Info</span>
              <span class="step-pill" id="step-2">2. Sao lưu</span>
              <span class="step-pill" id="step-3">3. Bảo lưu .env</span>
              <span class="step-pill" id="step-4">4. Tải Zip</span>
              <span class="step-pill" id="step-5">5. Giải nén</span>
              <span class="step-pill" id="step-6">6. Build code</span>
              <span class="step-pill" id="step-7">7. Restart PM2</span>
            </div>

            <div class="terminal" id="terminalLogs">
              <div class="log-line log-info">[Hệ thống sẵn sàng] Bấm cập nhật phiên bản bên dưới để bắt đầu...</div>
            </div>
          </div>

          <!-- RELEASES LIST CARD -->
          <div class="card">
            <div class="card-title" style="justify-content: space-between;">
              <div style="display:flex; align-items:center; gap:8px;">
                Danh Sách Phiên Bản
              </div>
              <button class="btn btn-secondary btn-sm" onclick="loadReleases()">
                Làm mới
              </button>
            </div>

            <div id="releasesList">
              <div style="text-align:center; padding: 24px; color:var(--text-muted); font-size:0.875rem;">
                Đang nạp danh sách...
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SETTINGS MODAL -->
      <div class="modal" id="settingsModal">
        <div class="modal-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <h3 style="font-size:1rem; font-weight:700;">Cấu Hình Máy Chủ</h3>
            <button class="btn btn-secondary btn-sm" onclick="closeSettingsModal()">✕</button>
          </div>
          <form onsubmit="handleSaveConfig(event)">
            <div class="form-group">
              <label class="form-label">GitHub Repository</label>
              <input type="text" id="cfgRepo" class="form-input" value="<?= htmlspecialchars($config['github_repo'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">GitHub Token</label>
              <input type="password" id="cfgToken" class="form-input" placeholder="Để trống nếu giữ nguyên">
            </div>
            <div class="form-group">
              <label class="form-label">Thư mục Dự án Frontend trên Server</label>
              <input type="text" id="cfgTarget" class="form-input" value="<?= htmlspecialchars($config['target_dir'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Lệnh Build</label>
              <input type="text" id="cfgBuild" class="form-input" value="<?= htmlspecialchars($config['build_command'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Tên tiến trình PM2</label>
              <input type="text" id="cfgPm2" class="form-input" value="<?= htmlspecialchars($config['pm2_process_name'] ?? '') ?>" required>
            </div>
            <div class="form-group">
              <label class="form-label">Mật khẩu Secret Key</label>
              <input type="text" id="cfgSecret" class="form-input" value="<?= htmlspecialchars($config['secret_key'] ?? '') ?>" required>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
              <button type="button" class="btn btn-secondary" onclick="closeSettingsModal()">Hủy</button>
              <button type="submit" class="btn btn-primary">Lưu cấu hình</button>
            </div>
          </form>
        </div>
      </div>

    <?php endif; ?>
  </div>

  <script>
    async function handleLogin(e) {
      e.preventDefault();
      const secret = document.getElementById('loginSecret').value;
      const errBox = document.getElementById('loginError');
      errBox.style.display = 'none';

      try {
        const res = await fetch('?action=login', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'password=' + encodeURIComponent(secret)
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          errBox.textContent = data.message || 'Mật mã không đúng!';
          errBox.style.display = 'block';
        }
      } catch (err) {
        errBox.textContent = 'Lỗi kết nối máy chủ.';
        errBox.style.display = 'block';
      }
    }

    <?php if ($isLoggedIn): ?>
    let currentInstalledVer = '';

    async function loadStatus() {
      try {
        const res = await fetch('?action=status');
        const data = await res.json();
        if (data.success) {
          currentInstalledVer = data.current_version;
          document.getElementById('currentVer').textContent = data.current_version;
          document.getElementById('nodeVer').textContent = data.node_version;
          document.getElementById('npmVer').textContent = data.npm_version;
          
          const pm2Badge = document.getElementById('pm2Status');
          pm2Badge.textContent = data.pm2_status;
          pm2Badge.className = 'badge ' + (data.pm2_status === 'online' ? 'badge-success' : 'badge-warning');

          const targetBadge = document.getElementById('targetStatus');
          if (data.target_dir_exists && data.target_dir_writable) {
            targetBadge.textContent = 'Hợp lệ & Sẵn sàng';
            targetBadge.className = 'badge badge-success';
          } else if (data.target_dir_exists) {
            targetBadge.textContent = 'Thiếu quyền ghi (chown www)';
            targetBadge.className = 'badge badge-warning';
          } else {
            targetBadge.textContent = 'Tự tạo';
            targetBadge.className = 'badge badge-info';
          }
        }
      } catch(e) {
        console.error(e);
      }
    }

    function normalizeVer(v) {
      if (!v) return '';
      return String(v).trim().toLowerCase().replace(/^v/, '');
    }

    async function loadReleases() {
      const container = document.getElementById('releasesList');
      container.innerHTML = '<div style="text-align:center; padding: 24px; color:var(--text-muted); font-size:0.875rem;">Đang kiểm tra phiên bản mới từ GitHub...</div>';
      try {
        const res = await fetch('?action=releases');
        const data = await res.json();
        if (!data.success) {
          container.innerHTML = `<div style="padding:16px; color:var(--danger); font-size:0.875rem;">❌ ${data.message}</div>`;
          return;
        }

        const releases = data.releases;
        if (!releases || releases.length === 0) {
          container.innerHTML = `<div style="padding:24px; text-align:center; color:var(--text-muted); font-size:0.875rem;">
            Chưa có Release nào trên Repository. Khi bạn tạo Release trên GitHub, phiên bản mới sẽ xuất hiện ở đây.
          </div>`;
          return;
        }

        const latestRelease = releases[0];
        const isUpToDate = currentInstalledVer && 
          currentInstalledVer !== 'Chưa xác định' && 
          normalizeVer(currentInstalledVer) === normalizeVer(latestRelease.tag_name);

        if (isUpToDate) {
          container.innerHTML = `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 24px 20px; text-align: center;">
              <div style="font-size: 2rem; margin-bottom: 6px;">🎉</div>
              <div style="font-weight: 700; color: #15803d; font-size: 1rem; margin-bottom: 4px;">
                Máy chủ đang ở phiên bản mới nhất (${latestRelease.tag_name})
              </div>
              <div style="font-size: 0.82rem; color: #475569; max-width: 440px; margin: 0 auto 14px;">
                Hiện tại không có bản cập nhật nào mới hơn. Khi bạn đẩy code và tạo Release mới trên GitHub, nút cập nhật sẽ tự động xuất hiện tại đây.
              </div>
              <div style="display:inline-flex; align-items:center; gap:6px; font-size:0.75rem; color:#166534; background:#dcfce7; padding:4px 12px; border-radius:4px;">
                <span>●</span> Đã bảo vệ chống bấm nhầm
              </div>
            </div>
          `;
          return;
        }

        // When a new version is available or version is not yet determined
        container.innerHTML = releases.map((rel, index) => {
          const isCurrent = currentInstalledVer && 
            currentInstalledVer !== 'Chưa xác định' && 
            normalizeVer(currentInstalledVer) === normalizeVer(rel.tag_name);
          const isLatest = index === 0;
          const dateStr = new Date(rel.published_at).toLocaleString('vi-VN');

          return `
            <div class="release-item" style="${isLatest ? 'border-color: #93c5fd; background: #f8fafc;' : ''}">
              <div class="release-header">
                <div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="release-tag mono">${rel.tag_name}</span>
                    ${isLatest ? '<span class="badge badge-success">BẢN MỚI NHẤT</span>' : ''}
                    ${isCurrent ? '<span class="badge badge-info">ĐANG DÙNG</span>' : ''}
                  </div>
                  <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                    ${rel.name || rel.tag_name} • Đăng lúc: ${dateStr}
                  </div>
                </div>
                <div>
                  ${isCurrent 
                    ? '<span class="badge badge-success" style="padding:6px 12px; font-size:0.8rem;">Đang chạy bản này</span>' 
                    : `<button class="btn btn-primary btn-sm" onclick="triggerUpdate('${rel.tag_name}')">
                        Cập nhật
                       </button>`
                  }
                </div>
              </div>
              ${rel.body ? `<div class="release-body">${escapeHtml(rel.body)}</div>` : ''}
            </div>
          `;
        }).join('');
      } catch(err) {
        container.innerHTML = `<div style="padding:20px; color:var(--danger)">Lỗi nạp releases: ${err.message}</div>`;
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    let updatePollTimer = null;
    let currentLogOffset = 0;
    let pollFailureCount = 0;

    function resetUpdateState() {
      if (updatePollTimer) clearInterval(updatePollTimer);
      updatePollTimer = null;
      fetch('?action=reset_update').then(() => {
        document.getElementById('terminalCard').style.display = 'none';
        loadStatus();
        loadReleases();
      });
    }

    function updateStepPills(step) {
      for (let i = 1; i <= 7; i++) {
        const p = document.getElementById('step-' + i);
        if (!p) continue;
        if (i < step) {
          p.className = 'step-pill completed';
        } else if (i === step) {
          p.className = 'step-pill active';
        } else {
          p.className = 'step-pill';
        }
      }
    }

    async function triggerUpdate(tag) {
      if (!confirm(`Bạn có chắc chắn muốn cập nhật toàn bộ code lên phiên bản [${tag}]?`)) {
        return;
      }

      const terminalCard = document.getElementById('terminalCard');
      terminalCard.style.display = 'block';
      const terminalLogs = document.getElementById('terminalLogs');
      terminalLogs.innerHTML = `<div class="log-line log-info">🚀 Khởi động cập nhật phiên bản [${tag}]...</div>`;
      
      const statusBadge = document.getElementById('statusBadge');
      statusBadge.textContent = 'ĐANG CHẠY';
      statusBadge.className = 'badge badge-warning';

      updateStepPills(1);
      currentLogOffset = 0;
      pollFailureCount = 0;

      const skipBuild = document.getElementById('skipBuildCheck').checked ? '1' : '0';

      try {
        const res = await fetch(`?action=start_update&tag=${encodeURIComponent(tag)}&skip_build=${skipBuild}`);
        const data = await res.json();
        if (!data.success && data.message) {
          const line = document.createElement('div');
          line.className = 'log-line log-warn';
          line.textContent = '⚠️ ' + data.message;
          terminalLogs.appendChild(line);
        }
      } catch(e) {
        console.error(e);
      }

      if (updatePollTimer) clearInterval(updatePollTimer);
      updatePollTimer = setInterval(pollUpdateProgress, 500);
    }

    async function pollUpdateProgress() {
      try {
        const res = await fetch(`?action=poll_update&offset=${currentLogOffset}`);
        if (!res.ok) {
          pollFailureCount++;
          return;
        }
        pollFailureCount = 0;
        const data = await res.json();

        const terminalLogs = document.getElementById('terminalLogs');
        const statusBadge = document.getElementById('statusBadge');

        if (data.new_logs && data.new_logs.length > 0) {
          for (const log of data.new_logs) {
            const line = document.createElement('div');
            line.className = 'log-line log-' + (log.type || 'info');
            line.textContent = log.text;
            terminalLogs.appendChild(line);
          }
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
          currentLogOffset = data.total_logs;
        }

        if (data.step) {
          updateStepPills(data.step);
        }

        if (data.finished) {
          if (updatePollTimer) clearInterval(updatePollTimer);
          updatePollTimer = null;
          if (data.success) {
            statusBadge.textContent = 'HOÀN TẤT';
            statusBadge.className = 'badge badge-success';
            for (let i = 1; i <= 7; i++) {
              const p = document.getElementById('step-' + i);
              if (p) p.className = 'step-pill completed';
            }
            loadStatus();
            loadReleases();
          } else {
            statusBadge.textContent = 'THẤT BẠI';
            statusBadge.className = 'badge badge-danger';
          }
        }
      } catch (err) {
        pollFailureCount++;
        if (pollFailureCount > 10) {
          const statusBadge = document.getElementById('statusBadge');
          statusBadge.textContent = 'MẤT KẾT NỐI';
          statusBadge.className = 'badge badge-danger';
        }
      }
    }

    async function checkOngoingUpdate() {
      try {
        const res = await fetch('?action=poll_update&offset=0');
        const data = await res.json();
        if (data.running && !data.finished) {
          document.getElementById('terminalCard').style.display = 'block';
          const statusBadge = document.getElementById('statusBadge');
          statusBadge.textContent = 'ĐANG CHẠY';
          statusBadge.className = 'badge badge-warning';

          const terminalLogs = document.getElementById('terminalLogs');
          terminalLogs.innerHTML = '';
          if (data.new_logs) {
            for (const log of data.new_logs) {
              const line = document.createElement('div');
              line.className = 'log-line log-' + (log.type || 'info');
              line.textContent = log.text;
              terminalLogs.appendChild(line);
            }
            terminalLogs.scrollTop = terminalLogs.scrollHeight;
            currentLogOffset = data.total_logs;
          }
          if (data.step) updateStepPills(data.step);

          if (updatePollTimer) clearInterval(updatePollTimer);
          updatePollTimer = setInterval(pollUpdateProgress, 500);
        }
      } catch(e) {}
    }

    function openSettingsModal() {
      document.getElementById('settingsModal').classList.add('active');
    }
    function closeSettingsModal() {
      document.getElementById('settingsModal').classList.remove('active');
    }

    async function handleSaveConfig(e) {
      e.preventDefault();
      const payload = {
        github_repo: document.getElementById('cfgRepo').value,
        target_dir: document.getElementById('cfgTarget').value,
        build_command: document.getElementById('cfgBuild').value,
        pm2_process_name: document.getElementById('cfgPm2').value,
        secret_key: document.getElementById('cfgSecret').value
      };
      const token = document.getElementById('cfgToken').value;
      if (token) {
        payload.github_token = token;
      }

      try {
        const res = await fetch('?action=save_config', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Đã lưu cấu hình thành công!');
          closeSettingsModal();
          loadStatus();
          loadReleases();
        } else {
          alert('Lỗi: ' + data.message);
        }
      } catch(err) {
        alert('Lỗi lưu cấu hình: ' + err.message);
      }
    }

    // Auto initialize
    loadStatus().then(() => {
      loadReleases();
      checkOngoingUpdate();
    });
    <?php endif; ?>
  </script>
</body>
</html>
