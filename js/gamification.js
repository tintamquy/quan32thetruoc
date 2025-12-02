// ============================================
// GAMIFICATION SYSTEM
// Quản lý points, levels, achievements, badges, streaks
// ============================================

import { doc, updateDoc, getDoc, increment, arrayUnion, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import { updateGuestPoints, updateGuestStreak, addGuestAchievement, getGuestData } from './local-storage-manager.js';
import { checkMilestones, showLoginEncouragement } from './encouragement-system.js';
import { checkMilestones as checkMilestoneDays, MILESTONE_MESSAGES } from './honor-system.js';
import { showHallOfFame } from './honor-system.js';

// Định nghĩa achievements
export const ACHIEVEMENTS = {
    WARRIOR_7: {
        id: 'warrior_7',
        name: 'Chiến Binh Thanh Tịnh',
        icon: '🏆',
        description: '7 ngày streak',
        requirement: { type: 'streak', value: 7 }
    },
    DIAMOND_30: {
        id: 'diamond_30',
        name: 'Kim Cương Bất Hoại',
        icon: '💎',
        description: '30 ngày streak',
        requirement: { type: 'streak', value: 30 }
    },
    MASTER_90: {
        id: 'master_90',
        name: 'Bậc Thầy Nội Tâm',
        icon: '🌟',
        description: '90 ngày streak',
        requirement: { type: 'streak', value: 90 }
    },
    TRANSCEND_180: {
        id: 'transcend_180',
        name: 'Phá Trần Xuất Tục',
        icon: '🔥',
        description: '180 ngày streak',
        requirement: { type: 'streak', value: 180 }
    },
    ENLIGHTENMENT_365: {
        id: 'enlightenment_365',
        name: 'Giác Ngộ Viên Mãn',
        icon: '⭐',
        description: '365 ngày streak',
        requirement: { type: 'streak', value: 365 }
    },
    MEDITATION_MASTER: {
        id: 'meditation_master',
        name: 'Thiền Định Đại Sư',
        icon: '🧘',
        description: 'Hoàn thành 100 session thiền',
        requirement: { type: 'meditation_sessions', value: 100 }
    },
    GAME_MASTER: {
        id: 'game_master',
        name: 'Game Master Thanh Tịnh',
        icon: '🎮',
        description: 'Hoàn thành tất cả mini-games',
        requirement: { type: 'all_games_completed', value: 1 }
    },
    GOOD_FRIEND: {
        id: 'good_friend',
        name: 'Thiện Tri Thức',
        icon: '💬',
        description: 'Giúp đỡ 50+ người trong chat',
        requirement: { type: 'chat_helps', value: 50 }
    },
    STEADFAST: {
        id: 'steadfast',
        name: 'Kiên Định Bất Động',
        icon: '🎯',
        description: 'Không miss check-in 30 ngày',
        requirement: { type: 'perfect_checkin', value: 30 }
    },
    FREEDOM: {
        id: 'freedom',
        name: 'Tự Do Giải Thoát',
        icon: '🦅',
        description: 'Level 50+',
        requirement: { type: 'level', value: 50 }
    }
};

// Định nghĩa badges
export const BADGES = {
    FIRST_STEP: { id: 'first_step', name: 'Bước Đầu', icon: '👣' },
    WEEK_WARRIOR: { id: 'week_warrior', name: 'Chiến Binh Tuần', icon: '⚔️' },
    MONTH_HERO: { id: 'month_hero', name: 'Anh Hùng Tháng', icon: '🛡️' },
    POINT_KING: { id: 'point_king', name: 'Vua Điểm', icon: '👑' },
    HELPER: { id: 'helper', name: 'Người Giúp Đỡ', icon: '🤝' }
};

const CELEBRATION_COOLDOWN = 6000;
let lastConfettiTime = 0;

// Thêm points
export async function addPoints(points, activityType = 'general') {
    const user = getCurrentUser();
    
    if (user) {
        // User đã đăng nhập - lưu vào Firebase
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const currentData = userDoc.data();
                const newPoints = (currentData.totalPoints || 0) + points;
                const newLevel = calculateLevel(newPoints);
                
                // Cập nhật points và level
                await updateDoc(userRef, {
                    totalPoints: newPoints,
                    level: newLevel
                });
                
                // Ghi log activity
                await logActivity(user.uid, activityType, points);
                
                // Kiểm tra level up
                if (newLevel > (currentData.level || 1)) {
                    showLevelUpNotification(newLevel);
                }
                
                // Cập nhật UI
                updatePointsUI(newPoints);
                updateLevelUI(newLevel);
                
            // Kiểm tra achievements
            await checkAchievements(user.uid, newPoints, newLevel);
        }
    } catch (error) {
        console.error('Lỗi thêm points:', error);
    }
    } else {
        // Guest user - lưu vào localStorage
        const guestData = updateGuestPoints(points);
        updatePointsUI(guestData.totalPoints);
        updateLevelUI(guestData.level);
        
        // Kiểm tra level up
        const oldLevel = Math.floor((guestData.totalPoints - points) / 1000) + 1;
        if (guestData.level > oldLevel) {
            showLevelUpNotification(guestData.level);
        }
        
        // Ghi log activity (local)
        logGuestActivity(activityType, points);
        
        // Kiểm tra milestones và khuyến khích đăng nhập
        checkMilestones();
        
        // Kiểm tra streak milestones
        if (checkMilestoneDays(guestData.streakDays)) {
            // Milestone celebration đã được hiển thị
        }
        
        // Hiển thị Hall of Fame mỗi 7 ngày
        if (guestData.streakDays > 0 && guestData.streakDays % 7 === 0) {
            setTimeout(() => showHallOfFame(), 2000);
        }
        
        if (guestData.totalPoints % 200 === 0) {
            setTimeout(() => showLoginEncouragement(), 2000);
        }
    }
}

