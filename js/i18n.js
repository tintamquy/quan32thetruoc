// ============================================
// I18N - Internationalization System
// Hệ thống đa ngôn ngữ với auto-detect theo IP/geolocation
// ============================================

// Supported languages
export const LANGUAGES = {
    vi: { name: 'Tiếng Việt', flag: '🇻🇳', code: 'vi' },
    en: { name: 'English', flag: '🇺🇸', code: 'en' },
    zh: { name: '中文', flag: '🇨🇳', code: 'zh' },
    ja: { name: '日本語', flag: '🇯🇵', code: 'ja' },
    ko: { name: '한국어', flag: '🇰🇷', code: 'ko' },
    th: { name: 'ไทย', flag: '🇹🇭', code: 'th' },
    es: { name: 'Español', flag: '🇪🇸', code: 'es' },
    fr: { name: 'Français', flag: '🇫🇷', code: 'fr' },
    de: { name: 'Deutsch', flag: '🇩🇪', code: 'de' },
    pt: { name: 'Português', flag: '🇵🇹', code: 'pt' },
    ru: { name: 'Русский', flag: '🇷🇺', code: 'ru' },
    ar: { name: 'العربية', flag: '🇸🇦', code: 'ar' }
};

// Translations
export const TRANSLATIONS = {
    vi: {
        appName: 'Thanh Tịnh Dục Vọng',
        tagline: 'Game Cai Nghiện Thủ Dâm Miễn Phí',
        description: 'Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng. Thiền định, quán tưởng 32 thể trược, mini-games và AI tư vấn. Bắt đầu hành trình tự do ngay hôm nay!',
        playNow: 'Chơi Ngay',
        free: 'Miễn Phí',
        noAds: 'Không Quảng Cáo'
    },
    en: {
        appName: 'Pure Mind - NoFap Recovery Game',
        tagline: 'Free Addiction Recovery Game',
        description: 'Free game to help overcome masturbation addiction and purify desires. Meditation, 32 body parts contemplation, mini-games and AI counseling. Start your freedom journey today!',
        playNow: 'Play Now',
        free: 'Free',
        noAds: 'No Ads'
    },
    zh: {
        appName: '清净欲望 - 戒色游戏',
        tagline: '免费戒色游戏',
        description: '免费游戏帮助戒除手淫成瘾和净化欲望。冥想、32身分观想、小游戏和AI咨询。今天开始你的自由之旅！',
        playNow: '立即开始',
        free: '免费',
        noAds: '无广告'
    },
    ja: {
        appName: '清浄な心 - 禁欲回復ゲーム',
        tagline: '無料の依存症回復ゲーム',
        description: '自慰依存症を克服し、欲望を浄化する無料ゲーム。瞑想、32身分観想、ミニゲーム、AIカウンセリング。今日から自由への旅を始めましょう！',
        playNow: '今すぐ始める',
        free: '無料',
        noAds: '広告なし'
    },
    ko: {
        appName: '순수한 마음 - 금욕 회복 게임',
        tagline: '무료 중독 회복 게임',
        description: '자위 중독을 극복하고 욕망을 정화하는 무료 게임. 명상, 32신체 관상, 미니게임 및 AI 상담. 오늘부터 자유의 여정을 시작하세요!',
        playNow: '지금 시작',
        free: '무료',
        noAds: '광고 없음'
    },
    th: {
        appName: 'จิตใจบริสุทธิ์ - เกมฟื้นฟูการงดเว้น',
        tagline: 'เกมฟรีช่วยเลิกเสพติด',
        description: 'เกมฟรีช่วยเอาชนะการเสพติดการสำเร็จความใคร่และชำระล้างความปรารถนา การทำสมาธิ การพิจารณา 32 ส่วนของร่างกาย เกมย่อย และการให้คำปรึกษา AI เริ่มต้นการเดินทางสู่เสรีภาพของคุณวันนี้!',
        playNow: 'เริ่มเลย',
        free: 'ฟรี',
        noAds: 'ไม่มีโฆษณา'
    },
    es: {
        appName: 'Mente Pura - Juego de Recuperación NoFap',
        tagline: 'Juego Gratis de Recuperación de Adicción',
        description: 'Juego gratuito para ayudar a superar la adicción a la masturbación y purificar los deseos. Meditación, contemplación de 32 partes del cuerpo, mini-juegos y asesoramiento IA. ¡Comienza tu viaje hacia la libertad hoy!',
        playNow: 'Jugar Ahora',
        free: 'Gratis',
        noAds: 'Sin Anuncios'
    },
    fr: {
        appName: 'Esprit Pur - Jeu de Récupération NoFap',
        tagline: 'Jeu Gratuit de Récupération d\'Addiction',
        description: 'Jeu gratuit pour aider à surmonter l\'addiction à la masturbation et purifier les désirs. Méditation, contemplation de 32 parties du corps, mini-jeux et conseil IA. Commencez votre voyage vers la liberté aujourd\'hui!',
        playNow: 'Jouer Maintenant',
        free: 'Gratuit',
        noAds: 'Sans Publicité'
    },
    de: {
        appName: 'Reiner Geist - NoFap Erholungsspiel',
        tagline: 'Kostenloses Suchterholungsspiel',
        description: 'Kostenloses Spiel zur Überwindung der Masturbationssucht und Reinigung der Wünsche. Meditation, Betrachtung von 32 Körperteilen, Mini-Spiele und KI-Beratung. Beginnen Sie heute Ihre Reise zur Freiheit!',
        playNow: 'Jetzt Spielen',
        free: 'Kostenlos',
        noAds: 'Keine Werbung'
    },
    pt: {
        appName: 'Mente Pura - Jogo de Recuperação NoFap',
        tagline: 'Jogo Gratuito de Recuperação de Vício',
        description: 'Jogo gratuito para ajudar a superar o vício em masturbação e purificar desejos. Meditação, contemplação de 32 partes do corpo, mini-jogos e aconselhamento IA. Comece sua jornada para a liberdade hoje!',
        playNow: 'Jogar Agora',
        free: 'Grátis',
        noAds: 'Sem Anúncios'
    },
    ru: {
        appName: 'Чистый Разум - Игра Восстановления NoFap',
        tagline: 'Бесплатная Игра Восстановления от Зависимости',
        description: 'Бесплатная игра для преодоления зависимости от мастурбации и очищения желаний. Медитация, созерцание 32 частей тела, мини-игры и ИИ-консультирование. Начните свое путешествие к свободе сегодня!',
        playNow: 'Играть Сейчас',
        free: 'Бесплатно',
        noAds: 'Без Рекламы'
    },
    ar: {
        appName: 'عقل نقي - لعبة التعافي من الإدمان',
        tagline: 'لعبة مجانية للتعافي من الإدمان',
        description: 'لعبة مجانية للمساعدة في التغلب على إدمان الاستمناء وتنقية الرغبات. التأمل، تأمل 32 جزء من الجسم، ألعاب صغيرة واستشارة الذكاء الاصطناعي. ابدأ رحلتك نحو الحرية اليوم!',
        playNow: 'العب الآن',
        free: 'مجاني',
        noAds: 'بدون إعلانات'
    }
};

