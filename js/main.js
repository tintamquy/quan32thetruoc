// ============================================
// MAIN.JS - File chính kết nối tất cả modules
// ============================================

import { initAuth, getCurrentUser } from './auth.js';
import { initGameEngine } from './game-engine.js';
import { initAICounselor, showAICounselor } from './ai-counselor.js';
import { initChatSystem, cleanupChat } from './chat-system.js';
import { updateDailyCheckIn, showEncouragementMessage } from './gamification.js';
import { initMeditationGame } from './mini-games/meditation-game.js';
import { initMemoryGame } from './mini-games/memory-game.js';
import { initBreathingGame } from './mini-games/breathing-game.js';
import { initBodyScanGame } from './mini-games/body-scan-game.js';
import { initWhackMoleGame } from './mini-games/whack-mole-game.js';
import { initQuizGame } from './mini-games/quiz-game.js';
import { initTypingGame } from './mini-games/typing-game.js';
import { initColorMatchGame } from './mini-games/color-match-game.js';
import { loadPublicLeaderboard, startLeaderboardAutoRefresh } from './public-leaderboard.js';
import { initUrgeSurfing, initGroundingTechnique } from './therapy-tools.js';
import { showRelapsePreventionPlan, showEmergencyProtocol } from './relapse-prevention.js';
import { initDharmaQuotes } from './dharma-quotes.js';
import { initFeedbackForm } from './feedback.js';

// Game handlers
const gameHandlers = {
    'meditation-32': initMeditationGame,
    'memory': initMemoryGame,
    'breathing': initBreathingGame,
    'body-scan': initBodyScanGame,
    'whack-mole': initWhackMoleGame,
    'quiz': initQuizGame,
    'typing': initTypingGame,
    'color-match': initColorMatchGame
};

let immersiveModeEnabled = false;
let gameEngineInitialized = false;

// Khởi tạo app
document.addEventListener('DOMContentLoaded', () => {
    // Ẩn loading screen sau khi load xong
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000);
    
    // Khởi tạo chế độ trải nghiệm
    initExperienceModes();
    
    // Khởi tạo auth
    initAuth();
    
    // Khởi tạo AI counselor
    initAICounselor();
    
    // Khởi tạo chat system
    initChatSystem();
    
    // Góp ý tàm quý
    initFeedbackForm();
    
    // Kinh cảnh tỉnh
    initDharmaQuotes();
    
    // Load public leaderboard
    loadPublicLeaderboard();
    startLeaderboardAutoRefresh();
    
    // Show daily quote
    setTimeout(async () => {
        const { showDailyQuote } = await import('./daily-motivation.js');
        showDailyQuote();
    }, 2000);
    
    // Setup event listeners
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Auth modal
    setupAuthModal();
    
    // Game buttons
    setupGameButtons();
    
    // Check-in modal
    setupCheckInModal();
    
    // Profile modal
    setupProfileModal();
    
    // Side panel toggle
    setupSidePanel();
    
    // Game selection event
    window.addEventListener('gameSelected', (e) => {
        const gameName = e.detail.gameName;
        openGame(gameName);
    });
}

// Simple mode & immersive mode handling
function initExperienceModes() {
    const savedMode = localStorage.getItem('experienceMode') || 'simple';
    immersiveModeEnabled = savedMode === 'immersive';
    updateExperienceMode();
    setupSimpleModeActions();
}

function setupSimpleModeActions() {
    const toggleBtn = document.getElementById('toggle-experience-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            immersiveModeEnabled = !immersiveModeEnabled;
            localStorage.setItem('experienceMode', immersiveModeEnabled ? 'immersive' : 'simple');
            updateExperienceMode();
        });
    }
    
    const quickGameButtons = document.querySelectorAll('[data-quick-game]');
    quickGameButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameName = btn.dataset.quickGame;
            if (gameName) {
                openGame(gameName);
            }
        });
    });
    
    const quickTherapyButtons = document.querySelectorAll('[data-quick-therapy]');
    quickTherapyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.quickTherapy;
            handleQuickTherapy(action);
        });
    });
    
    const simpleAiBtn = document.getElementById('simple-ai-btn');
    if (simpleAiBtn) {
        simpleAiBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (user) {
                showAICounselor();
            } else {
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.classList.remove('hidden');
                showEncouragementMessage('Đăng nhập để Thầy có thể đồng hành cùng bạn một cách an toàn.', { celebrate: false });
            }
        });
    }
}