// Tính level từ points
function calculateLevel(points) {
    return Math.floor(points / 1000) + 1;
}

// Cập nhật daily check-in
export async function updateDailyCheckIn() {
    const user = getCurrentUser();
    const now = new Date();
    
    if (user) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
                const currentData = userDoc.data();
                const lastCheckIn = currentData.lastCheckIn?.toDate ? currentData.lastCheckIn.toDate() : currentData.lastCheckIn ? new Date(currentData.lastCheckIn) : null;
                const currentStreak = currentData.streakDays || 0;
                
                if (lastCheckIn && isSameDay(lastCheckIn, now)) {
                    return { success: false, alreadyChecked: true, streak: currentStreak };
                }
                
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const continuedStreak = lastCheckIn && isSameDay(lastCheckIn, yesterday);
                const newStreak = continuedStreak ? currentStreak + 1 : 1;
                const longestStreak = Math.max(newStreak, currentData.longestStreak || 0);
                
                await updateDoc(userRef, {
                    streakDays: newStreak,
                    longestStreak,
                    lastCheckIn: serverTimestamp()
                });
                
                await addPoints(100, 'checkIn');
                updateStreakUI(newStreak);
                
                await checkStreakAchievements(user.uid, newStreak);
                checkMilestoneDays(newStreak);
                
                if (window.userData) {
                    window.userData.streakDays = newStreak;
                    window.userData.longestStreak = longestStreak;
                    window.userData.lastCheckIn = now;
                }
                
                return { success: true, streak: newStreak };
            }
        } catch (error) {
            console.error('Lỗi update check-in:', error);
            return { success: false, error: error.message };
        }
    } else {
        const guestResult = updateGuestStreak();
        const { data, alreadyChecked } = guestResult;
        updateStreakUI(data.streakDays);
        
        if (alreadyChecked) {
            return { success: false, alreadyChecked: true, streak: data.streakDays };
        }
        
        checkGuestStreakAchievements(data.streakDays);
        checkMilestoneDays(data.streakDays);
        
        return { success: true, streak: data.streakDays };
    }
}

// Log guest activity
function logGuestActivity(type, points) {
    try {
        const activities = JSON.parse(localStorage.getItem('guest_activities') || '[]');
        activities.push({
            type,
            points,
            timestamp: new Date().toISOString()
        });
        // Giữ tối đa 100 activities
        if (activities.length > 100) {
            activities.shift();
        }
        localStorage.setItem('guest_activities', JSON.stringify(activities));
    } catch (error) {
        console.error('Lỗi log guest activity:', error);
    }
}

// Kiểm tra guest streak achievements
function checkGuestStreakAchievements(streak) {
    const guestData = getGuestData();
    const streakAchievements = [
        { id: 'warrior_7', value: 7 },
        { id: 'diamond_30', value: 30 },
        { id: 'master_90', value: 90 },
        { id: 'transcend_180', value: 180 },
        { id: 'enlightenment_365', value: 365 }
    ];
    
    streakAchievements.forEach(achievement => {
        if (streak >= achievement.value && !guestData.achievements.includes(achievement.id)) {
            addGuestAchievement(achievement.id);
            const achievementData = Object.values(ACHIEVEMENTS).find(a => a.id === achievement.id);
            if (achievementData) {
                showAchievementNotification(achievementData);
            }
        }
    });
}

