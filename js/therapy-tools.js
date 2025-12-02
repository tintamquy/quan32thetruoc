// ============================================
// THERAPY TOOLS - Công Cụ Trị Liệu Thực Tế
// Các công cụ khoa học để giúp cai nghiện hiệu quả
// ============================================

import { addPoints, showEncouragementMessage } from './gamification.js';
import { getCurrentUser } from './auth.js';
import { getGuestData } from './local-storage-manager.js';

// Urge Surfing - Kỹ thuật chấp nhận và quan sát dục vọng
export function initUrgeSurfing() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🌊 Urge Surfing - Lướt Sóng Dục Vọng</h2>
            <div class="therapy-explanation">
                <p><strong>Urge Surfing</strong> là kỹ thuật chấp nhận và quan sát dục vọng mà không phản ứng. 
                Giống như lướt sóng, bạn quan sát cơn sóng dục vọng đến và đi mà không bị cuốn theo.</p>
            </div>
            <div class="game-area">
                <div id="urge-wave" class="urge-wave">
                    <div class="wave-visualization"></div>
                    <div class="urge-instructions">
                        <h3>Hướng Dẫn:</h3>
                        <ol>
                            <li>Nhận biết dục vọng đang đến (không phán xét)</li>
                            <li>Quan sát cảm giác trong cơ thể</li>
                            <li>Thở sâu và chấp nhận</li>
                            <li>Quan sát dục vọng tự tan biến</li>
                        </ol>
                    </div>
                    <div class="urge-timer">
                        <div class="timer-display" id="urge-timer">0:00</div>
                        <p>Thời gian bạn đã vượt qua dục vọng</p>
                    </div>
                </div>
            </div>
            <div class="game-controls">
                <button id="start-urge-btn" class="game-btn-action">Bắt Đầu Lướt Sóng</button>
                <button id="stop-urge-btn" class="game-btn-action" disabled>Hoàn Thành</button>
            </div>
        </div>
    `;
    
    let urgeTimer = null;
    let startTime = null;
    
    document.getElementById('start-urge-btn').addEventListener('click', () => {
        startTime = Date.now();
        document.getElementById('start-urge-btn').disabled = true;
        document.getElementById('stop-urge-btn').disabled = false;
        
        // Animate wave
        animateUrgeWave();
        
        // Start timer
        urgeTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('urge-timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    });
    
    document.getElementById('stop-urge-btn').addEventListener('click', () => {
        if (urgeTimer) {
            clearInterval(urgeTimer);
            urgeTimer = null;
        }
        
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const points = Math.floor(elapsed / 10) * 5; // 5 điểm mỗi 10 giây
        
        addPoints(points, 'urge_surfing');
        
        const message = `Tuyệt vời! Bạn đã lướt sóng dục vọng trong ${Math.floor(elapsed / 60)} phút ${elapsed % 60} giây! +${points} điểm`;
        showEncouragementMessage(message);
        
        document.getElementById('start-urge-btn').disabled = false;
        document.getElementById('stop-urge-btn').disabled = true;
    });
}

// Animate urge wave
function animateUrgeWave() {
    const wave = document.querySelector('.wave-visualization');
    if (!wave) return;
    
    let intensity = 0;
    const animate = () => {
        intensity += 0.02;
        const waveHeight = Math.sin(intensity) * 30 + 50;
        wave.style.height = waveHeight + '%';
        wave.style.opacity = 0.3 + Math.sin(intensity) * 0.2;
        
        if (document.getElementById('stop-urge-btn') && !document.getElementById('stop-urge-btn').disabled) {
            requestAnimationFrame(animate);
        }
    };
    animate();
}

// Cold Shower Reminder - Nhắc nhở tắm nước lạnh
export function initColdShowerReminder() {
    // Tạo notification khi có urge
    const reminder = document.createElement('div');
    reminder.className = 'cold-shower-reminder';
    reminder.innerHTML = `
        <div class="reminder-content">
            <h3>💧 Gợi Ý: Tắm Nước Lạnh</h3>
            <p>Tắm nước lạnh giúp giảm dục vọng ngay lập tức bằng cách:</p>
            <ul>
                <li>Kích hoạt hệ thần kinh phó giao cảm</li>
                <li>Giảm nhiệt độ cơ thể</li>
                <li>Tăng dopamine tự nhiên</li>
                <li>Rèn luyện ý chí</li>
            </ul>
            <button class="btn-reminder-close">Đã Hiểu</button>
        </div>
    `;
    
    document.body.appendChild(reminder);
    
    reminder.querySelector('.btn-reminder-close').addEventListener('click', () => {
        reminder.remove();
    });
}

// 5-4-3-2-1 Grounding Technique
export function initGroundingTechnique() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">🌍 5-4-3-2-1 Grounding - Kỹ Thuật Cắm Rễ</h2>
            <div class="therapy-explanation">
                <p>Kỹ thuật này giúp bạn quay lại hiện tại khi dục vọng quá mạnh. 
                Liệt kê 5 điều bạn thấy, 4 điều bạn chạm, 3 điều bạn nghe, 2 điều bạn ngửi, 1 điều bạn nếm.</p>
            </div>
            <div class="game-area">
                <div id="grounding-steps" class="grounding-steps">
                    <div class="grounding-step active" data-step="5">
                        <h3>5 Điều Bạn Thấy</h3>
                        <textarea id="see-5" placeholder="Ví dụ: Tôi thấy màn hình, bàn phím, cửa sổ, cây cối, ánh sáng..." rows="3"></textarea>
                    </div>
                    <div class="grounding-step" data-step="4">
                        <h3>4 Điều Bạn Chạm</h3>
                        <textarea id="touch-4" placeholder="Ví dụ: Tôi chạm vào bàn phím, ghế, quần áo, da..." rows="3"></textarea>
                    </div>
                    <div class="grounding-step" data-step="3">
                        <h3>3 Điều Bạn Nghe</h3>
                        <textarea id="hear-3" placeholder="Ví dụ: Tôi nghe tiếng quạt, tiếng xe, tiếng chim..." rows="3"></textarea>
                    </div>
                    <div class="grounding-step" data-step="2">
                        <h3>2 Điều Bạn Ngửi</h3>
                        <textarea id="smell-2" placeholder="Ví dụ: Tôi ngửi thấy không khí, mùi hoa..." rows="3"></textarea>
                    </div>
                    <div class="grounding-step" data-step="1">
                        <h3>1 Điều Bạn Nếm</h3>
                        <textarea id="taste-1" placeholder="Ví dụ: Tôi nếm thấy vị nước, vị không khí..." rows="3"></textarea>
                    </div>
                </div>
            </div>
            <div class="game-controls">
                <button id="prev-grounding-btn" class="game-btn-action" disabled>Trước</button>
                <button id="next-grounding-btn" class="game-btn-action">Tiếp</button>
                <button id="finish-grounding-btn" class="game-btn-action" disabled>Hoàn Thành</button>
            </div>
        </div>
    `;
    
    let currentStep = 5;
    
    function updateStep() {
        document.querySelectorAll('.grounding-step').forEach((step, index) => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });
        
        document.getElementById('prev-grounding-btn').disabled = currentStep === 5;
        document.getElementById('next-grounding-btn').disabled = currentStep === 1;
        document.getElementById('finish-grounding-btn').disabled = currentStep !== 1;
    }
    
    document.getElementById('next-grounding-btn').addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStep();
        }
    });
    
    document.getElementById('prev-grounding-btn').addEventListener('click', () => {
        if (currentStep < 5) {
            currentStep++;
            updateStep();
        }
    });
    
    document.getElementById('finish-grounding-btn').addEventListener('click', () => {
        addPoints(50, 'grounding');
        showEncouragementMessage('Tuyệt vời! Bạn đã hoàn thành kỹ thuật Grounding! +50 điểm');
    });
    
    updateStep();
}

