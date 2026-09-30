# 🚀 Hướng Dẫn Sử Dụng Thư Mục Cập Nhật Tự Động (aaPanel Updater)

Thư mục `updater/` là một công cụ **hoàn toàn độc lập** với dự án chính. Mục đích là để bạn triển khai lên **aaPanel**, truy cập qua trình duyệt web và cập nhật phiên bản code mới từ **GitHub Releases** chỉ với 1 cú click chuột, không cần phải đóng gói zip thủ công rồi upload qua aaPanel nữa.

---

## 🌟 Tính Năng Nổi Bật

1. **Giao diện Web Trực quan (Dark Mode & Glassmorphism)**:
   - Danh sách toàn bộ các phiên bản Releases được lấy trực tiếp từ GitHub repository `manhconne/techwiz-frontend`.
   - Xem changelog / ghi chú cập nhật của từng phiên bản.
   - Nút **"🚀 Cập nhật bản này"** cho bất kỳ phiên bản nào.
2. **Theo dõi tiến trình trực tiếp (Live Terminal Streaming - SSE)**:
   - Hiển thị từng dòng lệnh terminal chạy trên VPS/Server (`npm install`, `npm run build`, `pm2 restart`).
3. **Bảo tồn an toàn tệp cấu hình**:
   - Tự động bảo vệ và giữ nguyên các tệp `.env`, `.env.local`, `.env.production` không bị mất hoặc ghi đè.
4. **Tự động sao lưu (Backup)**:
   - Tự động tạo bản nén sao lưu trước khi cập nhật để có thể rollback khi cần.
5. **Khởi động lại PM2 tự động**:
   - Tự động chạy `pm2 reload` hoặc `pm2 restart` tiến trình web để người dùng thấy ngay thay đổi mà không cần SSH vào server.
6. **Bảo mật bằng Secret Key**:
   - Chỉ người có mật khẩu / Secret Key mới có quyền truy cập và kích hoạt cập nhật.

---

## 📁 Cấu Trúc Thư Mục `updater/`

```text
updater/
├── config.json       # Tệp cấu hình (Token, Đường dẫn thư mục web, Lệnh build, PM2...)
├── index.php         # Dashboard quản lý & API Backend (Khuyên dùng trên aaPanel)
├── server.js         # Backend Node.js độc lập (Dành cho trường hợp không dùng PHP)
├── package.json      # Metadata & script khởi chạy Node.js
└── README.md         # Hướng dẫn chi tiết
```

---

## ⚙️ Cấu Hình `config.json`

