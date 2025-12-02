// ============================================
// HONOR SYSTEM - Hệ Thống Vinh Danh
// Vinh danh và tôn vinh người dùng
// ============================================

import { getCurrentUser } from './auth.js';
import { getGuestData } from './local-storage-manager.js';

// Hall of Fame - Vinh Danh
export function showHallOfFame() {
    const user = getCurrentUser();
    const data = user ? window.userData : getGuestData();
    
    if (!data) return;
    
    const honors = calculateHonors(data);
    
    if (honors.length === 0) return;
    
    const honorModal = document.createElement('div');
    honorModal.className = 'hall-of-fame-modal';
    honorModal.innerHTML = `
        <div class="honor-content">
            <span class="close-honor">&times;</span>
            <h2>🏆 Đền Vinh Danh</h2>
            <div class="honors-list">
                ${honors.map(honor => `
                    <div class="honor-item">
                        <div class="honor-icon">${honor.icon}</div>
                        <div class="honor-info">
                            <h3>${honor.title}</h3>
                            <p>${honor.description}</p>
                            <div class="honor-stats">
                                <span>${honor.stat}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="honor-celebration">
                <p>Bạn đáng được tôn vinh! 🌟</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(honorModal);
    
    honorModal.querySelector('.close-honor').addEventListener('click', () => {
        honorModal.remove();
    });
    
    // Auto close sau 10 giây
    setTimeout(() => {
        if (honorModal.parentNode) {
            honorModal.remove();
        }
    }, 10000);
}

// Tính toán honors
function calculateHonors(data) {
    const honors = [];
    
    // Streak honors
    if (data.streakDays >= 365) {
        honors.push({
            icon: '⭐',
            title: 'Bậc Thầy Giác Ngộ',
            description: '365 ngày thanh tịnh liên tiếp',
            stat: `${data.streakDays} ngày`
        });
    } else if (data.streakDays >= 180) {
        honors.push({
            icon: '🔥',
            title: 'Phá Trần Xuất Tục',
            description: '180 ngày thanh tịnh liên tiếp',
            stat: `${data.streakDays} ngày`
        });
    } else if (data.streakDays >= 90) {
        honors.push({
            icon: '🌟',
            title: 'Bậc Thầy Nội Tâm',
            description: '90 ngày thanh tịnh liên tiếp',
            stat: `${data.streakDays} ngày`
        });
    } else if (data.streakDays >= 30) {
        honors.push({
            icon: '💎',
            title: 'Kim Cương Bất Hoại',
            description: '30 ngày thanh tịnh liên tiếp',
            stat: `${data.streakDays} ngày`
        });
    } else if (data.streakDays >= 7) {
        honors.push({
            icon: '🏆',
            title: 'Chiến Binh Thanh Tịnh',
            description: '7 ngày thanh tịnh liên tiếp',
            stat: `${data.streakDays} ngày`
        });
    }
    
    // Points honors
    if (data.totalPoints >= 10000) {
        honors.push({
            icon: '👑',
            title: 'Vua Điểm',
            description: 'Đạt hơn 10,000 điểm',
            stat: `${data.totalPoints} điểm`
        });
    } else if (data.totalPoints >= 5000) {
        honors.push({
            icon: '💫',
            title: 'Ngôi Sao Sáng',
            description: 'Đạt hơn 5,000 điểm',
            stat: `${data.totalPoints} điểm`
        });
    }
    
    // Level honors
    if (data.level >= 50) {
        honors.push({
            icon: '🦅',
            title: 'Tự Do Giải Thoát',
            description: 'Đạt level 50+',
            stat: `Level ${data.level}`
        });
    } else if (data.level >= 25) {
        honors.push({
            icon: '⚡',
            title: 'Sấm Sét',
            description: 'Đạt level 25+',
            stat: `Level ${data.level}`
        });
    }
    
    return honors;
}

// Weekly Champion - Vô Địch Tuần
export function showWeeklyChampion() {
    // Hiển thị top 3 của tuần
    const championBanner = document.createElement('div');
    championBanner.className = 'weekly-champion-banner';
    championBanner.innerHTML = `
        <div class="champion-content">
            <h3>👑 Vô Địch Tuần</h3>
            <div class="champions-list">
                <div class="champion-item">
                    <span class="rank">🥇</span>
                    <span class="name">Đang tải...</span>
                </div>
            </div>
        </div>
    `;
    
    // Có thể load từ Firestore sau
    document.body.appendChild(championBanner);
}

