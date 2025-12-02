# Thanh Tịnh Dục Vọng - Game Cai Nghiện Thủ Dâm Miễn Phí

**Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng** thông qua thiền định, quán tưởng 32 thể trược, mini-games trị liệu và AI tư vấn. Bắt đầu hành trình tự do ngay hôm nay!

🌐 **Website**: https://quan32thetruoc.pages.dev  
🎮 **Play Now**: Chơi ngay không cần đăng nhập  
🧘 **AI Counselor**: Thầy Thích Nhất Hạnh tư vấn 24/7  
💪 **Free**: Hoàn toàn miễn phí, không quảng cáo

## 🎮 Tính Năng

- **Giao diện 3D Minecraft-style**: Thế giới 3D voxel với các buildings và portals cho mini-games
- **Hệ thống Gamification mạnh mẽ**:
  - Điểm số và cấp độ
  - Streak counter (chuỗi ngày)
  - Achievements và Badges
  - Leaderboard
- **6 Mini-Games**:
  - 🧘 Thiền 32 Thể Trược
  - 🧩 Memory Game
  - 💨 Thở Sâu (4-7-8)
  - 👁️ Quét Cơ Thể (Body Scan)
  - ⚡ Đánh Bay Dục Vọng (Whack-a-Mole)
  - 📚 Quiz Chính Pháp
- **AI Counselor**: Tư vấn khẩn cấp với Gemini AI
- **Chat System**: Cộng đồng hỗ trợ real-time
- **Daily Check-in**: Hệ thống check-in hàng ngày với lời khen ngợi

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **3D Engine**: Three.js
- **Backend**: Firebase (Authentication + Firestore)
- **AI**: Gemini 2.0 Flash API (qua Cloudflare Worker proxy)
- **Deploy**: Cloudflare Pages

## 📁 Cấu Trúc Project

```
quan32thetruoc/
├── index.html
├── css/
│   ├── main.css
│   └── game-ui.css
├── js/
│   ├── firebase-config.js
│   ├── auth.js
│   ├── game-engine.js
│   ├── gamification.js
│   ├── ai-counselor.js
│   ├── chat-system.js
│   ├── main.js
│   └── mini-games/
│       ├── meditation-game.js
│       ├── memory-game.js
│       ├── breathing-game.js
│       ├── body-scan-game.js
│       ├── whack-mole-game.js
│       └── quiz-game.js
├── assets/
│   ├── images/ (32 ảnh thể trược)
│   ├── sounds/
│   └── 3d-models/
├── workers/
│   └── gemini-proxy.js
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── manifest.json
└── README.md
```

## 🚀 Hướng Dẫn Deploy

### Bước 1: Setup Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password và Google)
3. Tạo Firestore database
4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
5. Copy Firebase config vào `js/firebase-config.js` (đã có sẵn)

### Bước 2: Deploy Cloudflare Worker

1. Cài đặt Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login vào Cloudflare:
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
   # Nhập: AIzaSyDqMRW1GuKQmYLORrD5X2VJbfwLoKqFwL4
   ```

5. Lấy Worker URL và cập nhật trong `js/ai-counselor.js`:
   ```javascript
   const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev';
   ```

### Bước 3: Deploy lên Cloudflare Pages

1. Push code lên GitHub:
   ```bash
   git init
   git remote add origin https://github.com/tintamquy/quan32thetruoc.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Trên Cloudflare Dashboard:
   - Vào Pages → Create a project
   - Connect GitHub repository
   - Build settings:
     - Build command: (để trống - static site)
     - Build output directory: `/`
   - Deploy

3. Update Firebase Settings:
   - Thêm Cloudflare Pages domain vào Authorized domains trong Firebase Console
   - Update CORS trong Worker nếu cần

### Bước 4: Cấu Hình

1. **Firebase**: Đã được cấu hình sẵn trong `js/firebase-config.js`
2. **Cloudflare Worker**: Update `WORKER_URL` trong `js/ai-counselor.js`
3. **Images**: Đảm bảo folder `32thetruocimage/` có đủ 32 ảnh thể trược

## 🔒 Bảo Mật

- ✅ API keys được bảo vệ trong Cloudflare Worker (không lộ trên client)
- ✅ Firebase Security Rules bảo vệ Firestore
- ✅ CORS được cấu hình đúng
- ✅ Input validation và sanitization

## 📱 PWA Support

App hỗ trợ PWA với `manifest.json`. Có thể install như native app trên mobile.

## 🎯 Hệ Thống Gamification

### Điểm và Cấp độ
- Check-in hàng ngày: +100 điểm
- Hoàn thành mini-game: +50 điểm
- Thiền định: +10 điểm/phút
- Chat khuyến khích: +20 điểm
- Level up mỗi 1000 điểm

### Achievements
- 🏆 Chiến Binh Thanh Tịnh (7 ngày streak)
- 💎 Kim Cương Bất Hoại (30 ngày streak)
- 🌟 Bậc Thầy Nội Tâm (90 ngày streak)
- 🔥 Phá Trần Xuất Tục (180 ngày streak)
- ⭐ Giác Ngộ Viên Mãn (365 ngày streak)
- 🧘 Thiền Định Đại Sư (100 session thiền)
- 🎮 Game Master Thanh Tịnh (hoàn thành tất cả games)
- 💬 Thiện Tri Thức (giúp đỡ 50+ người)
- 🎯 Kiên Định Bất Động (perfect check-in 30 ngày)
- 🦅 Tự Do Giải Thoát (level 50+)

## 🐛 Troubleshooting

### Lỗi Firebase
- Kiểm tra Firebase config đúng chưa
- Kiểm tra Firestore rules đã deploy chưa
- Kiểm tra Authentication đã enable chưa

### Lỗi Cloudflare Worker
- Kiểm tra API key đã set chưa: `wrangler secret list`
- Kiểm tra CORS headers
- Kiểm tra Worker URL trong `ai-counselor.js`

### Lỗi 3D Scene
- Kiểm tra Three.js đã load chưa
- Kiểm tra console để xem lỗi cụ thể

## 📝 Notes

- Code được viết bằng Vanilla JavaScript (không dùng framework)
- Comments bằng tiếng Việt
- Error handling cho tất cả API calls
- Loading states cho async operations
- Responsive design (mobile-first)

## 📄 License

MIT License

## 👥 Contributors

- Initial work by [Your Name]

## 🙏 Acknowledgments

- Three.js cho 3D engine
- Firebase cho backend
- Google Gemini cho AI
- Cloudflare cho hosting và Workers

---

**Lưu ý**: Đây là một dự án giáo dục và hỗ trợ. Mục đích là giúp người dùng có một công cụ hỗ trợ trong hành trình thanh tịnh của mình.

