// ============================================
// TYPING GAME - Gõ Chữ Thanh Tịnh
// Game luyện gõ với các câu nói tích cực
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let currentSentence = '';
let userInput = '';
let startTime = 0;
let gameStarted = false;
let score = 0;

const POSITIVE_SENTENCES = [
    'Tôi đang kiểm soát cuộc đời mình',
    'Mỗi ngày là một cơ hội mới',
    'Tôi mạnh mẽ hơn dục vọng',
    'Thanh tịnh là sức mạnh',
    'Tôi đang trên con đường đúng đắn',
    'Kiên trì là chìa khóa thành công',
    'Nội tâm tôi đang trở nên mạnh mẽ',
    'Tôi tự do và độc lập',
    'Mỗi khoảnh khắc là một lựa chọn',
    'Tôi đang xây dựng tương lai tốt đẹp'
];

// Khởi tạo game
export function initTypingGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">⌨️ Gõ Chữ Thanh Tịnh</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">WPM</div>
                    <div class="game-stat-value" id="typing-wpm">0</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Độ chính xác</div>
                    <div class="game-stat-value" id="typing-accuracy">100%</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="typing-score">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="typing-sentence" class="typing-sentence"></div>
                <div id="typing-input-container" class="typing-input-container">
                    <input type="text" id="typing-input" class="typing-input" placeholder="Bắt đầu gõ..." autocomplete="off">
                </div>
                <div id="typing-progress" class="typing-progress"></div>
            </div>
            <div class="game-controls">
                <button id="start-typing-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="next-sentence-btn" class="game-btn-action" disabled>Câu Tiếp</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-typing-btn').addEventListener('click', startGame);
    document.getElementById('next-sentence-btn').addEventListener('click', nextSentence);
    
    const input = document.getElementById('typing-input');
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && gameStarted) {
            checkSentence();
        }
    });
    
    loadSentence();
}

// Load sentence
function loadSentence() {
    currentSentence = POSITIVE_SENTENCES[Math.floor(Math.random() * POSITIVE_SENTENCES.length)];
    const sentenceElement = document.getElementById('typing-sentence');
    sentenceElement.innerHTML = '';
    
    currentSentence.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.index = index;
        sentenceElement.appendChild(span);
    });
    
    userInput = '';
    document.getElementById('typing-input').value = '';
    updateDisplay();
}

// Bắt đầu game
function startGame() {
    gameStarted = true;
    startTime = Date.now();
    score = 0;
    
    document.getElementById('start-typing-btn').disabled = true;
    document.getElementById('next-sentence-btn').disabled = false;
    document.getElementById('typing-input').focus();
    
    loadSentence();
}

// Xử lý input
function handleInput(e) {
    if (!gameStarted) return;
    
    userInput = e.target.value;
    updateDisplay();
    
    // Tự động check khi gõ xong
    if (userInput.length === currentSentence.length) {
        setTimeout(() => checkSentence(), 100);
    }
}

// Cập nhật display
function updateDisplay() {
    const sentenceElement = document.getElementById('typing-sentence');
    const spans = sentenceElement.querySelectorAll('span');
    
    spans.forEach((span, index) => {
        span.className = '';
        if (index < userInput.length) {
            if (userInput[index] === currentSentence[index]) {
                span.classList.add('correct');
            } else {
                span.classList.add('incorrect');
            }
        } else if (index === userInput.length) {
            span.classList.add('current');
        }
    });
    
    // Update progress
    const progress = (userInput.length / currentSentence.length) * 100;
    document.getElementById('typing-progress').style.width = progress + '%';
}

// Kiểm tra sentence
function checkSentence() {
    if (userInput === currentSentence) {
        // Correct!
        const timeElapsed = (Date.now() - startTime) / 1000; // seconds
        const wpm = Math.round((currentSentence.length / 5) / (timeElapsed / 60));
        const accuracy = 100;
        
        // Calculate score
        const baseScore = Math.round(wpm * 2);
        score += baseScore;
        
        document.getElementById('typing-wpm').textContent = wpm;
        document.getElementById('typing-accuracy').textContent = accuracy + '%';
        document.getElementById('typing-score').textContent = score;
        
        showEncouragementMessage(`Tuyệt vời! WPM: ${wpm}!`);
        
        // Next sentence
        setTimeout(() => {
            startTime = Date.now();
            loadSentence();
        }, 1000);
    }
}

// Câu tiếp theo
function nextSentence() {
    if (gameStarted) {
        startTime = Date.now();
        loadSentence();
    }
}

// CSS
const typingGameStyles = `
.typing-sentence {
    font-size: 24px;
    line-height: 1.8;
    padding: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
    margin: 20px 0;
    min-height: 100px;
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
}

.typing-sentence span {
    padding: 2px;
    border-radius: 3px;
    transition: all 0.2s ease;
}

.typing-sentence span.correct {
    background: rgba(76, 175, 80, 0.3);
    color: #4caf50;
}

.typing-sentence span.incorrect {
    background: rgba(244, 67, 54, 0.3);
    color: #f44336;
    text-decoration: underline;
}

.typing-sentence span.current {
    background: rgba(255, 215, 0, 0.3);
    border-left: 3px solid var(--gold-color);
}

.typing-input-container {
    margin: 20px 0;
}

.typing-input {
    width: 100%;
    padding: 15px;
    font-size: 18px;
    border: 2px solid var(--gold-color);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-light);
    text-align: center;
}

.typing-input:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
}

.typing-progress {
    height: 5px;
    background: linear-gradient(90deg, var(--gold-color), #ffed4e);
    width: 0%;
    transition: width 0.1s ease;
    border-radius: 5px;
    margin: 10px 0;
}
`;

if (!document.getElementById('typing-game-styles')) {
    const style = document.createElement('style');
    style.id = 'typing-game-styles';
    style.textContent = typingGameStyles;
    document.head.appendChild(style);
}

// Export đã có ở đầu file với export function

