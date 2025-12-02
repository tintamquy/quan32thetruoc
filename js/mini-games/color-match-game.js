// ============================================
// COLOR MATCH GAME - Ghép Màu Thanh Tịnh
// Game ghép màu để tạo hình ảnh thanh tịnh
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let level = 1;
let score = 0;
let timeLeft = 60;
let gameTimer = null;
let gameStarted = false;

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];

// Khởi tạo game
export function initColorMatchGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🎨 Ghép Màu Thanh Tịnh</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Cấp độ</div>
                    <div class="game-stat-value" id="color-level">1</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Thời gian</div>
                    <div class="game-stat-value" id="color-time">60</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="color-score">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="color-target" class="color-target"></div>
                <div id="color-palette" class="color-palette"></div>
            </div>
            <div class="game-controls">
                <button id="start-color-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="stop-color-btn" class="game-btn-action" disabled>Dừng</button>
            </div>
        </div>
    `;
    
    document.getElementById('start-color-btn').addEventListener('click', startGame);
    document.getElementById('stop-color-btn').addEventListener('click', stopGame);
    
    createPalette();
}

// Tạo palette
function createPalette() {
    const palette = document.getElementById('color-palette');
    palette.innerHTML = '';
    
    COLORS.forEach((color, index) => {
        const colorBtn = document.createElement('div');
        colorBtn.className = 'color-btn';
        colorBtn.style.backgroundColor = color;
        colorBtn.dataset.color = color;
        colorBtn.addEventListener('click', () => selectColor(color));
        palette.appendChild(colorBtn);
    });
}

// Bắt đầu game
function startGame() {
    gameStarted = true;
    level = 1;
    score = 0;
    timeLeft = 60;
    
    document.getElementById('start-color-btn').disabled = true;
    document.getElementById('stop-color-btn').disabled = false;
    
    generateTarget();
    startTimer();
}

// Tạo target
function generateTarget() {
    const target = document.getElementById('color-target');
    const targetColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    target.style.backgroundColor = targetColor;
    target.dataset.targetColor = targetColor;
    
    // Shuffle palette
    const palette = document.getElementById('color-palette');
    const buttons = Array.from(palette.children);
    buttons.sort(() => Math.random() - 0.5);
    buttons.forEach(btn => palette.appendChild(btn));
}

// Chọn màu
function selectColor(color) {
    if (!gameStarted) return;
    
    const targetColor = document.getElementById('color-target').dataset.targetColor;
    
    if (color === targetColor) {
        // Correct!
        score += 10 * level;
        level++;
        
        document.getElementById('color-score').textContent = score;
        document.getElementById('color-level').textContent = level;
        
        showEncouragementMessage(`Tuyệt vời! Level ${level}!`);
        
        generateTarget();
    } else {
        // Wrong - lose points
        score = Math.max(0, score - 5);
        document.getElementById('color-score').textContent = score;
    }
}

// Timer
function startTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('color-time').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            stopGame();
        }
    }, 1000);
}

// Dừng game
function stopGame() {
    gameStarted = false;
    
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    if (score > 0) {
        addPoints(score, 'color_match');
        showEncouragementMessage(`Tuyệt vời! Bạn đạt ${score} điểm!`);
    }
    
    document.getElementById('start-color-btn').disabled = false;
    document.getElementById('stop-color-btn').disabled = true;
}

// CSS
const colorMatchGameStyles = `
.color-target {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    border-radius: 50%;
    border: 5px solid var(--gold-color);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
    transition: background-color 0.3s ease;
}

.color-palette {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    margin: 30px 0;
}

.color-btn {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid transparent;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.color-btn:hover {
    transform: scale(1.1);
    border-color: var(--gold-color);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.5);
}
`;

if (!document.getElementById('color-match-game-styles')) {
    const style = document.createElement('style');
    style.id = 'color-match-game-styles';
    style.textContent = colorMatchGameStyles;
    document.head.appendChild(style);
}

// Export đã có ở đầu file với export function

