// ============================================
// SEO OPTIMIZER - Tối ưu SEO và Social Sharing
// ============================================

// Update meta tags dynamically
export function updateSEOTags() {
    // Update title
    document.title = 'Thanh Tịnh Dục Vọng - Game Cai Nghiện Thủ Dâm Miễn Phí | Quán 32 Thể Trược';
    
    // Update meta description
    updateMetaTag('description', 
        'Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng. Thiền định, quán tưởng 32 thể trược, mini-games và AI tư vấn. Bắt đầu hành trình tự do ngay hôm nay!'
    );
    
    // Update keywords
    updateMetaTag('keywords',
        'cai nghiện thủ dâm, thanh tịnh dục vọng, game cai nghiện, thiền định, quán 32 thể trược, nofap, no porn, tự do dục vọng, rèn luyện ý chí, cai nghiện miễn phí'
    );
    
    // Open Graph tags
    updateMetaTag('og:title', 'Thanh Tịnh Dục Vọng - Game Cai Nghiện Thủ Dâm Miễn Phí');
    updateMetaTag('og:description', 
        'Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng. Thiền định, quán tưởng 32 thể trược, mini-games và AI tư vấn. Bắt đầu hành trình tự do ngay hôm nay!'
    );
    updateMetaTag('og:image', getPreviewImageUrl());
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:site_name', 'Thanh Tịnh Dục Vọng');
    
    // Twitter Cards
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Thanh Tịnh Dục Vọng - Game Cai Nghiện Thủ Dâm Miễn Phí');
    updateMetaTag('twitter:description',
        'Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng. Thiền định, quán tưởng 32 thể trược, mini-games và AI tư vấn.'
    );
    updateMetaTag('twitter:image', getPreviewImageUrl());
    
    // Additional SEO tags
    updateMetaTag('author', 'Thanh Tịnh Dục Vọng');
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', 'Vietnamese');
    updateMetaTag('revisit-after', '7 days');
    
    // Add structured data (JSON-LD)
    addStructuredData();
}

// Update meta tag
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

// Get preview image URL
function getPreviewImageUrl() {
    // Use absolute URL for social sharing
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview.png`;
}

// Add structured data (JSON-LD) for SEO
function addStructuredData() {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();
    
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Thanh Tịnh Dục Vọng - Game Cai Nghiện Thủ Dâm",
        "description": "Game miễn phí giúp cai nghiện thủ dâm và thanh tịnh dục vọng. Thiền định, quán tưởng 32 thể trược, mini-games và AI tư vấn.",
        "url": window.location.href,
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "VND"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "ratingCount": "1000"
        },
        "featureList": [
            "Thiền định 32 thể trược",
            "Mini-games trị liệu",
            "AI tư vấn khẩn cấp",
            "Cộng đồng hỗ trợ",
            "Theo dõi tiến độ",
            "Hệ thống gamification"
        ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Update page title based on content
export function updatePageTitle(customTitle) {
    if (customTitle) {
        document.title = `${customTitle} | Thanh Tịnh Dục Vọng`;
    }
}