function updateExperienceMode() {
    const body = document.body;
    const toggleBtn = document.getElementById('toggle-experience-btn');
    
    if (!body) return;
    
    if (immersiveModeEnabled) {
        body.classList.remove('simple-mode');
        body.classList.add('immersive-mode');
        if (toggleBtn) {
            toggleBtn.textContent = '🌌 Đang ở chế độ 3D - Quay lại chế độ đơn giản';
        }
        ensureGameEngine();
    } else {
        body.classList.add('simple-mode');
        body.classList.remove('immersive-mode');
        if (toggleBtn) {
            toggleBtn.textContent = '🌤️ Đang ở chế độ Dễ Dàng - Xem thế giới 3D';
        }
    }
}

function ensureGameEngine() {
    if (gameEngineInitialized) return;
    initGameEngine();
    gameEngineInitialized = true;
}

function handleQuickTherapy(action) {
    switch (action) {
        case 'grounding':
            initGroundingTechnique();
            break;
        case 'urge-surfing':
            initUrgeSurfing();
            break;
        case 'emergency':
            showEmergencyProtocol();
            break;
        default:
            break;
    }
}

// Setup auth modal
function setupAuthModal() {
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide forms
            if (tab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                signupForm.classList.add('active');
            }
        });
    });
    
    // Login
    const loginBtn = document.getElementById('login-btn');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', async () => {
            const email = loginEmail.value;
            const password = loginPassword.value;
            
            if (!email || !password) {
                loginError.textContent = 'Vui lòng điền đầy đủ thông tin';
                return;
            }
            
            loginBtn.disabled = true;
            loginError.textContent = '';
            
            const { loginWithEmail } = await import('./auth.js');
            const result = await loginWithEmail(email, password);
            
            if (result.success) {
                // Auth state listener sẽ xử lý
            } else {
                loginError.textContent = result.error;
                loginBtn.disabled = false;
            }
        });
    }
    
    // Signup
    const signupBtn = document.getElementById('signup-btn');
    const signupName = document.getElementById('signup-name');
    const signupEmail = document.getElementById('signup-email');
    const signupPassword = document.getElementById('signup-password');
    const signupError = document.getElementById('signup-error');
    
    if (signupBtn) {
        signupBtn.addEventListener('click', async () => {
            const name = signupName.value;
            const email = signupEmail.value;
            const password = signupPassword.value;
            
            if (!name || !email || !password) {
                signupError.textContent = 'Vui lòng điền đầy đủ thông tin';
                return;
            }
            
            if (password.length < 6) {
                signupError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
                return;
            }
            
            signupBtn.disabled = true;
            signupError.textContent = '';
            
            const { signupWithEmail } = await import('./auth.js');
            const result = await signupWithEmail(name, email, password);
            
            if (result.success) {
                // Auth state listener sẽ xử lý
            } else {
                signupError.textContent = result.error;
                signupBtn.disabled = false;
            }
        });
    }
    
    // Google login
    const googleLoginBtn = document.getElementById('google-login-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            googleLoginBtn.disabled = true;
            const { loginWithGoogle } = await import('./auth.js');
            await loginWithGoogle();
            googleLoginBtn.disabled = false;
        });
    }
    
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', async () => {
            googleSignupBtn.disabled = true;
            const { loginWithGoogle } = await import('./auth.js');
            await loginWithGoogle();
            googleSignupBtn.disabled = false;
        });
    }
    
    // Close modal
    const closeModals = document.querySelectorAll('.close-modal');
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            authModal.classList.add('hidden');
        });
    });
}

// Setup game buttons
function setupGameButtons() {
    const gameButtons = document.querySelectorAll('.game-btn');
    gameButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameName = btn.dataset.game;
            if (gameName) {
                openGame(gameName);
            }
        });
    });
    
    // Setup therapy tools buttons
    const therapyButtons = document.querySelectorAll('.therapy-btn');
    therapyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const therapyType = btn.dataset.therapy;
            if (therapyType) {
                openTherapyTool(therapyType);
            }
        });
    });
}

// Mở therapy tool
function openTherapyTool(toolType) {
    const gameModal = document.getElementById('game-modal');
    const gameContent = document.getElementById('game-content');
    
    if (!gameModal || !gameContent) return;
    
    gameModal.classList.remove('hidden');
    
    switch(toolType) {
        case 'urge-surfing':
            initUrgeSurfing();
            break;
        case 'grounding':
            initGroundingTechnique();
            break;
        case 'relapse-prevention':
            gameModal.classList.add('hidden');
            showRelapsePreventionPlan();
            return;
        case 'emergency':
            gameModal.classList.add('hidden');
            showEmergencyProtocol();
            return;
    }
    
    // Close button
    const closeBtn = document.getElementById('close-game-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            gameModal.classList.add('hidden');
        };
    }
}

