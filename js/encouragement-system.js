// ============================================
// ENCOURAGEMENT SYSTEM
// Hệ thống động viên, khen ngợi và khuyến khích đăng nhập
// ============================================

import { getCurrentUser } from './auth.js';
import { getGuestData } from './local-storage-manager.js';

// Lời khen ngợi khi hoàn thành game
export const ENCOURAGEMENT_MESSAGES = {
    gameComplete: [
        "Tuyệt vời! Bạn đang mạnh mẽ hơn mỗi ngày!",
        "Xuất sắc! Bạn đang kiểm soát cuộc đời mình!",
        "Tuyệt vời! Mỗi bước nhỏ đều quan trọng!",
        "Bạn làm rất tốt! Tiếp tục phấn đấu!",
        "Tuyệt vời! Bạn đang trên con đường đúng đắn!",
        "Xuất sắc! Bạn là nguồn cảm hứng!",
        "Tuyệt vời! Sức mạnh nội tâm của bạn đang lớn dần!",
        "Bạn đang lấy lại quyền kiểm soát! Tuyệt vời!",
        "Kiên trì là chìa khóa! Bạn đang làm rất tốt!",
        "Tuyệt vời! Bạn là chiến binh thật sự!"
    ],
    checkIn: [
        "Hôm nay bạn lại chiến thắng! Tuyệt vời!",
        "Ngày {X} của bạn! Bạn là chiến binh thật sự!",
        "Nội tâm bạn đang trở nên mạnh mẽ hơn mỗi ngày!",
        "Bạn đang trên con đường đúng đắn! Tiếp tục phấn đấu!",
        "Mỗi ngày là một chiến thắng mới! Bạn làm rất tốt!",
        "Sức mạnh nội tâm của bạn đang lớn dần!",
        "Bạn đang lấy lại quyền kiểm soát cuộc đời mình!",
        "Kiên trì là chìa khóa! Bạn đang làm rất tốt!",
        "Bạn là nguồn cảm hứng cho chính mình!",
        "Tuyệt vời! Bạn đang kiểm soát cuộc đời mình!"
    ],
    levelUp: [
        "CHÚC MỪNG! Bạn lên level {X}! Bạn là nguồn cảm hứng!",
        "Level {X}! Bạn đang tiến bộ tuyệt vời!",
        "Xuất sắc! Level {X} - Bạn đang mạnh mẽ hơn!",
        "Tuyệt vời! Level {X} - Tiếp tục phấn đấu!",
        "Level {X}! Bạn đang trên con đường đúng đắn!"
    ],
    achievement: [
        "THÀNH TỰU MỚI! {name} - Bạn xuất sắc quá!",
        "Chúc mừng! {name} - Bạn đáng được tôn vinh!",
        "Tuyệt vời! {name} - Bạn là chiến binh thật sự!",
        "Xuất sắc! {name} - Bạn đang làm rất tốt!"
    ],
    loginPrompt: [
        "Đăng nhập để lưu tiến độ và tham gia cộng đồng hỗ trợ!",
        "Lưu tiến độ của bạn và kết nối với cộng đồng!",
        "Đăng nhập để theo dõi hành trình và nhận thành tựu!",
        "Tham gia cộng đồng và lưu tiến độ của bạn!"
    ]
};

// Hiển thị thông báo khuyến khích đăng nhập
export function showLoginEncouragement() {
    const user = getCurrentUser();
    if (user) return; // Đã đăng nhập rồi
    
    const guestData = getGuestData();
    
    // Chỉ hiển thị nếu có tiến độ đáng kể
    if (guestData.totalPoints > 100 || guestData.streakDays > 0) {
        const messages = ENCOURAGEMENT_MESSAGES.loginPrompt;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Tạo notification
        const notification = document.createElement('div');
        notification.className = 'login-encouragement-notification';
        notification.innerHTML = `
            <div class="encouragement-content">
                <p>${randomMessage}</p>
                <button class="btn-encourage-login">Đăng Nhập Ngay</button>
                <button class="btn-encourage-close">Để Sau</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Event listeners
        notification.querySelector('.btn-encourage-login').addEventListener('click', () => {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.classList.remove('hidden');
            }
            notification.remove();
        });
        
        notification.querySelector('.btn-encourage-close').addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto hide sau 10 giây
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }
}

// Hiển thị thông báo tôn vinh khi đạt milestone
export function showMilestoneCelebration(milestone) {
    const celebration = document.createElement('div');
    celebration.className = 'milestone-celebration';
    celebration.innerHTML = `
        <div class="celebration-content">
            <div class="celebration-icon">🎉</div>
            <h2>CHÚC MỪNG!</h2>
            <p>${milestone.message}</p>
            <p class="celebration-subtitle">Bạn đáng được tôn vinh!</p>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Confetti effect
    createConfetti();
    
    // Auto remove sau 5 giây
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => celebration.remove(), 500);
        }
    }, 5000);
}

// Tạo confetti
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10002';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Kiểm tra và hiển thị milestone
export function checkMilestones() {
    const user = getCurrentUser();
    const data = user ? window.userData : getGuestData();
    
    if (!data) return;
    
    // Milestone: 100 điểm
    if (data.totalPoints >= 100 && !data.milestone_100) {
        showMilestoneCelebration({
            message: 'Bạn đã đạt 100 điểm! Bạn đang trên con đường đúng đắn!'
        });
        if (!user) {
            const guestData = getGuestData();
            guestData.milestone_100 = true;
            localStorage.setItem('quan32thetruoc_guest_data', JSON.stringify(guestData));
        }
    }
    
    // Milestone: 7 ngày streak
    if (data.streakDays >= 7 && !data.milestone_7days) {
        showMilestoneCelebration({
            message: '7 ngày liên tiếp! Bạn là Chiến Binh Thanh Tịnh!'
        });
        if (!user) {
            const guestData = getGuestData();
            guestData.milestone_7days = true;
            localStorage.setItem('quan32thetruoc_guest_data', JSON.stringify(guestData));
        }
    }
}

