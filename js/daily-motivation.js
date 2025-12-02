// ============================================
// DAILY MOTIVATION - Lời Động Viên Hàng Ngày
// Hiển thị quotes và lời động viên mỗi ngày
// ============================================

const DAILY_QUOTES = [
    {
        text: "Mỗi ngày bạn không thủ dâm là một ngày bạn lấy lại quyền kiểm soát cuộc đời mình.",
        author: "Thầy Thích Nhất Hạnh"
    },
    {
        text: "Sức mạnh thật sự không phải là không bao giờ ngã, mà là đứng dậy sau mỗi lần ngã.",
        author: "Nelson Mandela"
    },
    {
        text: "Bạn không thể thay đổi quá khứ, nhưng bạn có thể tạo ra tương lai tốt đẹp hơn.",
        author: "Unknown"
    },
    {
        text: "Thanh tịnh không phải là không có dục vọng, mà là không bị dục vọng chi phối.",
        author: "Buddha"
    },
    {
        text: "Mỗi khoảnh khắc là một cơ hội để bắt đầu lại. Hãy chọn sự tự do.",
        author: "Unknown"
    },
    {
        text: "Bạn mạnh mẽ hơn bạn nghĩ. Hãy tin vào chính mình.",
        author: "Unknown"
    },
    {
        text: "Hành trình ngàn dặm bắt đầu từ một bước chân. Bạn đã bắt đầu rồi!",
        author: "Lao Tzu"
    },
    {
        text: "Đừng để quá khứ định nghĩa bạn. Hãy để tương lai truyền cảm hứng cho bạn.",
        author: "Unknown"
    },
    {
        text: "Tự do thật sự là khi bạn không còn là nô lệ của dục vọng.",
        author: "Unknown"
    },
    {
        text: "Bạn đang xây dựng một phiên bản tốt hơn của chính mình mỗi ngày.",
        author: "Unknown"
    },
    {
        text: "Kiên trì là chìa khóa. Mỗi ngày bạn kiên trì là một chiến thắng.",
        author: "Unknown"
    },
    {
        text: "Năng lượng bạn tiết kiệm được từ việc không thủ dâm sẽ chuyển hóa thành sức mạnh.",
        author: "Unknown"
    },
    {
        text: "Bạn không cô đơn trong hành trình này. Có hàng ngàn người đang cùng bạn.",
        author: "Community"
    },
    {
        text: "Mỗi lần bạn từ chối dục vọng, bạn đang rèn luyện ý chí mạnh mẽ hơn.",
        author: "Unknown"
    },
    {
        text: "Hôm nay là ngày mới. Hãy làm nó trở nên ý nghĩa.",
        author: "Unknown"
    }
];

// Lấy quote theo ngày (luôn giống nhau trong cùng một ngày)
export function getDailyQuote() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}

// Hiển thị daily quote
export function showDailyQuote() {
    const quote = getDailyQuote();
    
    const quoteElement = document.createElement('div');
    quoteElement.className = 'daily-quote-banner';
    quoteElement.innerHTML = `
        <div class="quote-content">
            <div class="quote-icon">💫</div>
            <div class="quote-text">
                <p class="quote-main">"${quote.text}"</p>
                <p class="quote-author">— ${quote.author}</p>
            </div>
            <button class="quote-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(quoteElement);
    
    quoteElement.querySelector('.quote-close').addEventListener('click', () => {
        quoteElement.remove();
    });
    
    // Auto hide sau 15 giây
    setTimeout(() => {
        if (quoteElement.parentNode) {
            quoteElement.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => quoteElement.remove(), 500);
        }
    }, 15000);
}

// CSS
const dailyQuoteStyles = `
.daily-quote-banner {
    position: fixed;
    top: 90px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10008;
    max-width: 600px;
    width: 90%;
    animation: quoteSlideDown 0.5s ease;
}

@keyframes quoteSlideDown {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.quote-content {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.95), rgba(255, 237, 78, 0.95));
    padding: 20px 30px;
    border-radius: 15px;
    border: 3px solid var(--text-light);
    box-shadow: 0 10px 40px rgba(255, 215, 0, 0.6);
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
}

.quote-icon {
    font-size: 40px;
    flex-shrink: 0;
}

.quote-text {
    flex: 1;
    color: var(--text-dark);
}

.quote-main {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.6;
    margin-bottom: 5px;
    font-style: italic;
}

.quote-author {
    font-size: 14px;
    opacity: 0.8;
    text-align: right;
}

.quote-close {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 24px;
    color: var(--text-dark);
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
}

.quote-close:hover {
    opacity: 1;
}
`;

if (!document.getElementById('daily-quote-styles')) {
    const style = document.createElement('style');
    style.id = 'daily-quote-styles';
    style.textContent = dailyQuoteStyles;
    document.head.appendChild(style);
}

