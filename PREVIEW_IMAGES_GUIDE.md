# Hướng Dẫn Tạo Preview Images Đa Ngôn Ngữ

## Kích Thước

- **Dimensions**: 1200x630px (Facebook/LinkedIn standard)
- **Format**: PNG hoặc JPG
- **File size**: < 200KB (lý tưởng < 100KB)

## Files Cần Tạo

Tạo các file preview cho từng ngôn ngữ:

1. `preview-vi.png` - Tiếng Việt
2. `preview-en.png` - English
3. `preview-zh.png` - 中文
4. `preview-ja.png` - 日本語
5. `preview-ko.png` - 한국어
6. `preview-th.png` - ไทย
7. `preview-es.png` - Español
8. `preview-fr.png` - Français
9. `preview-de.png` - Deutsch
10. `preview-pt.png` - Português
11. `preview-ru.png` - Русский
12. `preview-ar.png` - العربية

## Nội Dung Preview Image

### Layout:
```
┌─────────────────────────────────┐
│  [Logo/Icon]                    │
│                                 │
│  [App Name - Large]             │
│  [Tagline - Medium]             │
│                                 │
│  [Key Features - Bullet Points]│
│  ✅ Feature 1                   │
│  ✅ Feature 2                   │
│  ✅ Feature 3                   │
│                                 │
│  [Call to Action]               │
│  "Play Now - Free"              │
└─────────────────────────────────┘
```

### Content by Language:

#### Vietnamese (preview-vi.png):
- **App Name**: Thanh Tịnh Dục Vọng
- **Tagline**: Game Cai Nghiện Thủ Dâm Miễn Phí
- **Features**: 
  - Thiền định 32 thể trược
  - Mini-games trị liệu
  - AI tư vấn 24/7
- **CTA**: Chơi Ngay - Miễn Phí

#### English (preview-en.png):
- **App Name**: Pure Mind
- **Tagline**: Free NoFap Recovery Game
- **Features**:
  - Meditation & Therapy
  - Mini-games
  - AI Counseling 24/7
- **CTA**: Play Now - Free

#### Chinese (preview-zh.png):
- **App Name**: 清净欲望
- **Tagline**: 免费戒色游戏
- **Features**:
  - 冥想32身分观想
  - 治疗小游戏
  - AI咨询24/7
- **CTA**: 立即开始 - 免费

## Design Tips

1. **Colors**: 
   - Primary: Gold (#FFD700)
   - Background: Dark blue (#1a1a2e)
   - Text: White

2. **Fonts**:
   - App Name: Bold, large (48-60px)
   - Tagline: Medium (24-30px)
   - Features: Regular (18-20px)

3. **Visual Elements**:
   - Meditation icon
   - Game controller icon
   - AI/robot icon
   - Checkmarks for features

## Tools để Tạo

1. **Canva** (https://canva.com)
   - Template: Social Media Post (1200x630)
   - Free, easy to use

2. **Figma** (https://figma.com)
   - Professional design tool
   - Free for personal use

3. **Photoshop/GIMP**
   - Full control
   - Professional

## Compression

Sau khi tạo, nén ảnh:
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- Target: < 100KB per image

## Testing

Test preview images với:
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/

## Fallback

Nếu không có preview cho ngôn ngữ cụ thể, hệ thống sẽ dùng:
- `preview-en.png` (English) làm fallback
- Hoặc `preview.png` (default)

