// ============================================
// MEDITATION GAME - Quán Tưởng 32 Thể Trược
// Game thiền định với 32 ảnh thể trược
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

// Danh sách 32 thể trược (tên file ảnh - theo thứ tự trong folder)
const THE_32_PARTS = [
    'bo-nao', 'co-thanh-ruot', 'da', 'dam', 'dau-da', 'gan-liver', 'gan', 'la-lach', 'long',
    'mang-ruot', 'mat', 'mau', 'mo-hoi', 'mo', 'mong', 'mu', 'nuoc-khop-xuong', 'nuoc-mat',
    'nuoc-mieng', 'nuoc-mui', 'nuoc-tieu', 'phan', 'phoi', 'rang', 'ruot', 'than', 'thit',
    'tim', 'toc', 'vat-trong-bao-tu', 'xuong-tuy', 'xuong'
];

let currentPartIndex = 0;
let gameStarted = false;
let meditationTime = 0;
let meditationTimer = null;

// Khởi tạo game
export function initMeditationGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🧘 Thiền 32 Thể Trược</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Phần hiện tại</div>
                    <div class="game-stat-value" id="current-part-number">1/32</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Thời gian</div>
                    <div class="game-stat-value" id="meditation-time">0:00</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="meditation-points">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="meditation-image-container" class="meditation-image-container">
                    <img id="meditation-image" src="" alt="Thể trược" class="meditation-image">
                    <div id="meditation-guidance" class="meditation-guidance">
                        <p>Nhấn "Bắt Đầu" để bắt đầu quán tưởng</p>
                    </div>
                </div>
                <div class="meditation-progress">
                    <div id="meditation-progress-bar" class="progress-bar"></div>
                </div>
            </div>
            <div class="game-controls">
                <button id="start-meditation-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="next-part-btn" class="game-btn-action" disabled>Phần Tiếp</button>
                <button id="finish-meditation-btn" class="game-btn-action" disabled>Hoàn Thành</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-meditation-btn').addEventListener('click', startMeditation);
    document.getElementById('next-part-btn').addEventListener('click', nextPart);
    document.getElementById('finish-meditation-btn').addEventListener('click', finishMeditation);
    
    // Reset game state
    currentPartIndex = 0;
    gameStarted = false;
    meditationTime = 0;
}

// Bắt đầu thiền
function startMeditation() {
    gameStarted = true;
    currentPartIndex = 0;
    meditationTime = 0;
    
    // Disable start button
    document.getElementById('start-meditation-btn').disabled = true;
    document.getElementById('next-part-btn').disabled = false;
    
    // Load ảnh đầu tiên
    loadPart(currentPartIndex);
    
    // Bắt đầu timer
    startTimer();
    
    // Voice guidance
    speakGuidance(currentPartIndex);
}

// Load phần thể trược
function loadPart(index) {
    if (index >= THE_32_PARTS.length) {
        finishMeditation();
        return;
    }
    
    const imageElement = document.getElementById('meditation-image');
    const partName = THE_32_PARTS[index];
    imageElement.src = `32thetruocimage/${partName}.png`;
    imageElement.alt = `Thể trược ${index + 1}`;
    
    // Cập nhật UI
    document.getElementById('current-part-number').textContent = `${index + 1}/32`;
    
    // Cập nhật progress bar
    const progress = ((index + 1) / 32) * 100;
    document.getElementById('meditation-progress-bar').style.width = progress + '%';
    
    // Cập nhật guidance
    updateGuidance(index);
}

// Cập nhật hướng dẫn
function updateGuidance(index) {
    const guidanceElement = document.getElementById('meditation-guidance');
    const partNames = [
        'Bộ não', 'Cổ thành ruột', 'Da', 'Đàm', 'Đầu da', 'Gan (liver)', 'Gan', 'Lá lách', 'Lông',
        'Màng ruột', 'Mắt', 'Máu', 'Mồ hôi', 'Mỡ', 'Móng', 'Mủ', 'Nước khớp xương', 'Nước mắt',
        'Nước miệng', 'Nước mũi', 'Nước tiểu', 'Phân', 'Phổi', 'Răng', 'Ruột', 'Thận', 'Thịt',
        'Tim', 'Tóc', 'Vật trong bao tử', 'Xương tủy', 'Xương'
    ];
    
    const partName = partNames[index] || `Phần ${index + 1}`;
    const text = `Quán sát ${partName.toLowerCase()}, nhận thức sự bất tịnh của cơ thể. Hãy tập trung và quan sát một cách tỉnh giác.`;
    guidanceElement.innerHTML = `<p>${text}</p>`;
}

// Phần tiếp theo
function nextPart() {
    currentPartIndex++;
    if (currentPartIndex < THE_32_PARTS.length) {
        loadPart(currentPartIndex);
        speakGuidance(currentPartIndex);
    } else {
        finishMeditation();
    }
}

// Hoàn thành thiền
function finishMeditation() {
    gameStarted = false;
    
    // Dừng timer
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    
    // Tính điểm
    const minutes = Math.floor(meditationTime / 60);
    const points = minutes * 10 + 50; // 10 điểm/phút + 50 điểm hoàn thành
    
    // Thêm points
    addPoints(points, 'meditation');
    
    // Hiển thị thông báo
    showEncouragementMessage(`Tuyệt vời! Bạn đã hoàn thành quán tưởng 32 thể trược! +${points} điểm`);
    
    // Disable buttons
    document.getElementById('next-part-btn').disabled = true;
    document.getElementById('finish-meditation-btn').disabled = true;
    document.getElementById('start-meditation-btn').disabled = false;
    document.getElementById('start-meditation-btn').textContent = 'Bắt Đầu Lại';
    
    // Reset
    currentPartIndex = 0;
    meditationTime = 0;
    document.getElementById('meditation-progress-bar').style.width = '0%';
}

// Bắt đầu timer
function startTimer() {
    meditationTimer = setInterval(() => {
        meditationTime++;
        const minutes = Math.floor(meditationTime / 60);
        const seconds = meditationTime % 60;
        document.getElementById('meditation-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Voice guidance (text-to-speech)
function speakGuidance(index) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = `Quán sát phần ${index + 1}, nhận thức sự bất tịnh của cơ thể. Hãy tập trung và quan sát.`;
        utterance.lang = 'vi-VN';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