// Kiểm tra achievements
async function checkAchievements(userId, points, level) {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentAchievements = userData.achievements || [];
            const newAchievements = [];
            
            // Kiểm tra từng achievement
            Object.values(ACHIEVEMENTS).forEach(achievement => {
                if (currentAchievements.includes(achievement.id)) return;
                
                let unlocked = false;
                
                switch (achievement.requirement.type) {
                    case 'level':
                        unlocked = level >= achievement.requirement.value;
                        break;
                    case 'points':
                        unlocked = points >= achievement.requirement.value;
                        break;
                }
                
                if (unlocked) {
                    newAchievements.push(achievement.id);
                }
            });
            
            if (newAchievements.length > 0) {
                await updateDoc(userRef, {
                    achievements: arrayUnion(...newAchievements)
                });
                
                // Hiển thị notification cho từng achievement
                newAchievements.forEach(achievementId => {
                    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
                    if (achievement) {
                        showAchievementNotification(achievement);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Lỗi kiểm tra achievements:', error);
    }
}

// Kiểm tra streak achievements
async function checkStreakAchievements(userId, streak) {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const currentAchievements = userData.achievements || [];
            const newAchievements = [];
            
            // Kiểm tra streak achievements
            const streakAchievements = [
                ACHIEVEMENTS.WARRIOR_7,
                ACHIEVEMENTS.DIAMOND_30,
                ACHIEVEMENTS.MASTER_90,
                ACHIEVEMENTS.TRANSCEND_180,
                ACHIEVEMENTS.ENLIGHTENMENT_365
            ];
            
            streakAchievements.forEach(achievement => {
                if (currentAchievements.includes(achievement.id)) return;
                
                if (streak >= achievement.requirement.value) {
                    newAchievements.push(achievement.id);
                }
            });
            
            if (newAchievements.length > 0) {
                await updateDoc(userRef, {
                    achievements: arrayUnion(...newAchievements)
                });
                
                newAchievements.forEach(achievementId => {
                    const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
                    if (achievement) {
                        showAchievementNotification(achievement);
                    }
                });
            }
        }
    } catch (error) {
        console.error('Lỗi kiểm tra streak achievements:', error);
    }
}

// Ghi log activity
async function logActivity(userId, type, points) {
    try {
        const { setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const activitiesRef = doc(db, 'activities', `${userId}_${Date.now()}`);
        await setDoc(activitiesRef, {
            userId: userId,
            type: type,
            points: points,
            timestamp: serverTimestamp(),
            duration: 0
        });
    } catch (error) {
        console.error('Lỗi ghi log activity:', error);
    }
}

// Hiển thị achievement notification
function showAchievementNotification(achievement) {
    const notification = document.getElementById('achievement-notification');
    const nameElement = document.getElementById('achievement-name');
    
    if (notification && nameElement) {
        nameElement.textContent = `${achievement.icon} ${achievement.name}`;
        notification.classList.remove('hidden');
        
        // Confetti effect
        createConfetti();
        
        // Ẩn sau 5 giây
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 5000);
    }
}

// Tạo confetti effect
function createConfetti() {
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'];
    const confettiCount = 50;
    
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

// Hiển thị level up notification
function showLevelUpNotification(level) {
    const message = `CHÚC MỪNG! Bạn lên level ${level}! Bạn là nguồn cảm hứng!`;
    showEncouragementMessage(message);
    createConfetti();
}

// Hiển thị encouragement message
export function showEncouragementMessage(message, options = {}) {
    // Tạo temporary notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'linear-gradient(135deg, #ffd700, #ffed4e)';
    notification.style.color = '#333';
    notification.style.padding = '15px 30px';
    notification.style.borderRadius = '10px';
    notification.style.fontSize = '18px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '10003';
    notification.style.boxShadow = '0 5px 20px rgba(255, 215, 0, 0.6)';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
    
    const shouldCelebrate = options.celebrate !== undefined
        ? options.celebrate
        : /tuyệt vời|CHÚC MỪNG|chiến thắng/i.test(message);
    
    if (shouldCelebrate) {
        const now = Date.now();
        if (now - lastConfettiTime > CELEBRATION_COOLDOWN) {
            createConfetti();
            lastConfettiTime = now;
        }
    }
}

// Cập nhật UI
function updatePointsUI(points) {
    const element = document.getElementById('total-points');
    if (element) {
        animateNumberChange(element, parseInt(element.textContent) || 0, points);
    }
}

function updateLevelUI(level) {
    const element = document.getElementById('user-level');
    if (element) {
        animateNumberChange(element, parseInt(element.textContent) || 1, level);
    }
}

function updateStreakUI(streak) {
    const element = document.getElementById('streak-days');
    if (element) {
        animateNumberChange(element, parseInt(element.textContent) || 0, streak);
    }
}

function animateNumberChange(element, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    const duration = 1000;
    const startTime = Date.now();
    const difference = newValue - oldValue;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(oldValue + difference * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = newValue;
        }
    }
    
    update();
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

// Export để sử dụng ở file khác
export { logActivity };

