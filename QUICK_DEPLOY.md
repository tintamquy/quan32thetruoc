# Quick Deploy Guide - 3 Bước Đơn Giản

## Bước 1: Deploy Firebase Rules (5 phút)

### Qua Firebase Console:
1. https://console.firebase.google.com/ → Project `thetruoc-4985f`
2. **Firestore Database** → **Rules**
3. Copy nội dung từ `firestore.rules` → Paste → **Publish**
4. **Indexes** → Tạo 2 indexes (xem `FIREBASE_DEPLOY_GUIDE.md`)
5. **Authentication** → **Settings** → Thêm domain `puremind.pages.dev`

## Bước 2: Deploy Cloudflare Pages (5 phút)

1. https://dash.cloudflare.com/ → **Workers & Pages**
2. **Create application** → **Pages** → **Connect to Git**
3. Chọn repo: `tintamquy/quan32thetruoc`
4. **Project name**: `puremind` ⭐
5. Build: None, Output: `/`
6. **Deploy**

→ Bạn sẽ có: `https://puremind.pages.dev`

## Bước 3: Test (5 phút)

1. Mở `https://puremind.pages.dev`
2. Test guest mode (chơi không cần đăng nhập)
3. Test AI Counselor (chat với Thầy Thích Nhất Hạnh)
4. Test đổi ngôn ngữ (language selector)

## ✅ Xong!

Hệ thống đã sẵn sàng! 🎉

**Worker**: ✅ Đã deploy
**Code**: ✅ Đã push GitHub
**Firebase**: ⏳ Cần deploy rules (Bước 1)
**Pages**: ⏳ Cần deploy (Bước 2)

