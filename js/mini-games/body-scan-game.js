// ============================================
// BODY SCAN GAME - Quét Cơ Thể
// Game quét cơ thể từng phần với guided meditation
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let currentBodyPart = 0;
let gameStarted = false;
let scanTime = 0;
let scanTimer = null;

const BODY_PARTS = [
    { name: 'Đầu', time: 5, position: 'top' },
    { name: 'Cổ', time: 3, position: 'neck' },
    { name: 'Vai trái', time: 3, position: 'left-shoulder' },
    { name: 'Vai phải', time: 3, position: 'right-shoulder' },
    { name: 'Cánh tay trái', time: 4, position: 'left-arm' },
    { name: 'Cánh tay phải', time: 4, position: 'right-arm' },
    { name: 'Ngực', time: 5, position: 'chest' },
    { name: 'Bụng', time: 5, position: 'abdomen' },
    { name: 'Lưng', time: 5, position: 'back' },
    { name: 'Hông', time: 3, position: 'hips' },
    { name: 'Đùi trái', time: 4, position: 'left-thigh' },
    { name: 'Đùi phải', time: 4, position: 'right-thigh' },
    { name: 'Chân trái', time: 4, position: 'left-leg' },
    { name: 'Chân phải', time: 4, position: 'right-leg' },
    { name: 'Bàn chân trái', time: 3, position: 'left-foot' },
    { name: 'Bàn chân phải', time: 3, position: 'right-foot' }
];

// Khởi tạo game
export function initBodyScanGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">👁️ Quét Cơ Thể - Body Scan</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Phần hiện tại</div>
                    <div class="game-stat-value" id="body-part-number">0/16</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Thời gian</div>
                    <div class="game-stat-value" id="scan-time">0:00</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="scan-points">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="body-model" class="body-model">
                    <div class="body-part" id="body-part-highlight"></div>
                </div>
                <div id="body-scan-guidance" class="body-scan-guidance">
                    <p>Nhấn "Bắt Đầu" để bắt đầu quét cơ thể</p>
                </div>
                <div class="body-scan-progress">
                    <div id="body-scan-progress-bar" class="progress-bar"></div>
                </div>
            </div>
            <div class="game-controls">
                <button id="start-scan-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="next-part-btn" class="game-btn-action" disabled>Phần Tiếp</button>
                <button id="finish-scan-btn" class="game-btn-action" disabled>Hoàn Thành</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-scan-btn').addEventListener('click', startScan);
    document.getElementById('next-part-btn').addEventListener('click', nextPart);
    document.getElementById('finish-scan-btn').addEventListener('click', finishScan);
    
    resetGame();
}

// Reset game
function resetGame() {
    currentBodyPart = 0;
    gameStarted = false;
    scanTime = 0;
    
    if (scanTimer) {
        clearInterval(scanTimer);
        scanTimer = null;
    }
    
    document.getElementById('body-part-number').textContent = '0/16';
    document.getElementById('scan-time').textContent = '0:00';
    document.getElementById('scan-points').textContent = '0';
    document.getElementById('body-scan-progress-bar').style.width = '0%';
}

// Bắt đầu scan
function startScan() {
    gameStarted = true;
    currentBodyPart = 0;
    scanTime = 0;
    
    document.getElementById('start-scan-btn').disabled = true;
    document.getElementById('next-part-btn').disabled = false;
    
    loadBodyPart(currentBodyPart);
    startTimer();
    speakGuidance(currentBodyPart);
}

// Load body part
function loadBodyPart(index) {
    if (index >= BODY_PARTS.length) {
        finishScan();
        return;
    }
    
    const part = BODY_PARTS[index];
    const partElement = document.getElementById('body-part-highlight');
    const guidanceElement = document.getElementById('body-scan-guidance');
    
    // Cập nhật UI
    document.getElementById('body-part-number').textContent = `${index + 1}/16`;
    
    // Cập nhật progress
    const progress = ((index + 1) / BODY_PARTS.length) * 100;
    document.getElementById('body-scan-progress-bar').style.width = progress + '%';
    
    // Cập nhật guidance
    guidanceElement.innerHTML = `
        <h3>${part.name}</h3>
        <p>Hãy tập trung vào ${part.name.toLowerCase()}. Cảm nhận cảm giác ở vùng này. Thư giãn và buông bỏ mọi căng thẳng.</p>
    `;
    
    // Highlight body part (visual effect)
    if (partElement) {
        partElement.className = `body-part highlight-${part.position}`;
    }
}

// Phần tiếp theo
function nextPart() {
    currentBodyPart++;
    if (currentBodyPart < BODY_PARTS.length) {
        loadBodyPart(currentBodyPart);
        speakGuidance(currentBodyPart);
    } else {
        finishScan();
    }
}

// Hoàn thành scan
function finishScan() {
    gameStarted = false;
    
    if (scanTimer) {
        clearInterval(scanTimer);
        scanTimer = null;
    }
    
    const minutes = Math.floor(scanTime / 60);
    const points = minutes * 10 + 50;
    
    addPoints(points, 'body_scan');
    showEncouragementMessage(`Tuyệt vời! Bạn đã hoàn thành body scan! +${points} điểm`);
    
    document.getElementById('next-part-btn').disabled = true;
    document.getElementById('finish-scan-btn').disabled = true;
    document.getElementById('start-scan-btn').disabled = false;
    document.getElementById('start-scan-btn').textContent = 'Bắt Đầu Lại';
    
    resetGame();
}

// Bắt đầu timer
function startTimer() {
    scanTimer = setInterval(() => {
        scanTime++;
        const minutes = Math.floor(scanTime / 60);
        const seconds = scanTime % 60;
        document.getElementById('scan-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Voice guidance
function speakGuidance(index) {
    if ('speechSynthesis' in window) {
        const part = BODY_PARTS[index];
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Hãy tập trung vào ${part.name.toLowerCase()}. Cảm nhận và thư giãn.`;
        utterance.lang = 'vi-VN';
        utterance.rate = 0.7;
        speechSynthesis.speak(utterance);
    }
}

// CSS cho body scan game
const bodyScanGameStyles = `
.body-model {
    width: 300px;
    height: 500px;
    margin: 20px auto;
    position: relative;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border-radius: 20px;
    border: 2px solid var(--gold-color);
}

.body-part {
    position: absolute;
    background: rgba(255, 215, 0, 0.3);
    border: 2px solid var(--gold-color);
    border-radius: 10px;
    transition: all 0.5s ease;
    animation: body-part-pulse 2s ease-in-out infinite;
}

@keyframes body-part-pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
}

.body-scan-guidance {
    margin: 20px 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
    text-align: center;
}

.body-scan-guidance h3 {
    color: var(--gold-color);
    font-size: 24px;
    margin-bottom: 10px;
}

.body-scan-guidance p {
    color: var(--text-light);
    line-height: 1.6;
}

.body-scan-progress {
    width: 100%;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin: 20px 0;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, var(--gold-color), #ffed4e);
    width: 0%;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
`;

// Inject styles
if (!document.getElementById('body-scan-game-styles')) {
    const style = document.createElement('style');
    style.id = 'body-scan-game-styles';
    style.textContent = bodyScanGameStyles;
    document.head.appendChild(style);
}

// Export
export { initBodyScanGame };