// Country to language mapping
const COUNTRY_LANGUAGE_MAP = {
    'VN': 'vi', 'US': 'en', 'GB': 'en', 'AU': 'en', 'CA': 'en', 'NZ': 'en',
    'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'en',
    'JP': 'ja',
    'KR': 'ko',
    'TH': 'th',
    'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es',
    'FR': 'fr', 'BE': 'fr', 'CH': 'fr',
    'DE': 'de', 'AT': 'de',
    'PT': 'pt', 'BR': 'pt',
    'RU': 'ru',
    'SA': 'ar', 'AE': 'ar', 'EG': 'ar'
};

let currentLanguage = 'vi'; // Default

// Detect language from browser/IP
export async function detectLanguage() {
    // 1. Check localStorage first
    const savedLang = localStorage.getItem('preferred_language');
    if (savedLang && TRANSLATIONS[savedLang]) {
        currentLanguage = savedLang;
        return currentLanguage;
    }
    
    // 2. Check browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0];
    if (TRANSLATIONS[langCode]) {
        currentLanguage = langCode;
        return currentLanguage;
    }
    
    // 3. Try to detect from IP (using free API)
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const detectedLang = COUNTRY_LANGUAGE_MAP[countryCode] || 'en';
        if (TRANSLATIONS[detectedLang]) {
            currentLanguage = detectedLang;
            return currentLanguage;
        }
    } catch (error) {
        console.log('Could not detect country, using default');
    }
    
    // 4. Default to English if not Vietnamese
    if (langCode !== 'vi') {
        currentLanguage = 'en';
    }
    
    return currentLanguage;
}

