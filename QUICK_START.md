# Quick Start Guide

## 🚀 Chạy Local (QUAN TRỌNG!)

### ⚠️ LỖI CORS - KHÔNG MỞ TRỰC TIẾP FILE HTML!

**KHÔNG** double-click `index.html` - sẽ bị lỗi CORS!

### ✅ Cách Đúng:

#### Windows:
```bash
# Cách 1: Dùng file .bat (Dễ nhất)
Double-click: start-local.bat

# Cách 2: Dùng Python
cd D:\Projects\quan32thetruoc
python -m http.server 8000

# Sau đó mở: http://localhost:8000
```

#### Mac/Linux:
```bash
# Cách 1: Dùng file .sh
chmod +x start-local.sh
./start-local.sh

# Cách 2: Dùng Python
python3 -m http.server 8000
```

#### VS Code:
1. Cài extension "Live Server"
2. Click chuột phải `index.html`
3. Chọn "Open with Live Server"

## 📋 Checklist Trước Khi Deploy

### 1. ✅ Test Local
- [ ] Chạy local server thành công
- [ ] Tất cả games hoạt động
- [ ] Guest mode hoạt động (không cần đăng nhập)
- [ ] Leaderboard hiển thị

### 2. ✅ Deploy Cloudflare Worker
- [ ] Cài Wrangler: `npm install -g wrangler`
- [ ] Login: `wrangler login`
- [ ] Deploy: `cd workers && wrangler publish gemini-proxy.js`
- [ ] Set secret: `wrangler secret put GEMINI_API_KEY`
- [ ] Copy Worker URL
- [ ] Update `WORKER_URL` trong `js/ai-counselor.js`

### 3. ✅ Deploy Firebase Rules
```bash
firebase deploy --only firestore:rules
```

### 4. ✅ Deploy lên Cloudflare Pages
- [ ] Push code lên GitHub
- [ ] Connect GitHub repo trong Cloudflare Pages
- [ ] Build settings: empty command, output: `/`
- [ ] Deploy

### 5. ✅ Cấu Hình
- [ ] Thêm domain vào Firebase Authorized domains
- [ ] Update CORS trong Worker với domain thực tế
- [ ] Test AI counselor
- [ ] Test chat system

## 🎮 Tính Năng

### ✅ Đã Hoàn Thành:
- ✅ 8 Mini-games (thiền 32 thể trược, memory, breathing, body scan, whack-mole, quiz, typing, color-match)
- ✅ Guest mode (chơi không cần đăng nhập)
- ✅ Public leaderboard (không cần đăng nhập)
- ✅ AI Counselor (Thầy Thích Nhất Hạnh)
- ✅ Chat system
- ✅ Gamification system
- ✅ 3D Minecraft-style world
- ✅ Encouragement system

## 📁 Files Quan Trọng

- `LOCAL_SETUP.md` - Hướng dẫn chạy local
- `DEPLOY_WORKER.md` - Hướng dẫn deploy Worker chi tiết
- `SETUP.md` - Hướng dẫn setup tổng thể
- `OPTIMIZATION.md` - Tối ưu hóa
- `WORKER_EXPLANATION.md` - Giải thích về Worker

## 🐛 Troubleshooting

### Lỗi CORS khi mở file:
→ **PHẢI** chạy qua HTTP server (xem LOCAL_SETUP.md)

### Lỗi Firebase:
→ Kiểm tra Firebase config đúng chưa
→ Kiểm tra Firestore rules đã deploy chưa

### Lỗi Worker:
→ Xem DEPLOY_WORKER.md
→ Kiểm tra API key đã set chưa: `wrangler secret list`

### App không load:
→ Mở Console (F12) xem lỗi
→ Kiểm tra network requests
→ Đảm bảo chạy qua HTTP server

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra console errors (F12)
2. Đọc các file hướng dẫn
3. Kiểm tra checklist trên

