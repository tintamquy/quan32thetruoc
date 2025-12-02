# Hướng Dẫn Deploy Cloudflare Worker - Chi Tiết

## Bước 1: Cài Đặt Wrangler CLI

### Windows:
```bash
npm install -g wrangler
```

### Kiểm tra cài đặt:
```bash
wrangler --version
```

## Bước 2: Login vào Cloudflare

```bash
wrangler login
```

Lệnh này sẽ:
1. Mở browser tự động
2. Yêu cầu đăng nhập Cloudflare
3. Authorize Wrangler
4. Lưu credentials

## Bước 3: Deploy Worker

### Di chuyển vào thư mục workers:
```bash
cd D:\Projects\quan32thetruoc\workers
```

### Deploy worker:
```bash
wrangler publish gemini-proxy.js
```

**Lưu ý**: Lần đầu deploy sẽ hỏi:
- Project name: `gemini-proxy` (hoặc tên bạn muốn)
- Compatibility date: `2024-01-01` (hoặc ngày hiện tại)

Sau khi deploy thành công, bạn sẽ thấy:
```
✨ Successfully published your Worker to the following routes:
  - gemini-proxy.your-subdomain.workers.dev
```

**Copy URL này!** Bạn sẽ cần nó ở bước tiếp theo.

## Bước 4: Set API Key Secret

```bash
wrangler secret put GEMINI_API_KEY
```

Khi được hỏi, nhập:
```
AIzaSyDqMRW1GuKQmYLORrD5X2VJbfwLoKqFwL4
```

**Lưu ý**: 
- Không hiển thị khi gõ (bảo mật)
- Nhấn Enter sau khi gõ xong

## Bước 5: Cập Nhật Worker URL trong Code

Mở file `js/ai-counselor.js` và tìm dòng:

```javascript
const WORKER_URL = 'https://gemini-proxy.your-worker.workers.dev';
```

Thay thế bằng URL thực tế từ bước 3:

```javascript
const WORKER_URL = 'https://gemini-proxy.your-subdomain.workers.dev';
```

## Bước 6: Test Worker

### Test bằng curl:
```bash
curl -X POST https://gemini-proxy.your-subdomain.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","userId":"test"}'
```

### Hoặc test trong browser console:
```javascript
fetch('https://gemini-proxy.your-subdomain.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Test', userId: 'test' })
})
.then(r => r.json())
.then(console.log);
```

## Bước 7: Update CORS (Nếu Cần)

Nếu gặp lỗi CORS, mở `workers/gemini-proxy.js` và cập nhật `allowedOrigins`:

```javascript
const allowedOrigins = [
    'https://quan32thetruoc.pages.dev',
    'https://your-domain.com',
    'http://localhost:8000',  // Cho local dev
    'http://127.0.0.1:5500'   // Cho Live Server
];
```

Sau đó deploy lại:
```bash
wrangler publish gemini-proxy.js
```

## Troubleshooting

### Lỗi: "No account ID found"
```bash
wrangler whoami
```
Nếu chưa login, chạy lại `wrangler login`

### Lỗi: "API key not configured"
Kiểm tra secret đã set chưa:
```bash
wrangler secret list
```

Nếu chưa có `GEMINI_API_KEY`, set lại:
```bash
wrangler secret put GEMINI_API_KEY
```

### Lỗi: "Worker not found"
Đảm bảo đang ở đúng thư mục:
```bash
cd workers
ls gemini-proxy.js  # Kiểm tra file tồn tại
```

### Lỗi CORS
1. Kiểm tra `allowedOrigins` trong worker
2. Đảm bảo domain của bạn đã được thêm vào
3. Deploy lại worker

## Quản Lý Worker

### Xem logs:
```bash
wrangler tail
```

### Xem thông tin worker:
```bash
wrangler whoami
```

### List tất cả workers:
Vào Cloudflare Dashboard → Workers & Pages

## Update Worker

Khi cần update code:
1. Sửa file `workers/gemini-proxy.js`
2. Deploy lại:
   ```bash
   wrangler publish gemini-proxy.js
   ```

## Xóa Worker (Nếu Cần)

```bash
wrangler delete gemini-proxy
```

## Lưu Ý Quan Trọng

1. **API Key**: Không bao giờ commit API key vào Git
2. **Secrets**: Chỉ set qua `wrangler secret put`
3. **CORS**: Luôn kiểm tra CORS khi deploy
4. **Testing**: Test kỹ trước khi deploy production

## Next Steps

Sau khi deploy Worker thành công:
1. ✅ Update `WORKER_URL` trong `js/ai-counselor.js`
2. ✅ Test AI counselor trong app
3. ✅ Deploy app lên Cloudflare Pages
4. ✅ Update CORS với domain thực tế