// Milestone Celebrations - Kỷ Niệm Milestone
export const MILESTONE_MESSAGES = {
    1: { icon: '🎉', message: 'Ngày đầu tiên! Bạn đã bắt đầu hành trình!', points: 100 },
    3: { icon: '🌟', message: '3 ngày! Bạn đang tiến bộ!', points: 150 },
    7: { icon: '🏆', message: '1 tuần! Bạn là chiến binh thật sự!', points: 200 },
    14: { icon: '💎', message: '2 tuần! Bạn đang mạnh mẽ hơn!', points: 300 },
    30: { icon: '⭐', message: '1 tháng! Bạn là kim cương bất hoại!', points: 500 },
    60: { icon: '🔥', message: '2 tháng! Lửa trong bạn đang cháy!', points: 750 },
    90: { icon: '🌟', message: '3 tháng! Bạn là bậc thầy!', points: 1000 },
    180: { icon: '⚡', message: '6 tháng! Bạn đã phá trần xuất tục!', points: 2000 },
    365: { icon: '👑', message: '1 năm! Bạn là vua của chính mình!', points: 5000 }
};

export function checkMilestones(streakDays) {
    const milestone = MILESTONE_MESSAGES[streakDays];
    if (milestone) {
        showMilestoneCelebration(milestone, streakDays);
        return true;
    }
    return false;
}

function showMilestoneCelebration(milestone, days) {
    const celebration = document.createElement('div');
    celebration.className = 'milestone-celebration-large';
    celebration.innerHTML = `
        <div class="celebration-large-content">
            <div class="celebration-icon-large">${milestone.icon}</div>
            <h2>CHÚC MỪNG MILESTONE!</h2>
            <p class="celebration-message">${milestone.message}</p>
            <p class="celebration-days">${days} ngày thanh tịnh!</p>
            <div class="celebration-points">+${milestone.points} điểm</div>
            <button class="btn-celebration-close">Tuyệt Vời!</button>
        </div>
    `;
    
    document.body.appendChild(celebration);
    
    // Confetti
    createConfetti();
    
    celebration.querySelector('.btn-celebration-close').addEventListener('click', () => {
        celebration.remove();
    });
    
    // Auto close sau 8 giây
    setTimeout(() => {
        if (celebration.parentNode) {
            celebration.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => celebration.remove(), 500);
        }
    }, 8000);
}

function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '10010';
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

// CSS
const honorSystemStyles = `
.hall-of-fame-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10009;
    padding: 20px;
}

.honor-content {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    padding: 40px;
    border-radius: 20px;
    border: 3px solid var(--gold-color);
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
}

.close-honor {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 32px;
    cursor: pointer;
    color: var(--text-light);
}

.honors-list {
    margin: 30px 0;
}

.honor-item {
    display: flex;
    gap: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border-left: 4px solid var(--gold-color);
    margin-bottom: 15px;
}

.honor-icon {
    font-size: 48px;
    flex-shrink: 0;
}

.honor-info {
    flex: 1;
}

.honor-info h3 {
    color: var(--gold-color);
    margin-bottom: 10px;
    font-size: 20px;
}

.honor-info p {
    color: var(--text-light);
    line-height: 1.6;
    margin-bottom: 10px;
}

.honor-stats {
    color: var(--gold-color);
    font-weight: bold;
}

.honor-celebration {
    text-align: center;
    margin-top: 30px;
    padding: 20px;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
}

.honor-celebration p {
    font-size: 24px;
    color: var(--gold-color);
    font-weight: bold;
}

.milestone-celebration-large {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10010;
}

.celebration-large-content {
    background: linear-gradient(135deg, var(--gold-color), #ffed4e);
    padding: 50px;
    border-radius: 30px;
    border: 5px solid var(--text-light);
    text-align: center;
    box-shadow: 0 20px 60px rgba(255, 215, 0, 0.8);
    color: var(--text-dark);
    animation: celebrationPulse 0.5s ease;
}

@keyframes celebrationPulse {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
}

.celebration-icon-large {
    font-size: 120px;
    margin-bottom: 20px;
    animation: iconBounce 1s ease-in-out infinite;
}

@keyframes iconBounce {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-20px) scale(1.1); }
}

.celebration-large-content h2 {
    font-size: 36px;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);
}

.celebration-message {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 15px;
}

.celebration-days {
    font-size: 32px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
}

.celebration-points {
    font-size: 28px;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 30px;
}

.btn-celebration-close {
    padding: 15px 40px;
    background: var(--text-dark);
    color: var(--gold-color);
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-celebration-close:hover {
    transform: scale(1.05);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}
`;

if (!document.getElementById('honor-system-styles')) {
    const style = document.createElement('style');
    style.id = 'honor-system-styles';
    style.textContent = honorSystemStyles;
    document.head.appendChild(style);
}

// Exports đã có ở đầu file với export function

