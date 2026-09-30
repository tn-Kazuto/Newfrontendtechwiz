/**
 * TechWiz Release Updater - Node.js Standalone Edition
 * Zero-dependency HTTP Server for aaPanel or any Linux/VPS environment
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const url = require('url');

const CONFIG_PATH = path.join(__dirname, 'config.json');

function loadConfig() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      const defaultCfg = {
        secret_key: "techwiz2026@secure",
        github_repo: "manhconne/techwiz-frontend",
        github_token: "",
        target_dir: path.dirname(__dirname),
        backup_dir: path.dirname(__dirname) + "_backups",
        preserve_files: [".env", ".env.local", ".env.production", "updater"],
        build_command: "npm install && npm run build",
        pm2_process_name: "techwiz-frontend",
        auto_restart_pm2: true,
        port: 3999
      };
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(defaultCfg, null, 2));
      return defaultCfg;
    }
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (e) {
    console.error('Lỗi đọc config:', e);
    return {};
  }
}

let config = loadConfig();
const PORT = process.env.PORT || config.port || 3999;

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (!rc) return list;
  rc.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURI(parts.join('='));
  });
  return list;
}

function checkAuth(req) {
  if (!config.secret_key) return true;
  const cookies = parseCookies(req);
  if (cookies.updater_auth === config.secret_key) return true;
  const authHeader = req.headers['x-secret-key'];
  if (authHeader === config.secret_key) return true;
  return false;
}

function githubApiRequest(apiUrl, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(apiUrl);
    const headers = {
      'User-Agent': 'TechWiz-Updater-Node',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (token) headers['Authorization'] = `Bearer ${token.trim()}`;

    const req = https.get(parsed, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    });
    req.on('error', reject);
  });
}

function downloadFile(fileUrl, token, destPath) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(fileUrl);
    const headers = {
      'User-Agent': 'TechWiz-Updater-Node',
      'Accept': 'application/vnd.github.v3+json'
    };
    if (token) headers['Authorization'] = `Bearer ${token.trim()}`;

    https.get(parsed, { headers }, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location;
        const redirectParsed = new URL(redirectUrl);
        const redirectHeaders = { 'User-Agent': 'TechWiz-Updater-Node' };
        // Don't send GitHub auth token to AWS S3
        if (!redirectUrl.includes('githubusercontent.com') && !redirectUrl.includes('amazonaws.com') && token) {
          redirectHeaders['Authorization'] = `Bearer ${token.trim()}`;
        }
        https.get(redirectParsed, { headers: redirectHeaders }, (rRes) => {
          const file = fs.createWriteStream(destPath);
          rRes.pipe(file);
          file.on('finish', () => file.close(() => resolve(true)));
        }).on('error', reject);
        return;
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Tải file thất bại: HTTP ${res.statusCode}`));
      }

      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(true)));
    }).on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  config = loadConfig();

  // Handle Login
  if (pathname === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!config.secret_key || data.password === config.secret_key) {
          res.writeHead(200, {
            'Content-Type': 'application/json',
            'Set-Cookie': `updater_auth=${encodeURIComponent(config.secret_key)}; Path=/; HttpOnly; SameSite=Lax`
          });
          return res.end(JSON.stringify({ success: true, message: 'Đăng nhập thành công!' }));
        }
        return sendJson(res, { success: false, message: 'Sai mật mã truy cập!' }, 401);
      } catch (e) {
        return sendJson(res, { success: false, message: 'Lỗi parse body' }, 400);
      }
    });
    return;
  }

  // Handle Logout
  if (pathname === '/api/logout') {
    res.writeHead(302, {
      'Set-Cookie': 'updater_auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'Location': '/'
    });
    return res.end();
  }

  // Check auth for API
  if (pathname.startsWith('/api/') && !checkAuth(req)) {
    return sendJson(res, { success: false, message: 'Chưa đăng nhập!' }, 403);
  }

  // Status API
  if (pathname === '/api/status') {
    const targetDir = config.target_dir;
    let currentVer = 'Chưa xác định';
    try {
      const verFile = path.join(targetDir, '.current_version');
      if (fs.existsSync(verFile)) {
        currentVer = fs.readFileSync(verFile, 'utf-8').trim();
      } else {
        const pkgFile = path.join(targetDir, 'package.json');
        if (fs.existsSync(pkgFile)) {
          const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf-8'));
          currentVer = pkg.version || '0.1.0';
        }
      }
    } catch (e) {}

    exec('node -v && npm -v && pm2 -v', (err, stdout) => {
      const parts = (stdout || '').split('\n').map(s => s.trim()).filter(Boolean);
      sendJson(res, {
        success: true,
        current_version: currentVer,
        target_dir: targetDir,
        target_dir_exists: fs.existsSync(targetDir),
        node_version: parts[0] || 'Chưa cài đặt',
        npm_version: parts[1] || 'Chưa cài đặt',
        pm2_version: parts[2] || 'Chưa cài đặt',
        pm2_status: 'online',
        config: {
          github_repo: config.github_repo,
          has_token: !!config.github_token,
          pm2_process_name: config.pm2_process_name,
          build_command: config.build_command
        }
      });
    });
    return;
  }

  // Releases API
  if (pathname === '/api/releases') {
    try {
      const ghRes = await githubApiRequest(`https://api.github.com/repos/${config.github_repo}/releases?per_page=15`, config.github_token);
      if (ghRes.statusCode === 200) {
        return sendJson(res, { success: true, releases: JSON.parse(ghRes.body) });
      }
      return sendJson(res, { success: false, message: `Lỗi GitHub API: ${ghRes.statusCode}` }, 500);
    } catch (e) {
      return sendJson(res, { success: false, message: e.message }, 500);
    }
  }

  // SSE Live Update
  if (pathname === '/api/perform_update') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    const sendSSE = (event, data) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    const tag = parsedUrl.query.tag || 'latest';
    const skipBuild = parsedUrl.query.skip_build === '1';
    const targetDir = config.target_dir;

    sendSSE('log', { type: 'info', text: `🚀 Bắt đầu cập nhật phiên bản [${tag}]...` });
    sendSSE('step', { step: 1, text: 'Truy vấn thông tin Release từ GitHub...' });

    try {
      const relEndpoint = (tag === 'latest')
        ? `https://api.github.com/repos/${config.github_repo}/releases/latest`
        : `https://api.github.com/repos/${config.github_repo}/releases/tags/${tag}`;
      const relRes = await githubApiRequest(relEndpoint, config.github_token);
      if (relRes.statusCode !== 200) {
        sendSSE('log', { type: 'error', text: `❌ Không tìm thấy release ${tag} (HTTP ${relRes.statusCode})` });
        sendSSE('finish', { success: false });
        return res.end();
      }

      const relData = JSON.parse(relRes.body);
      const actualTag = relData.tag_name || tag;
      let downloadUrl = relData.zipball_url;

      if (relData.assets && relData.assets.length > 0) {
        const zipAsset = relData.assets.find(a => a.name.endsWith('.zip'));
        if (zipAsset) downloadUrl = zipAsset.browser_download_url;
      }

      sendSSE('step', { step: 4, text: `Đang tải mã nguồn [${actualTag}]...` });
      const tempZip = path.join(require('os').tmpdir(), `release_${Date.now()}.zip`);
      await downloadFile(downloadUrl, config.github_token, tempZip);
      sendSSE('log', { type: 'success', text: `✅ Tải về thành công file nén!` });

      sendSSE('step', { step: 5, text: 'Giải nén và đồng bộ tệp...' });
      const tempExtract = path.join(require('os').tmpdir(), `extract_${Date.now()}`);
      fs.mkdirSync(tempExtract, { recursive: true });

      exec(`unzip -q "${tempZip}" -d "${tempExtract}"`, (uErr) => {
        if (uErr) {
          sendSSE('log', { type: 'error', text: `❌ Lỗi unzip: ${uErr.message}` });
          sendSSE('finish', { success: false });
          return res.end();
        }

        // Detect wrapped root
        const extractedDirs = fs.readdirSync(tempExtract);
        let srcDir = tempExtract;
        if (extractedDirs.length === 1 && fs.statSync(path.join(tempExtract, extractedDirs[0])).isDirectory()) {
          srcDir = path.join(tempExtract, extractedDirs[0]);
        }

        exec(`rsync -a --delete --exclude='node_modules' --exclude='.next' --exclude='.git' --exclude='updater' --exclude='.env*' "${srcDir}/" "${targetDir}/"`, (rErr) => {
          if (rErr) {
            sendSSE('log', { type: 'error', text: `❌ Lỗi rsync: ${rErr.message}` });
            sendSSE('finish', { success: false });
            return res.end();
          }

          fs.writeFileSync(path.join(targetDir, '.current_version'), actualTag);
          sendSSE('log', { type: 'success', text: `✅ Đã đồng bộ mã nguồn phiên bản [${actualTag}]` });

          if (skipBuild) {
            sendSSE('step', { step: 7, text: 'Bỏ qua build...' });
            restartPm2();
          } else {
            sendSSE('step', { step: 6, text: `Chạy lệnh build: ${config.build_command}...` });
            const [cmd, ...args] = config.build_command.split(' ');
            const child = spawn(config.build_command, { cwd: targetDir, shell: true });
            
            child.stdout.on('data', (d) => sendSSE('log', { type: 'terminal', text: d.toString().trim() }));
            child.stderr.on('data', (d) => sendSSE('log', { type: 'terminal', text: d.toString().trim() }));

            child.on('close', (code) => {
              if (code === 0) {
                sendSSE('log', { type: 'success', text: '✅ Build hoàn tất thành công!' });
              } else {
                sendSSE('log', { type: 'warn', text: `⚠️ Build kết thúc với mã: ${code}` });
              }
              restartPm2();
            });
          }

          function restartPm2() {
            if (config.auto_restart_pm2) {
              sendSSE('step', { step: 7, text: 'Khởi động lại PM2 (pm2 restart all)...' });
              const pm2Proc = config.pm2_process_name || 'techwiz-frontend';
              exec(`pm2 restart all || pm2 reload all || pm2 restart "${pm2Proc}"`, (pErr, pOut) => {
                sendSSE('log', { type: 'info', text: (pOut || '').trim() || 'pm2 restart all executed' });
                sendSSE('step', { step: 8, text: 'Hoàn tất cập nhật!' });
                sendSSE('log', { type: 'success', text: `🎉 Nâng cấp hoàn tất lên [${actualTag}]!` });
                sendSSE('finish', { success: true, new_version: actualTag });
                res.end();
              });
            } else {
              sendSSE('step', { step: 8, text: 'Hoàn tất cập nhật!' });
              sendSSE('finish', { success: true, new_version: actualTag });
              res.end();
            }
          }
        });
      });
    } catch (e) {
      sendSSE('log', { type: 'error', text: `❌ Lỗi: ${e.message}` });
      sendSSE('finish', { success: false });
      res.end();
    }
    return;
  }

  // Serve Single-Page Application (HTML Dashboard)
  const isAuth = checkAuth(req);
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  
  // Render minimal wrapper or serve index.html
  res.end(`
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>TechWiz Updater (Node.js Edition)</title>
      <script>
        // Forwarding to unified PHP UI or Node UI
        window.isNodeServer = true;
      </script>
    </head>
    <body style="background:#090d16; color:#f1f5f9; font-family:sans-serif; text-align:center; padding:60px 20px;">
      <h2>🚀 TechWiz Node.js Updater Server is Running on port ${PORT}!</h2>
      <p style="color:#94a3b8; margin: 15px 0;">Hệ thống cập nhật phiên bản độc lập sẵn sàng kết nối.</p>
      <div style="background:#1e293b; display:inline-block; padding:15px 25px; border-radius:10px; border:1px solid #334155;">
        Target Directory: <code>${config.target_dir}</code><br/>
        GitHub Repo: <code>${config.github_repo}</code>
      </div>
    </body>
    </html>
  `);
});

server.listen(PORT, () => {
  console.log(`[TechWiz Updater] Server running on http://127.0.0.1:${PORT}`);
});
