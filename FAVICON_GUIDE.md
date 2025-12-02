# Favicon Setup Guide

## Hiện tại
- Đang dùng `preview.png` làm favicon tạm thời
- Đã được set trong `index.html`

## Tạo Favicon Chuyên Nghiệp

### Option 1: Từ preview.png (Khuyên dùng)
1. Vào https://favicon.io/favicon-converter/
2. Upload `preview.png`
3. Download favicon package
4. Extract vào thư mục `public/` hoặc root
5. Update `index.html` với các file mới

### Option 2: Tạo từ Emoji 🧘
1. Vào https://favicon.io/emoji-favicons/
2. Chọn emoji 🧘
3. Download và extract vào root
4. Update paths trong `index.html`

### Option 3: Tạo từ Text
1. Vào https://favicon.io/text-to-image/
2. Nhập "TT" (Thanh Tịnh)
3. Chọn font và màu phù hợp
4. Download và extract

## Files cần có sau khi tạo:
```
favicon.ico (16x16, 32x32)
favicon-16x16.png
favicon-32x32.png
apple-touch-icon.png (180x180)
android-chrome-192x192.png
android-chrome-512x512.png
```

## Update index.html sau khi có files:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

## Quick Fix (Tạm thời)
Hiện tại đã dùng `preview.png` làm favicon, sẽ hoạt động nhưng không tối ưu.
Để tối ưu, nên tạo favicon riêng với kích thước nhỏ hơn (16x16, 32x32).

