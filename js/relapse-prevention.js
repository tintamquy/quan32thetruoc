// ============================================
// RELAPSE PREVENTION - Phòng Ngừa Tái Nghiện
// Hệ thống cảnh báo và hỗ trợ khi có nguy cơ
// ============================================

import { getCurrentUser } from './auth.js';
import { getGuestData } from './local-storage-manager.js';

// Trigger Warning System - Cảnh báo khi có trigger
export function checkTriggers() {
    // Kiểm tra các trigger phổ biến
    const triggers = [
        'cảm thấy cô đơn',
        'căng thẳng',
        'buồn chán',
        'tức giận',
        'lo lắng',
        'mệt mỏi'
    ];
    
    // Có thể mở rộng với AI để detect triggers từ chat
    return triggers;
}

// Relapse Prevention Plan
export function showRelapsePreventionPlan() {
    const plan = document.createElement('div');
    plan.className = 'relapse-prevention-modal';
    plan.innerHTML = `
        <div class="prevention-content">
            <span class="close-prevention">&times;</span>
            <h2>🛡️ Kế Hoạch Phòng Ngừa Tái Nghiện</h2>
            <div class="prevention-steps">
                <div class="prevention-step">
                    <h3>1. Nhận Biết Triggers</h3>
                    <p>Xác định các tình huống, cảm xúc, hoặc suy nghĩ khiến bạn muốn thủ dâm</p>
                </div>
                <div class="prevention-step">
                    <h3>2. Có Kế Hoạch Hành Động</h3>
                    <p>Khi gặp trigger, làm gì ngay lập tức:
                    <ul>
                        <li>Gọi điện cho bạn bè</li>
                        <li>Đi dạo</li>
                        <li>Tắm nước lạnh</li>
                        <li>Chơi game trên app này</li>
                        <li>Thiền định</li>
                    </ul>
                    </p>
                </div>
                <div class="prevention-step">
                    <h3>3. Xây Dựng Thói Quen Tốt</h3>
                    <p>Thay thế thủ dâm bằng:
                    <ul>
                        <li>Tập thể dục</li>
                        <li>Đọc sách</li>
                        <li>Học kỹ năng mới</li>
                        <li>Thiền định</li>
                        <li>Giao tiếp xã hội</li>
                    </ul>
                    </p>
                </div>
                <div class="prevention-step">
                    <h3>4. Tìm Hỗ Trợ</h3>
                    <p>Không cô đơn trong hành trình này. Tìm:
                    <ul>
                        <li>Bạn bè hỗ trợ</li>
                        <li>Cộng đồng online</li>
                        <li>Chuyên gia tư vấn</li>
                        <li>Thầy Thích Nhất Hạnh (AI counselor)</li>
                    </ul>
                    </p>
                </div>
                <div class="prevention-step">
                    <h3>5. Tự Tha Thứ</h3>
                    <p>Nếu tái nghiện, đừng tự trách. Mỗi ngày là cơ hội mới. Học từ sai lầm và tiếp tục.</p>
                </div>
            </div>
            <button class="btn-close-prevention">Đã Hiểu</button>
        </div>
    `;
    
    document.body.appendChild(plan);
    
    plan.querySelector('.close-prevention').addEventListener('click', () => plan.remove());
    plan.querySelector('.btn-close-prevention').addEventListener('click', () => plan.remove());
}

// Emergency Protocol - Giao thức khẩn cấp
export function showEmergencyProtocol() {
    const protocol = document.createElement('div');
    protocol.className = 'emergency-protocol';
    protocol.innerHTML = `
        <div class="protocol-content">
            <h2>🚨 Giao Thức Khẩn Cấp</h2>
            <p>Bạn đang có nguy cơ tái nghiện? Làm ngay những điều sau:</p>
            <div class="protocol-steps">
                <div class="protocol-step urgent">
                    <h3>1. Dừng Lại (STOP)</h3>
                    <p>Dừng mọi hành động. Hít thở sâu 3 lần.</p>
                </div>
                <div class="protocol-step urgent">
                    <h3>2. Rời Khỏi Tình Huống</h3>
                    <p>Rời khỏi nơi bạn đang ở. Đi ra ngoài, đi dạo.</p>
                </div>
                <div class="protocol-step urgent">
                    <h3>3. Gọi Hỗ Trợ</h3>
                    <p>Gọi điện cho bạn bè, hoặc chat với Thầy Thích Nhất Hạnh ngay.</p>
                </div>
                <div class="protocol-step urgent">
                    <h3>4. Làm Một Hoạt Động Khác</h3>
                    <p>Tắm nước lạnh, tập thể dục, hoặc chơi game trên app này.</p>
                </div>
                <div class="protocol-step urgent">
                    <h3>5. Nhắc Nhở Bản Thân</h3>
                    <p>Nhắc nhở tại sao bạn bắt đầu hành trình này. Bạn mạnh mẽ hơn dục vọng.</p>
                </div>
            </div>
            <div class="protocol-actions">
                <button class="btn-call-ai" onclick="window.showAICounselor && window.showAICounselor()">
                    🧘 Chat Với Thầy Thích Nhất Hạnh
                </button>
                <button class="btn-play-game" onclick="window.openGame && window.openGame('breathing')">
                    💨 Chơi Game Thở Sâu
                </button>
                <button class="btn-close-protocol">Đã Làm Xong</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(protocol);
    
    protocol.querySelector('.btn-close-protocol').addEventListener('click', () => protocol.remove());
}

// CSS
const relapsePreventionStyles = `
.relapse-prevention-modal,
.emergency-protocol {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10007;
    padding: 20px;
}

.prevention-content,
.protocol-content {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 30px;
    border-radius: 20px;
    border: 3px solid var(--gold-color);
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.close-prevention {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 32px;
    cursor: pointer;
    color: var(--text-light);
}

.prevention-steps,
.protocol-steps {
    margin: 20px 0;
}

.prevention-step,
.protocol-step {
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    margin: 15px 0;
    border-radius: 10px;
    border-left: 4px solid var(--gold-color);
}

.protocol-step.urgent {
    border-left-color: #f44336;
    background: rgba(244, 67, 54, 0.1);
}

.prevention-step h3,
.protocol-step h3 {
    color: var(--gold-color);
    margin-bottom: 10px;
}

.prevention-step ul,
.protocol-step ul {
    margin: 10px 0;
    padding-left: 20px;
}

.prevention-step li,
.protocol-step li {
    margin: 5px 0;
    line-height: 1.6;
}

.protocol-actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 30px;
}

.btn-call-ai,
.btn-play-game,
.btn-close-prevention,
.btn-close-protocol {
    padding: 15px 30px;
    border: 2px solid var(--gold-color);
    border-radius: 10px;
    background: var(--accent-color);
    color: var(--text-light);
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-call-ai:hover,
.btn-play-game:hover {
    background: var(--secondary-color);
    transform: scale(1.05);
}

.btn-close-prevention,
.btn-close-protocol {
    background: var(--gold-color);
    color: var(--text-dark);
}
`;

if (!document.getElementById('relapse-prevention-styles')) {
    const style = document.createElement('style');
    style.id = 'relapse-prevention-styles';
    style.textContent = relapsePreventionStyles;
    document.head.appendChild(style);
}

// Export
export { checkTriggers, showRelapsePreventionPlan, showEmergencyProtocol };

