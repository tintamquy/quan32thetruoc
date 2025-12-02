# Giải Thích Về Cloudflare Worker

## Tại Sao Cần Worker?

### 1. **Bảo Vệ API Key**
- **Vấn đề**: Nếu đặt API key trực tiếp trong client code (JavaScript), bất kỳ ai cũng có thể xem và lấy API key từ browser DevTools
- **Giải pháp**: Worker chạy trên server của Cloudflare, API key được lưu trong environment variables, không bao giờ lộ ra client

### 2. **CORS và Security**
- Worker có thể kiểm tra origin của request
- Chỉ cho phép requests từ domain được phép
- Có thể thêm rate limiting để tránh abuse

### 3. **Cloudflare Pages Variables/Secrets**
- **Pages Variables**: Chỉ có sẵn ở **build time**, không có ở **runtime**
- Khi user truy cập website, code JavaScript chạy trên browser của họ
- Browser không thể truy cập Pages Variables/Secrets
- **Worker**: Chạy trên server, có thể truy cập secrets ở runtime

## Worker Làm Gì?

1. **Nhận request từ client** (JavaScript trong browser)
2. **Kiểm tra origin** (chỉ cho phép từ domain của bạn)
3. **Lấy API key từ environment** (không lộ ra client)
4. **Gọi Gemini API** với API key
5. **Trả về response** cho client

## Có Thể Dùng Pages Variables Không?

**KHÔNG** - Vì:
- Pages Variables chỉ có ở build time
- Client-side JavaScript không thể truy cập
- Cần runtime access → Phải dùng Worker

## Alternative: Serverless Function

Nếu không muốn dùng Worker, có thể dùng:
- Vercel Serverless Functions
- Netlify Functions
- AWS Lambda

Nhưng Worker là đơn giản nhất và free tier rất tốt!

## Cách Deploy Worker

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Login
wrangler login

# 3. Deploy
cd workers
wrangler publish gemini-proxy.js

# 4. Set secret
wrangler secret put GEMINI_API_KEY
# Nhập: AIzaSyDqMRW1GuKQmYLORrD5X2VJbfwLoKqFwL4
```

## Update Worker URL

Sau khi deploy, lấy URL và cập nhật trong `js/ai-counselor.js`:
```javascript
const WORKER_URL = 'https://gemini-proxy.your-subdomain.workers.dev';
```

