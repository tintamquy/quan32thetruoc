// ============================================
// MEMORY GAME - Matching Game
// Game lật thẻ ghép đôi với hình ảnh thanh tịnh
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameStarted = false;

// Symbols cho cards (emoji)
const CARD_SYMBOLS = ['🧘', '🌟', '💎', '🔥', '⭐', '🏆', '💫', '✨', '🌙', '☀️', '🌊', '🌿'];

// Khởi tạo game
export function initMemoryGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🧩 Memory Game - Thanh Tịnh</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Nước đi</div>
                    <div class="game-stat-value" id="memory-moves">0</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Cặp đã ghép</div>
                    <div class="game-stat-value" id="memory-matched">0/6</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="memory-points">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="memory-board" class="memory-board"></div>
            </div>
            <div class="game-controls">
                <button id="start-memory-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="reset-memory-btn" class="game-btn-action">Chơi Lại</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-memory-btn').addEventListener('click', startGame);
    document.getElementById('reset-memory-btn').addEventListener('click', resetGame);
    
    resetGame();
}

// Reset game
function resetGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    gameStarted = false;
    
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-matched').textContent = '0/6';
    document.getElementById('memory-points').textContent = '0';
    
    createBoard();
}

// Tạo board
function createBoard() {
    const board = document.getElementById('memory-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = 'repeat(4, 1fr)';
    
    // Chọn 6 symbols ngẫu nhiên
    const selectedSymbols = CARD_SYMBOLS.sort(() => Math.random() - 0.5).slice(0, 6);
    
    // Tạo 12 cards (6 cặp)
    const cardSymbols = [...selectedSymbols, ...selectedSymbols].sort(() => Math.random() - 0.5);
    
    cardSymbols.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = '<div class="card-back">?</div><div class="card-front">' + symbol + '</div>';
        card.addEventListener('click', () => flipCard(index));
        board.appendChild(card);
        cards.push(card);
    });
}

// Bắt đầu game
function startGame() {
    gameStarted = true;
    document.getElementById('start-memory-btn').disabled = true;
    resetGame();
}

// Lật card
function flipCard(index) {
    if (!gameStarted) return;
    
    const card = cards[index];
    if (!card || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Nếu đã lật 2 cards, không cho lật thêm
    if (flippedCards.length >= 2) return;
    
    // Lật card
    card.classList.add('flipped');
    flippedCards.push({ card, index, symbol: card.dataset.symbol });
    
    // Nếu đã lật 2 cards, kiểm tra match
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('memory-moves').textContent = moves;
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Kiểm tra match
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.symbol === card2.symbol) {
        // Match!
        card1.card.classList.add('matched');
        card2.card.classList.add('matched');
        matchedPairs++;
        
        document.getElementById('memory-matched').textContent = `${matchedPairs}/6`;
        
        // Tính điểm
        const points = 50 - moves * 2;
        const currentPoints = parseInt(document.getElementById('memory-points').textContent) || 0;
        document.getElementById('memory-points').textContent = currentPoints + Math.max(points, 10);
        
        // Sound effect (nếu có)
        playSound('success');
        
        // Kiểm tra hoàn thành
        if (matchedPairs === 6) {
            finishGame();
        }
    } else {
        // Không match, lật lại
        card1.card.classList.remove('flipped');
        card2.card.classList.remove('flipped');
    }
    
    flippedCards = [];
}

// Hoàn thành game
function finishGame() {
    gameStarted = false;
    const points = parseInt(document.getElementById('memory-points').textContent) || 0;
    
    // Thêm points
    addPoints(points, 'memory_game');
    
    // Hiển thị thông báo
    showEncouragementMessage(`Tuyệt vời! Bạn đã hoàn thành Memory Game! +${points} điểm`);
    
    document.getElementById('start-memory-btn').disabled = false;
}

// Play sound
function playSound(type) {
    // Có thể thêm sound effects sau
}

// CSS cho memory game (thêm vào game-ui.css hoặc inline)
const memoryGameStyles = `
.memory-board {
    display: grid;
    gap: 15px;
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.memory-card {
    aspect-ratio: 1;
    position: relative;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: transform 0.6s;
}

.memory-card.flipped {
    transform: rotateY(180deg);
}

.memory-card.matched {
    opacity: 0.5;
    cursor: default;
}

.card-back,
.card-front {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-size: 48px;
}

.card-back {
    background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
    border: 3px solid var(--gold-color);
    color: var(--gold-color);
}

.card-front {
    background: linear-gradient(135deg, var(--gold-color), #ffed4e);
    border: 3px solid var(--gold-color);
    transform: rotateY(180deg);
}
`;

// Inject styles
if (!document.getElementById('memory-game-styles')) {
    const style = document.createElement('style');
    style.id = 'memory-game-styles';
    style.textContent = memoryGameStyles;
    document.head.appendChild(style);
}

// Export
export { initMemoryGame };

