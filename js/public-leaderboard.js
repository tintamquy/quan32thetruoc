// ============================================
// PUBLIC LEADERBOARD - Bảng Xếp Hạng Công Khai
// Hiển thị top players không cần đăng nhập
// ============================================

import { collection, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

// Load public leaderboard
export async function loadPublicLeaderboard() {
    const container = document.getElementById('public-leaderboard');
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải...</p>';
    
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('streakDays', 'desc'), limit(100));
        const snapshot = await getDocs(q);
        
        const leaders = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.streakDays > 0) {
                leaders.push({
                    id: doc.id,
                    name: data.displayName || 'Người dùng',
                    streak: data.streakDays || 0,
                    points: data.totalPoints || 0,
                    level: data.level || 1,
                    achievements: data.achievements || []
                });
            }
        });
        
        displayLeaderboard(leaders);
        return leaders;
    } catch (error) {
        console.error('Lỗi load leaderboard:', error);
        // Fallback: hiển thị message
        container.innerHTML = '<p style="text-align: center; padding: 20px; color: #ff6b6b;">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>';
    }
}

// Hiển thị leaderboard
function displayLeaderboard(leaders) {
    const container = document.getElementById('public-leaderboard');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (leaders.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Chưa có dữ liệu. Hãy là người đầu tiên!</p>';
        return;
    }
    
    leaders.forEach((leader, index) => {
        const rank = index + 1;
        const medal = getMedal(rank);
        
        const leaderItem = document.createElement('div');
        leaderItem.className = 'leaderboard-item-public';
        leaderItem.innerHTML = `
            <div class="leader-rank-public">
                ${medal} <span class="rank-number">${rank}</span>
            </div>
            <div class="leader-info-public">
                <div class="leader-name-public">${escapeHtml(leader.name)}</div>
                <div class="leader-stats-public">
                    <span>🔥 ${leader.streak} ngày</span>
                    <span>💎 ${leader.points} điểm</span>
                    <span>⭐ Level ${leader.level}</span>
                </div>
            </div>
            <div class="leader-achievements-public">
                ${(leader.achievements || []).slice(0, 3).map(a => {
                    const achievement = getAchievementIcon(a);
                    return `<span class="achievement-badge">${achievement}</span>`;
                }).join('')}
            </div>
        `;
        
        container.appendChild(leaderItem);
    });
}

// Hiển thị local leaderboard (fallback)
function displayLocalLeaderboard() {
    const container = document.getElementById('public-leaderboard');
    if (!container) return;
    
    container.innerHTML = '<p style="text-align: center; padding: 20px;">Đang tải dữ liệu...</p>';
}

// Lấy medal icon
function getMedal(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
}

// Lấy achievement icon
function getAchievementIcon(achievementId) {
    const icons = {
        'warrior_7': '🏆',
        'diamond_30': '💎',
        'master_90': '🌟',
        'transcend_180': '🔥',
        'enlightenment_365': '⭐',
        'meditation_master': '🧘',
        'game_master': '🎮',
        'good_friend': '💬',
        'steadfast': '🎯',
        'freedom': '🦅'
    };
    return icons[achievementId] || '⭐';
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Auto refresh leaderboard mỗi 30 giây
let leaderboardInterval = null;

export function startLeaderboardAutoRefresh() {
    loadPublicLeaderboard();
    
    if (leaderboardInterval) {
        clearInterval(leaderboardInterval);
    }
    
    leaderboardInterval = setInterval(() => {
        loadPublicLeaderboard();
    }, 30000); // 30 giây
}

export function stopLeaderboardAutoRefresh() {
    if (leaderboardInterval) {
        clearInterval(leaderboardInterval);
        leaderboardInterval = null;
    }
}

// CSS
const leaderboardStyles = `
#public-leaderboard {
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
}

.leaderboard-item-public {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    border: 2px solid rgba(255, 215, 0, 0.3);
    transition: all 0.3s ease;
}

.leaderboard-item-public:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--gold-color);
    transform: translateX(5px);
}

.leaderboard-item-public:nth-child(1) {
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
    border-color: var(--gold-color);
}

.leaderboard-item-public:nth-child(2),
.leaderboard-item-public:nth-child(3) {
    background: rgba(255, 255, 255, 0.08);
}

.leader-rank-public {
    font-size: 24px;
    font-weight: bold;
    min-width: 60px;
    text-align: center;
}

.rank-number {
    font-size: 18px;
    color: var(--gold-color);
}

.leader-info-public {
    flex: 1;
}

.leader-name-public {
    font-size: 18px;
    font-weight: bold;
    color: var(--gold-color);
    margin-bottom: 5px;
}

.leader-stats-public {
    display: flex;
    gap: 15px;
    font-size: 14px;
    opacity: 0.8;
}

.leader-achievements-public {
    display: flex;
    gap: 5px;
}

.achievement-badge {
    font-size: 24px;
}
`;

if (!document.getElementById('public-leaderboard-styles')) {
    const style = document.createElement('style');
    style.id = 'public-leaderboard-styles';
    style.textContent = leaderboardStyles;
    document.head.appendChild(style);
}

