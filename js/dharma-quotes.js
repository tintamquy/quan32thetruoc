// ============================================
// DHARMA QUOTES
// Trích dẫn kinh điển về tai hại của ái dục
// ============================================

const DHARMA_QUOTES = [
    {
        text: 'Ái dục sinh sầu, sinh sợ. Thoát ái dục, không sầu không sợ.',
        source: 'Kinh Pháp Cú 216'
    },
    {
        text: 'Không lửa nào như lửa dục, không ách nào như ách sân hận. Người buông bỏ dục vọng sẽ được ngủ yên.',
        source: 'Kinh Pháp Cú 202–203'
    },
    {
        text: 'Quán thân này gồm tóc, lông, da, thịt, gân, xương... Chẳng có gì đáng ái luyến; chỉ có người si mới chấp vào thân.',
        source: 'Kinh Quán Niệm Thân'
    },
    {
        text: 'Như dòng nước cuốn, ái dục cuốn trôi người không tỉnh giác. Người biết quán bất tịnh sẽ vượt qua dòng chảy.',
        source: 'Tạp A-hàm 1076'
    },
    {
        text: 'Ái dục như món mồi ngọt tẩm độc. Người trí nhìn thấy mà tránh xa, kẻ ngu ăn vào rồi chịu khổ.',
        source: 'Kinh Trung A-hàm, Phẩm Ái Dục'
    }
];

let popupTimeout = null;
let previousQuoteIndex = -1;

export function initDharmaQuotes() {
    rotateInlineQuote();
    setInterval(rotateInlineQuote, 45000);
    
    setTimeout(() => showDharmaPopup(), 6000);
    setInterval(() => showDharmaPopup(), 90000);
    
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            rotateInlineQuote();
        }
    });
}

function rotateInlineQuote() {
    const container = document.getElementById('inline-dharma-quote');
    if (!container) return;
    
    const quote = getRandomQuote();
    container.innerHTML = `
        <p class="quote">"${quote.text}"</p>
        <p class="source">— ${quote.source}</p>
    `;
}

function showDharmaPopup() {
    if (document.hidden) return;
    
    removeExistingPopup();
    
    const quote = getRandomQuote();
    const popup = document.createElement('div');
    popup.className = 'dharma-popup';
    popup.innerHTML = `
        <h4>⚠️ Tai hại của ái dục</h4>
        <p>${quote.text}</p>
        <p class="popup-source">${quote.source}</p>
        <button class="popup-close">Con đã rõ</button>
    `;
    
    document.body.appendChild(popup);
    
    const closeBtn = popup.querySelector('.popup-close');
    const remove = () => {
        if (popup.parentNode) {
            popup.classList.add('fade-out');
            setTimeout(() => popup.remove(), 200);
        }
        if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
        }
    };
    
    closeBtn?.addEventListener('click', remove);
    popupTimeout = setTimeout(remove, 12000);
}

function removeExistingPopup() {
    const existing = document.querySelector('.dharma-popup');
    if (existing) existing.remove();
    if (popupTimeout) {
        clearTimeout(popupTimeout);
        popupTimeout = null;
    }
}

function getRandomQuote() {
    let index = Math.floor(Math.random() * DHARMA_QUOTES.length);
    if (index === previousQuoteIndex) {
        index = (index + 1) % DHARMA_QUOTES.length;
    }
    previousQuoteIndex = index;
    return DHARMA_QUOTES[index];
}

