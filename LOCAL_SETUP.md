# Hướng Dẫn Chạy Local

## Vấn Đề CORS

Khi mở file `index.html` trực tiếp (file://), browser sẽ chặn ES modules vì lý do bảo mật. **BẮT BUỘC** phải chạy qua HTTP server.

## Cách 1: Python (Đơn Giản Nhất)

### Python 3:
```bash
cd D:\Projects\quan32thetruoc
python -m http.server 8000
```

### Python 2:
```bash
python -m SimpleHTTPServer 8000
```

Sau đó mở: `http://localhost:8000`

## Cách 2: Node.js (http-server)

```bash
# Cài đặt
npm install -g http-server

# Chạy
cd D:\Projects\quan32thetruoc
http-server -p 8000
```

Mở: `http://localhost:8000`

## Cách 3: VS Code Live Server

1. Cài extension "Live Server" trong VS Code
2. Click chuột phải vào `index.html`
3. Chọn "Open with Live Server"

## Cách 4: PHP

```bash
php -S localhost:8000
```

## Cách 5: Tạo file start.bat (Windows)

Tạo file `start.bat`:
```batch
@echo off
echo Starting local server...
python -m http.server 8000
pause
```

Double-click để chạy!

## Lưu Ý

- **KHÔNG** mở trực tiếp file HTML (file://)
- **PHẢI** chạy qua HTTP server (http://localhost)
- Port 8000 là mặc định, có thể đổi sang port khác