// CSS
const therapyToolsStyles = `
.therapy-explanation {
    background: rgba(255, 215, 0, 0.1);
    border: 2px solid var(--gold-color);
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    line-height: 1.8;
}

.urge-wave {
    text-align: center;
    padding: 30px;
}

.wave-visualization {
    width: 100%;
    max-width: 400px;
    height: 200px;
    margin: 20px auto;
    background: linear-gradient(180deg, #4ecdc4, #45b7d1);
    border-radius: 50% 50% 0 0;
    position: relative;
    overflow: hidden;
    animation: wave-animate 3s ease-in-out infinite;
}

@keyframes wave-animate {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.urge-instructions {
    margin: 30px 0;
    text-align: left;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
}

.urge-instructions ol {
    margin: 15px 0;
    padding-left: 20px;
}

.urge-instructions li {
    margin: 10px 0;
    line-height: 1.6;
}

.urge-timer {
    margin-top: 30px;
}

.timer-display {
    font-size: 48px;
    font-weight: bold;
    color: var(--gold-color);
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
    margin: 20px 0;
}

.cold-shower-reminder {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10006;
    background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
    padding: 30px;
    border-radius: 20px;
    border: 3px solid var(--gold-color);
    max-width: 500px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

.reminder-content ul {
    margin: 15px 0;
    padding-left: 20px;
}

.reminder-content li {
    margin: 8px 0;
}

.btn-reminder-close {
    margin-top: 20px;
    padding: 10px 20px;
    background: var(--gold-color);
    border: none;
    border-radius: 8px;
    color: var(--text-dark);
    font-weight: bold;
    cursor: pointer;
}

.grounding-steps {
    min-height: 400px;
}

.grounding-step {
    display: none;
    padding: 30px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
}

.grounding-step.active {
    display: block;
}

.grounding-step h3 {
    color: var(--gold-color);
    margin-bottom: 20px;
    font-size: 24px;
}

.grounding-step textarea {
    width: 100%;
    padding: 15px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-light);
    font-size: 16px;
    resize: vertical;
    font-family: inherit;
}

.grounding-step textarea:focus {
    outline: none;
    border-color: var(--gold-color);
    background: rgba(255, 255, 255, 0.15);
}
`;

if (!document.getElementById('therapy-tools-styles')) {
    const style = document.createElement('style');
    style.id = 'therapy-tools-styles';
    style.textContent = therapyToolsStyles;
    document.head.appendChild(style);
}

// Export
export { initUrgeSurfing, initColdShowerReminder, initGroundingTechnique };