Mở file [config.json](file:///c:/Users/Admin/Downloads/techwiz-frontend/updater/config.json) và chỉnh sửa các thông số:

```json
{
  "secret_key": "techwiz2026@secure",
  "github_repo": "manhconne/techwiz-frontend",
  "github_token": "ghp_xxxxxxxxxxxxxxxxxxxxxx",
  "target_dir": "/www/wwwroot/techwiz-frontend",
  "backup_dir": "/www/wwwroot/techwiz-frontend_backups",
  "preserve_files": [
    ".env",
    ".env.local",
    ".env.production",
    "updater"
  ],
  "build_command": "npm install && npm run build",
  "pm2_process_name": "techwiz-frontend",
  "auto_restart_pm2": true,
  "max_backups": 3
}
```

### Giải thích các trường:
- `secret_key`: Mật mã để đăng nhập vào trang web cập nhật (Hãy đổi thành mật khẩu của riêng bạn).
- `github_repo`: Tên repository GitHub (`manhconne/techwiz-frontend`).
- `github_token`: GitHub Personal Access Token (PAT).
  > **Lưu ý**: Nếu repository của bạn là **Private**, bạn **bắt buộc** phải điền token này để script có thể tải mã nguồn. Nếu repository là Public, bạn vẫn nên tạo 1 token đọc (read-only) để tránh bị GitHub giới hạn 60 lượt gọi API/giờ.
- `target_dir`: Đường dẫn tuyệt đối đến thư mục chứa mã nguồn web trên VPS aaPanel (Ví dụ: `/www/wwwroot/techwiz-frontend`).
- `backup_dir`: Thư mục lưu các bản sao lưu zip trước khi nâng cấp.
- `preserve_files`: Danh sách các tệp tin cấu hình nhạy cảm sẽ được giữ nguyên vẹn.
- `build_command`: Lệnh biên dịch mã nguồn (Mặc định: `npm install && npm run build`).
- `pm2_process_name`: Tên tiến trình PM2 đang chạy Next.js trên server.

---

## 🔑 Hướng Dẫn Tạo GitHub Token (Personal Access Token)

1. Đăng nhập vào GitHub -> Nhấp vào Avatar góc trên cùng bên phải -> Chọn **Settings**.
2. Cuộn xuống dưới cùng bên menu trái -> Chọn **Developer Settings**.
3. Chọn **Personal access tokens** -> **Tokens (classic)**.
4. Bấm **Generate new token (classic)**:
   - **Note**: `TechWiz aaPanel Updater`
   - **Expiration**: Chọn thời hạn (ví dụ `90 days` hoặc `No expiration`).
   - **Select scopes**: Tích chọn `repo` (Toàn quyền đọc/ghi mã nguồn).
5. Bấm **Generate token** và sao chép mã token (bắt đầu bằng `ghp_...`).
6. Dán mã token này vào mục `github_token` trong `config.json` hoặc nhập trực tiếp trong giao diện web.

---

## 🛠️ Hướng Dẫn Cài Đặt Lên aaPanel

### Cách 1: Sử dụng Subdomain riêng với PHP (Khuyên dùng nhất, nhanh & tiện nhất)

Trên aaPanel, PHP được cài đặt sẵn và tối ưu rất tốt:

1. Vào aaPanel -> **Website** -> **Add site**:
   - **Domain**: `update.yourdomain.com` (ví dụ: `update.techwiz.com`).
   - **Document Root**: Trỏ vào thư mục `/www/wwwroot/updater` (Upload toàn bộ thư mục `updater` lên đây).
   - **PHP Version**: Chọn bất kỳ bản PHP nào (PHP 7.4, 8.0, 8.1, 8.2...).
2. Cấp quyền cho thư mục target dự án:
   - Mở Terminal aaPanel và chạy lệnh cấp quyền cho user `www` có thể build và thay thế file:
     ```bash
     chown -R www:www /www/wwwroot/techwiz-frontend
     chown -R www:www /www/wwwroot/updater
     ```
3. Truy cập vào domain `http://update.yourdomain.com`:
   - Nhập `Secret Key` (mặc định: `techwiz2026@secure`).
   - Bạn sẽ thấy toàn bộ danh sách phiên bản và giao diện trực quan!

---

### Cách 2: Sử dụng đường dẫn thư mục con trên cùng Domain chính (Nginx Alias)

Nếu website chính của bạn chạy trên cổng PM2 (ví dụ Next.js cổng 3000), bạn có thể cấu hình Nginx để đường dẫn `domain.com/updater/` chạy vào PHP Updater:

1. Mở aaPanel -> **Website** -> Bấm vào website chính -> Chọn thẻ **URL rewrite** hoặc **Config file (Nginx)**.
2. Thêm đoạn cấu hình sau vào trong khối `server { ... }`:

```nginx
location /updater/ {
    alias /www/wwwroot/updater/;
    index index.php index.html;
    
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/tmp/php-cgi-80.sock; # Chỉnh lại phiên bản PHP bạn đang dùng
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $request_filename;
    }
}
```

3. Bấm **Save** và reload Nginx. Giờ bạn có thể vào `https://yourdomain.com/updater/`.

---

### Cách 3: Chạy bằng Node.js thuần (Nếu máy chủ không cài PHP)

1. Mở Terminal aaPanel tại thư mục `updater`:
   ```bash
   cd /www/wwwroot/updater
   pm2 start server.js --name "techwiz-updater"
   ```
2. Thêm Reverse Proxy trong Nginx trỏ vào cổng `3999`.

---

## 🚀 Quy Trình Đẩy Code & Cập Nhật Hàng Ngày

Từ bây giờ, quy trình cập nhật web chỉ gồm 3 bước cực kỳ đơn giản:

### Bước 1: Sửa code và commit ở máy Local
```bash
git add .
git commit -m "Tính năng mới hoặc sửa giao diện"
git push origin main
```

### Bước 2: Tạo Release Phiên bản
Cách nhanh nhất bằng dòng lệnh Git:
```bash
# Tạo tag phiên bản mới
git tag v1.0.1

# Đẩy tag lên GitHub
git push origin v1.0.1
```
*(Hoặc vào GitHub Web: Vào mục **Releases** -> Bấm **Draft a new release** -> Chọn tag và gõ nội dung mô tả phiên bản -> Bấm **Publish release**)*

### Bước 3: Vào trang Updater và Cập nhật
1. Mở trình duyệt vào link `https://update.yourdomain.com` (hoặc `https://yourdomain.com/updater/`).
2. Phiên bản `v1.0.1` bạn vừa tạo sẽ tự động xuất hiện với huy hiệu **MỚI NHẤT**.
3. Bấm nút **"🚀 Cập nhật bản này"**.
4. Hệ thống sẽ tự động:
   - Tải code của release `v1.0.1` từ GitHub.
   - Giải nén đè vào thư mục `/www/wwwroot/techwiz-frontend`.
   - Giữ nguyên các tệp `.env`.
   - Chạy `npm install && npm run build`.
   - Chạy `pm2 reload techwiz-frontend`.
   - Toàn bộ log hiển thị trực tiếp dạng Terminal trên màn hình.

Không cần phải nén zip bằng tay, không cần upload qua aaPanel, an toàn và nhanh chóng!
