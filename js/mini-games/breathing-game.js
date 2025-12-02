// ============================================
// BREATHING GAME - Thở Sâu 4-7-8
// Game hướng dẫn thở sâu với visual guide
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let breathingPhase = 'idle'; // idle, inhale, hold, exhale
let breathCount = 0;
let gameStarted = false;
let breathingTimer = null;
let currentPhaseTime = 0;

const BREATHING_PHASES = {
    inhale: { duration: 4000, text: 'Hít vào...', color: '#4caf50' },
    hold: { duration: 7000, text: 'Giữ hơi...', color: '#2196f3' },
    exhale: { duration: 8000, text: 'Thở ra...', color: '#ff9800' }
};

// Khởi tạo game
export function initBreathingGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">💨 Thở Sâu - Kỹ Thuật 4-7-8</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Số lần thở</div>
                    <div class="game-stat-value" id="breath-count">0</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="breathing-points">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="breathing-circle" class="breathing-circle">
                    <div class="breathing-text" id="breathing-text">Nhấn "Bắt Đầu" để bắt đầu</div>
                </div>
                <div class="breathing-instructions">
                    <p>Kỹ thuật 4-7-8:</p>
                    <ul>
                        <li>Hít vào trong 4 giây</li>
                        <li>Giữ hơi trong 7 giây</li>
                        <li>Thở ra trong 8 giây</li>
                    </ul>
                </div>
            </div>
            <div class="game-controls">
                <button id="start-breathing-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="stop-breathing-btn" class="game-btn-action" disabled>Dừng</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-breathing-btn').addEventListener('click', startBreathing);
    document.getElementById('stop-breathing-btn').addEventListener('click', stopBreathing);
    
    resetGame();
}

// Reset game
function resetGame() {
    breathingPhase = 'idle';
    breathCount = 0;
    gameStarted = false;
    currentPhaseTime = 0;
    
    if (breathingTimer) {
        clearInterval(breathingTimer);
        breathingTimer = null;
    }
    
    const circle = document.getElementById('breathing-circle');
    if (circle) {
        circle.style.transform = 'scale(0.5)';
        circle.style.backgroundColor = '#1a1a2e';
    }
    
    document.getElementById('breath-count').textContent = '0';
    document.getElementById('breathing-points').textContent = '0';
}

// Bắt đầu thở
function startBreathing() {
    gameStarted = true;
    breathingPhase = 'inhale';
    breathCount = 0;
    
    document.getElementById('start-breathing-btn').disabled = true;
    document.getElementById('stop-breathing-btn').disabled = false;
    
    startBreathingCycle();
}

// Bắt đầu chu kỳ thở
function startBreathingCycle() {
    if (!gameStarted) return;
    
    const phase = BREATHING_PHASES[breathingPhase];
    if (!phase) {
        breathingPhase = 'inhale';
        startBreathingCycle();
        return;
    }
    
    currentPhaseTime = 0;
    updateBreathingUI(breathingPhase);
    
    // Animation
    animateBreathing(breathingPhase);
    
    // Timer
    const interval = 100; // Update mỗi 100ms
    breathingTimer = setInterval(() => {
        currentPhaseTime += interval;
        
        if (currentPhaseTime >= phase.duration) {
            clearInterval(breathingTimer);
            nextBreathingPhase();
        }
    }, interval);
}

// Chuyển phase tiếp theo
function nextBreathingPhase() {
    if (!gameStarted) return;
    
    switch (breathingPhase) {
        case 'inhale':
            breathingPhase = 'hold';
            break;
        case 'hold':
            breathingPhase = 'exhale';
            break;
        case 'exhale':
            breathingPhase = 'inhale';
            breathCount++;
            document.getElementById('breath-count').textContent = breathCount;
            
            // Thêm điểm mỗi lần thở
            const points = 10;
            const currentPoints = parseInt(document.getElementById('breathing-points').textContent) || 0;
            document.getElementById('breathing-points').textContent = currentPoints + points;
            
            // Hiển thị encouragement
            if (breathCount % 5 === 0) {
                showEncouragementMessage(`Tuyệt vời! Bạn đã thở ${breathCount} lần!`);
            }
            break;
    }
    
    startBreathingCycle();
}

// Cập nhật UI
function updateBreathingUI(phase) {
    const phaseData = BREATHING_PHASES[phase];
    const textElement = document.getElementById('breathing-text');
    const circle = document.getElementById('breathing-circle');
    
    if (textElement) {
        textElement.textContent = phaseData.text;
    }
    
    if (circle) {
        circle.style.backgroundColor = phaseData.color;
    }
}

// Animate breathing
function animateBreathing(phase) {
    const circle = document.getElementById('breathing-circle');
    if (!circle) return;
    
    const phaseData = BREATHING_PHASES[phase];
    
    if (phase === 'inhale') {
        // Phồng lên
        circle.style.transition = `transform ${phaseData.duration}ms ease-in`;
        circle.style.transform = 'scale(1.5)';
    } else if (phase === 'hold') {
        // Giữ nguyên
        circle.style.transition = 'none';
    } else if (phase === 'exhale') {
        // Xẹp xuống
        circle.style.transition = `transform ${phaseData.duration}ms ease-out`;
        circle.style.transform = 'scale(0.5)';
    }
}

// Dừng thở
function stopBreathing() {
    gameStarted = false;
    
    if (breathingTimer) {
        clearInterval(breathingTimer);
        breathingTimer = null;
    }
    
    const totalPoints = parseInt(document.getElementById('breathing-points').textContent) || 0;
    
    // Thêm points
    if (totalPoints > 0) {
        addPoints(totalPoints, 'breathing');
        showEncouragementMessage(`Tuyệt vời! Bạn đã thở ${breathCount} lần và nhận được ${totalPoints} điểm!`);
    }
    
    document.getElementById('start-breathing-btn').disabled = false;
    document.getElementById('stop-breathing-btn').disabled = true;
    
    resetGame();
}

// CSS cho breathing game
const breathingGameStyles = `
.breathing-circle {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40px auto;
    box-shadow: 0 0 50px rgba(66, 165, 245, 0.5);
    transition: transform 4s ease-in-out;
}

.breathing-text {
    color: var(--text-light);
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.breathing-instructions {
    margin-top: 30px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
}

.breathing-instructions ul {
    list-style: none;
    padding: 0;
    margin: 10px 0 0 0;
}

.breathing-instructions li {
    padding: 5px 0;
    color: var(--text-light);
}
`;

// Inject styles
if (!document.getElementById('breathing-game-styles')) {
    const style = document.createElement('style');
    style.id = 'breathing-game-styles';
    style.textContent = breathingGameStyles;
    document.head.appendChild(style);
}

// Export đã có ở đầu file với export function

