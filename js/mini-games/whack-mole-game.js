// ============================================
// WHACK-A-MOLE GAME - Đánh Bay Dục Vọng
// Game đánh bay dục vọng xuất hiện ngẫu nhiên
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let gameStarted = false;
let score = 0;
let timeLeft = 60;
let gameTimer = null;
let spawnTimer = null;
let moles = [];
let level = 1;

// Khởi tạo game
export function initWhackMoleGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">⚡ Đánh Bay Dục Vọng</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="whack-score">0</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Thời gian</div>
                    <div class="game-stat-value" id="whack-time">60</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Cấp độ</div>
                    <div class="game-stat-value" id="whack-level">1</div>
                </div>
            </div>
            <div class="game-area">
                <div id="whack-board" class="whack-board"></div>
            </div>
            <div class="game-controls">
                <button id="start-whack-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="stop-whack-btn" class="game-btn-action" disabled>Dừng</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-whack-btn').addEventListener('click', startGame);
    document.getElementById('stop-whack-btn').addEventListener('click', stopGame);
    
    createBoard();
}

// Tạo board
function createBoard() {
    const board = document.getElementById('whack-board');
    board.innerHTML = '';
    board.style.gridTemplateColumns = 'repeat(3, 1fr)';
    
    for (let i = 0; i < 9; i++) {
        const hole = document.createElement('div');
        hole.className = 'whack-hole';
        hole.dataset.index = i;
        board.appendChild(hole);
    }
}

// Bắt đầu game
function startGame() {
    gameStarted = true;
    score = 0;
    timeLeft = 60;
    level = 1;
    moles = [];
    
    document.getElementById('start-whack-btn').disabled = true;
    document.getElementById('stop-whack-btn').disabled = false;
    
    updateUI();
    
    // Start timers
    startGameTimer();
    startSpawnTimer();
}

// Game timer
function startGameTimer() {
    gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('whack-time').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            finishGame();
        }
    }, 1000);
}

// Spawn timer
function startSpawnTimer() {
    const spawnInterval = () => {
        if (!gameStarted) return;
        
        spawnMole();
        
        // Tăng tốc độ theo level
        const delay = Math.max(500, 2000 - level * 100);
        spawnTimer = setTimeout(spawnInterval, delay);
    };
    
    spawnInterval();
}

// Spawn mole (dục vọng)
function spawnMole() {
    if (!gameStarted) return;
    
    const holes = document.querySelectorAll('.whack-hole');
    const availableHoles = Array.from(holes).filter(hole => !hole.querySelector('.whack-mole'));
    
    if (availableHoles.length === 0) return;
    
    const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
    const mole = document.createElement('div');
    mole.className = 'whack-mole';
    mole.textContent = '💭'; // Dục vọng emoji
    mole.addEventListener('click', () => whackMole(mole, randomHole));
    
    randomHole.appendChild(mole);
    moles.push({ mole, hole: randomHole, spawnTime: Date.now() });
    
    // Tự động biến mất sau 2-4 giây
    const disappearTime = 2000 + Math.random() * 2000;
    setTimeout(() => {
        if (mole.parentNode) {
            removeMole(mole, randomHole);
        }
    }, disappearTime);
}

// Đánh mole
function whackMole(mole, hole) {
    if (!gameStarted) return;
    
    // Thêm điểm
    score += 10 * level;
    updateUI();
    
    // Hiệu ứng
    mole.style.transform = 'scale(0)';
    mole.style.opacity = '0';
    
    // Lời khuyến khích
    const encouragements = [
        'Tuyệt vời! Dục vọng tan biến!',
        'Bạn đang mạnh mẽ hơn!',
        'Tiếp tục chiến đấu!',
        'Bạn đang kiểm soát!'
    ];
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    showEncouragementMessage(randomEncouragement);
    
    // Remove mole
    setTimeout(() => {
        removeMole(mole, hole);
    }, 200);
}

// Remove mole
function removeMole(mole, hole) {
    if (mole.parentNode) {
        mole.remove();
    }
    moles = moles.filter(m => m.mole !== mole);
}

// Update UI
function updateUI() {
    document.getElementById('whack-score').textContent = score;
    document.getElementById('whack-level').textContent = level;
    
    // Level up mỗi 100 điểm
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
        level = newLevel;
        showEncouragementMessage(`Level ${level}! Tốc độ tăng lên!`);
    }
}

// Dừng game
function stopGame() {
    finishGame();
}

// Hoàn thành game
function finishGame() {
    gameStarted = false;
    
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
    
    if (spawnTimer) {
        clearTimeout(spawnTimer);
        spawnTimer = null;
    }
    
    // Remove all moles
    moles.forEach(({ mole, hole }) => {
        if (mole.parentNode) {
            mole.remove();
        }
    });
    moles = [];
    
    // Thêm points
    if (score > 0) {
        addPoints(score, 'whack_mole');
        showEncouragementMessage(`Tuyệt vời! Bạn đã đánh bay ${score / 10} dục vọng và nhận được ${score} điểm!`);
    }
    
    document.getElementById('start-whack-btn').disabled = false;
    document.getElementById('stop-whack-btn').disabled = true;
}

// CSS cho whack mole game
const whackMoleGameStyles = `
.whack-board {
    display: grid;
    gap: 20px;
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
}

.whack-hole {
    aspect-ratio: 1;
    background: rgba(139, 69, 19, 0.8);
    border-radius: 50%;
    position: relative;
    overflow: hidden;
    border: 3px solid var(--voxel-brown);
    cursor: pointer;
}

.whack-mole {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 64px;
    cursor: pointer;
    transition: all 0.2s ease;
    animation: mole-appear 0.3s ease;
    user-select: none;
}

.whack-mole:hover {
    transform: translate(-50%, -50%) scale(1.2);
}

@keyframes mole-appear {
    from {
        transform: translate(-50%, 100%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}
`;

// Inject styles
if (!document.getElementById('whack-mole-game-styles')) {
    const style = document.createElement('style');
    style.id = 'whack-mole-game-styles';
    style.textContent = whackMoleGameStyles;
    document.head.appendChild(style);
}

// Export
export { initWhackMoleGame };

