# Hướng Dẫn Setup Chi Tiết

## Bước 1: Cấu Hình Firebase

1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc sử dụng project hiện có
3. Enable Authentication:
   - Vào Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google
4. Tạo Firestore Database:
   - Vào Firestore Database → Create database
   - Chọn mode: Production hoặc Test
   - Chọn location
5. Deploy Firestore Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
6. Firebase config đã có sẵn trong `js/firebase-config.js`

## Bước 2: Deploy Cloudflare Worker

1. Cài đặt Wrangler:
   ```bash
   npm install -g wrangler
   ```

2. Login:
   ```bash
   wrangler login
   ```

3. Deploy worker:
   ```bash
   cd workers
   wrangler publish gemini-proxy.js
   ```

4. Set API key:
   ```bash
   wrangler secret put GEMINI_API_KEY
   ```
   Nhập: `AIzaSyDqMRW1GuKQmYLORrD5X2VJbfwLoKqFwL4`

5. Lấy Worker URL:
   - Vào Cloudflare Dashboard → Workers & Pages
   - Tìm worker `gemini-proxy`
   - Copy URL (ví dụ: `https://gemini-proxy.your-subdomain.workers.dev`)

6. Cập nhật Worker URL trong `js/ai-counselor.js`:
   ```javascript
   const WORKER_URL = 'https://your-worker-url.workers.dev';
   ```

## Bước 3: Deploy lên Cloudflare Pages

### Option 1: Qua GitHub

1. Push code lên GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/quan32thetruoc.git
   git push -u origin main
   ```

2. Trên Cloudflare Dashboard:
   - Vào Pages → Create a project
   - Connect GitHub repository
   - Build settings:
     - Framework preset: None
     - Build command: (để trống)
     - Build output directory: `/`
   - Deploy

### Option 2: Qua Wrangler CLI

```bash
wrangler pages deploy . --project-name=quan32thetruoc
```

## Bước 4: Cấu Hình Domain

1. **Firebase**:
   - Vào Firebase Console → Authentication → Settings
   - Thêm Cloudflare Pages domain vào Authorized domains

2. **Cloudflare Worker**:
   - Update CORS trong `workers/gemini-proxy.js` nếu cần
   - Thêm domain vào `allowedOrigins`

## Bước 5: Kiểm Tra

1. Mở app trên Cloudflare Pages
2. Test đăng ký/đăng nhập
3. Test các mini-games
4. Test AI counselor
5. Test chat system

## Troubleshooting

### Lỗi Firebase
- Kiểm tra Firebase config đúng chưa
- Kiểm tra Firestore rules đã deploy chưa
- Kiểm tra Authentication methods đã enable chưa

### Lỗi Cloudflare Worker
- Kiểm tra API key: `wrangler secret list`
- Kiểm tra Worker URL trong `ai-counselor.js`
- Kiểm tra CORS headers

### Lỗi 3D Scene
- Kiểm tra Three.js CDN đã load chưa
- Kiểm tra console để xem lỗi cụ thể

### Lỗi Images
- Kiểm tra folder `32thetruocimage/` có đủ 32 ảnh
- Kiểm tra path trong `meditation-game.js`

## Notes

- Worker URL phải được cập nhật sau khi deploy
- Firebase config có thể public (theo best practice)
- API key phải được bảo vệ trong Worker (không lộ trên client)