// Set language
export function setLanguage(langCode) {
    if (TRANSLATIONS[langCode]) {
        currentLanguage = langCode;
        localStorage.setItem('preferred_language', langCode);
        updatePageLanguage();
        return true;
    }
    return false;
}

// Get current language
export function getCurrentLanguage() {
    return currentLanguage;
}

// Get translation
export function t(key) {
    const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return translations[key] || key;
}

// Update page language
export function updatePageLanguage() {
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    
    // Update title and meta tags
    updateSEOTagsForLanguage(lang);
    
    // Update UI elements
    updateUIElements();
}

// Update SEO tags for language
function updateSEOTagsForLanguage(lang) {
    const trans = TRANSLATIONS[lang];
    if (!trans) return;
    
    // Update title
    document.title = `${trans.appName} - ${trans.tagline}`;
    
    // Update meta description
    updateMetaTag('description', trans.description);
    updateMetaTag('og:title', `${trans.appName} - ${trans.tagline}`);
    updateMetaTag('og:description', trans.description);
    updateMetaTag('twitter:title', `${trans.appName} - ${trans.tagline}`);
    updateMetaTag('twitter:description', trans.description);
    
    // Update preview image based on language
    const previewImage = getPreviewImageForLanguage(lang);
    updateMetaTag('og:image', previewImage);
    updateMetaTag('twitter:image', previewImage);
}

// Get preview image for language
function getPreviewImageForLanguage(lang) {
    const baseUrl = window.location.origin;
    // Preview images: preview-vi.png, preview-en.png, etc.
    return `${baseUrl}/preview-${lang}.png`;
}

// Update meta tag helper
function updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`) || 
               document.querySelector(`meta[property="${name}"]`);
    
    if (!meta) {
        meta = document.createElement('meta');
        if (name.startsWith('og:') || name.startsWith('twitter:')) {
            meta.setAttribute('property', name);
        } else {
            meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
}

// Update UI elements
function updateUIElements() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        element.textContent = t(key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = t(key);
    });
}

// Initialize i18n
export async function initI18n() {
    await detectLanguage();
    updatePageLanguage();
    
    // Create language selector
    createLanguageSelector();
}

// Create language selector UI
function createLanguageSelector() {
    const container = document.getElementById('language-settings');
    if (!container) return;
    
    const label = document.createElement('label');
    label.className = 'language-settings-label';
    label.textContent = 'Ngôn ngữ / Language';
    
    const select = document.createElement('select');
    select.id = 'language-select';
    select.className = 'language-select';
    
    Object.entries(LANGUAGES).forEach(([code, lang]) => {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = `${lang.flag} ${lang.name}`;
        if (code === currentLanguage) option.selected = true;
        select.appendChild(option);
    });
    
    container.appendChild(label);
    container.appendChild(select);
    
    select.addEventListener('change', () => {
        const langCode = select.value;
        setLanguage(langCode);
        // Reload page to apply all changes
        window.location.reload();
    });
}

// CSS for language selector
const languageSelectorStyles = `
.language-settings-label {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
}

.language-select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.2);
    color: #fff;
    font-family: inherit;
}

.language-select:focus {
    outline: none;
    border-color: var(--gold-color);
}
`;

if (!document.getElementById('language-selector-styles')) {
    const style = document.createElement('style');
    style.id = 'language-selector-styles';
    style.textContent = languageSelectorStyles;
    document.head.appendChild(style);
}