// Mở game
function openGame(gameName) {
    const gameModal = document.getElementById('game-modal');
    const gameContent = document.getElementById('game-content');
    
    if (!gameModal || !gameContent) return;
    
    // Show modal
    gameModal.classList.remove('hidden');
    
    // Initialize game
    const handler = gameHandlers[gameName];
    if (handler) {
        handler();
    }
    
    // Close button
    const closeBtn = document.getElementById('close-game-btn');
    if (closeBtn) {
        closeBtn.onclick = () => {
            gameModal.classList.add('hidden');
        };
    }
}

// Setup check-in modal
function setupCheckInModal() {
    const confirmBtn = document.getElementById('confirm-checkin-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', async () => {
            const result = await updateDailyCheckIn();
            if (result.success) {
                const modal = document.getElementById('checkin-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            } else if (result.alreadyChecked) {
                const modal = document.getElementById('checkin-modal');
                if (modal) modal.classList.add('hidden');
                showEncouragementMessage('Hôm nay bạn đã ghi nhận chiến thắng rồi. Hãy quay lại sau bình minh mới.', { celebrate: false });
            }
        });
    }
}

// Setup profile modal
function setupProfileModal() {
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    
    if (profileBtn && profileModal) {
        profileBtn.addEventListener('click', () => {
            loadProfileData();
            profileModal.classList.remove('hidden');
        });
    }
    
    const closeProfile = profileModal?.querySelector('.close-modal');
    if (closeProfile) {
        closeProfile.addEventListener('click', () => {
            profileModal.classList.add('hidden');
        });
    }
}

// Load profile data
async function loadProfileData() {
    const user = getCurrentUser();
    if (!user) return;
    
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { db } = await import('./firebase-config.js');
    
    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // Update profile UI
            const profileName = document.getElementById('profile-name');
            if (profileName) {
                profileName.textContent = userData.displayName || 'Người dùng';
            }
            
            document.getElementById('profile-streak').textContent = userData.streakDays || 0;
            document.getElementById('profile-longest-streak').textContent = userData.longestStreak || 0;
            document.getElementById('profile-total-points').textContent = userData.totalPoints || 0;
            document.getElementById('profile-level').textContent = userData.level || 1;
            
            // Load achievements
            loadAchievements(userData.achievements || []);
            loadBadges(userData.badges || []);
        }
    } catch (error) {
        console.error('Lỗi load profile:', error);
    }
}

// Load achievements
async function loadAchievements(achievementIds) {
    const container = document.getElementById('achievements-list');
    if (!container) return;
    
    const { ACHIEVEMENTS } = await import('./gamification.js');
    container.innerHTML = '';
    
    Object.values(ACHIEVEMENTS).forEach(achievement => {
        const item = document.createElement('div');
        item.className = `achievement-item ${achievementIds.includes(achievement.id) ? '' : 'locked'}`;
        item.innerHTML = `
            <div class="achievement-icon-large">${achievement.icon}</div>
            <div class="achievement-name">${achievement.name}</div>
        `;
        container.appendChild(item);
    });
}

// Load badges
async function loadBadges(badgeIds) {
    const container = document.getElementById('badges-list');
    if (!container) return;
    
    const { BADGES } = await import('./gamification.js');
    container.innerHTML = '';
    
    Object.values(BADGES).forEach(badge => {
        const item = document.createElement('div');
        item.className = `badge-item ${badgeIds.includes(badge.id) ? '' : 'locked'}`;
        item.innerHTML = `
            <div class="badge-icon-large">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
        `;
        container.appendChild(item);
    });
}

// Setup side panel
function setupSidePanel() {
    // Toggle side panel với button (có thể thêm sau)
    // Hiện tại side panel sẽ tự động hiển thị khi có user
}

// Login prompt button
const loginPromptBtn = document.getElementById('login-prompt-btn');
if (loginPromptBtn) {
    loginPromptBtn.addEventListener('click', () => {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('hidden');
        }
    });
}

// Show/hide login button based on auth state
// Được handle trong auth.js updateAuthUIButtons()

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { logout } = await import('./auth.js');
        await logout();
        cleanupChat();
    });
}

