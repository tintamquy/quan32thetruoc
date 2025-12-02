# Hướng Dẫn Setup Domain

## Tên Brand Đề Xuất: **PureMind**

### Domain Options:

1. **Primary**: `puremind.pages.dev`
2. **Alternative**: `puremindapp.pages.dev` (nếu bị trùng)

## Cách Đổi Domain Trong Cloudflare Pages

### Bước 1: Deploy Project

1. Vào Cloudflare Dashboard
2. Workers & Pages → Create application → Pages
3. Connect GitHub: `tintamquy/quan32thetruoc`
4. Project name: **puremind** (hoặc tên bạn chọn)
5. Build settings:
   - Framework preset: None
   - Build command: (để trống)
   - Build output directory: `/`
6. Deploy

### Bước 2: Custom Domain (Optional)

Sau khi deploy, bạn sẽ có:
- Default: `puremind.pages.dev`

Nếu muốn custom domain:
1. Vào Pages → puremind → Custom domains
2. Add custom domain: `puremind.com` (nếu bạn có)
3. Follow DNS setup instructions

## Update Code Với Domain Mới

Sau khi chọn domain, cần update:

1. **Firebase Authorized Domains**:
   - Thêm `puremind.pages.dev` vào Firebase Console

2. **Worker CORS**:
   - Update `workers/gemini-proxy.js`:
   ```javascript
   const allowedOrigins = [
       'https://puremind.pages.dev',
       'http://localhost:8000'
   ];
   ```

3. **SEO Tags**:
   - Update `index.html` với domain mới
   - Update `sitemap.xml` với domain mới
   - Update `robots.txt` với domain mới

4. **Canonical URL**:
   - Update trong `index.html`

## Brand Name Update

Nếu chọn tên khác, cần update:

1. `index.html` - Title và meta tags
2. `manifest.json` - App name
3. `README.md` - Project name
4. `js/i18n.js` - Translations
5. Tất cả references trong code

## Testing Domain

Sau khi setup:
1. Test website: `https://puremind.pages.dev`
2. Test Worker: `https://gemini-proxy.phatda.workers.dev`
3. Test Firebase: Authentication và Firestore
4. Test Social Sharing: Facebook, Twitter

