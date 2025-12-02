# Hướng Dẫn Nén Ảnh Preview

## Tại Sao Cần Nén?

- Ảnh nhỏ hơn = Load nhanh hơn
- Tốt cho SEO (Page Speed)
- Tiết kiệm bandwidth
- Tốt cho mobile users

## Cách Nén Preview.png

### Option 1: Online Tools (Dễ Nhất)

1. **TinyPNG** (https://tinypng.com/)
   - Upload preview.png
   - Download ảnh đã nén
   - Thường giảm 60-80% kích thước

2. **Squoosh** (https://squoosh.app/)
   - Google's tool
   - Có thể điều chỉnh quality
   - Preview trước khi download

3. **Compressor.io** (https://compressor.io/)
   - Hỗ trợ PNG, JPG
   - Giảm kích thước đáng kể

### Option 2: Command Line (Nếu có ImageMagick)

```bash
# Cài ImageMagick (nếu chưa có)
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Nén ảnh
magick preview.png -quality 85 -strip preview-compressed.png
```

### Option 3: Photoshop/GIMP

1. Mở preview.png
2. File → Export → Export As
3. Chọn PNG
4. Giảm quality xuống 80-90%
5. Save

## Kích Thước Khuyến Nghị

- **Kích thước file**: < 200KB (lý tưởng < 100KB)
- **Dimensions**: 1200x630px (Facebook/LinkedIn)
- **Format**: PNG (nếu có text) hoặc JPG (nếu chỉ hình ảnh)

## Kiểm Tra Sau Khi Nén

1. Upload lên website
2. Test với:
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Lưu Ý

- Giữ chất lượng ảnh đủ tốt để đọc được text
- Đảm bảo ảnh vẫn đẹp trên mobile
- Test trên các platform khác nhau

