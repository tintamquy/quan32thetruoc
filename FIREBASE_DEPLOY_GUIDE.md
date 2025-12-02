# Hướng Dẫn Deploy Firebase Rules

## Cách 1: Qua Firebase Console (Dễ Nhất - Khuyến Nghị)

### Bước 1: Vào Firebase Console
1. Mở https://console.firebase.google.com/
2. Đăng nhập với tài khoản Google
3. Chọn project: **thetruoc-4985f**

### Bước 2: Deploy Firestore Rules
1. Vào **Firestore Database** (sidebar bên trái)
2. Click tab **Rules**
3. Mở file `firestore.rules` trong project
4. Copy toàn bộ nội dung
5. Paste vào Firebase Console
6. Click **Publish**

### Bước 3: Tạo Firestore Indexes
1. Vào tab **Indexes**
2. Click **Create Index**
3. Tạo index cho `chat` collection:
   - Collection ID: `chat`
   - Fields: `timestamp` (Descending)
   - Click **Create**
4. Tạo index cho `activities` collection:
   - Collection ID: `activities`
   - Fields: `userId` (Ascending), `timestamp` (Descending)
   - Click **Create**

**Lưu ý**: Indexes có thể mất vài phút để build.

### Bước 4: Thêm Authorized Domains
1. Vào **Authentication** → **Settings**
2. Scroll xuống **Authorized domains**
3. Click **Add domain**
4. Thêm: `puremind.pages.dev`
5. Thêm: `quan32thetruoc.pages.dev` (nếu có)
6. Click **Done**

## Cách 2: Qua Firebase CLI

### Cài Đặt Firebase CLI

**Windows (PowerShell):**
```powershell
npm install -g firebase-tools
```

**Kiểm tra cài đặt:**
```powershell
firebase --version
```

### Login
```powershell
firebase login
```

Lệnh này sẽ mở browser để đăng nhập.

### Initialize Firebase (Nếu chưa có)
```powershell
firebase init firestore
```

Chọn:
- Use an existing project → `thetruoc-4985f`
- Firestore rules file: `firestore.rules`
- Firestore indexes file: `firestore.indexes.json`

### Deploy Rules
```powershell
firebase deploy --only firestore:rules
```

### Deploy Indexes
```powershell
firebase deploy --only firestore:indexes
```

### Deploy Tất Cả
```powershell
firebase deploy --only firestore
```

## Kiểm Tra Sau Khi Deploy

1. **Test Rules**:
   - Thử đăng ký user mới
   - Thử tạo chat message
   - Thử tạo activity

2. **Test Indexes**:
   - Vào Firestore Console
   - Check indexes đã build xong chưa
   - Test query với indexes

3. **Test Authentication**:
   - Thử đăng nhập từ domain mới
   - Kiểm tra không có CORS errors

## Troubleshooting

### Lỗi: "Permission denied"
→ Kiểm tra rules đã deploy đúng chưa
→ Kiểm tra user đã đăng nhập chưa

### Lỗi: "Index not found"
→ Đợi indexes build xong (có thể mất vài phút)
→ Kiểm tra indexes đã tạo đúng chưa

### Lỗi: "Domain not authorized"
→ Thêm domain vào Authorized domains
→ Đợi vài phút để sync

## Lưu Ý

- Rules deploy ngay lập tức
- Indexes có thể mất vài phút để build
- Authorized domains sync trong vài phút
- Test kỹ sau khi deploy

