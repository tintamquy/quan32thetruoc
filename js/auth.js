// ============================================
// AUTHENTICATION SYSTEM
// Xử lý đăng ký, đăng nhập, đăng xuất và quản lý session
// ============================================

import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    doc, 
    setDoc, 
    getDoc, 
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { auth, db, googleProvider } from './firebase-config.js';

// Lưu user hiện tại
let currentUser = null;

// Khởi tạo auth state listener
export function initAuth() {
    // Cho phép chơi ngay không cần đăng nhập
    showGameContainer();
    loadGuestData();
    
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser = user;
            // Sync guest data lên Firebase nếu có
            const { syncGuestDataToFirebase } = await import('./local-storage-manager.js');
            await syncGuestDataToFirebase(user.uid);
            
            await loadUserData(user.uid);
            hideAuthModal();
            // Kiểm tra check-in hôm nay
            checkDailyCheckIn(user.uid);
            
            // Update UI buttons
            updateAuthUIButtons(true);
        } else {
            currentUser = null;
            // Vẫn cho phép chơi, chỉ ẩn auth modal
            await loadGuestData();
            
            // Update UI buttons
            updateAuthUIButtons(false);
        }
    });
}

// Update auth UI buttons
function updateAuthUIButtons(isLoggedIn) {
    const loginBtn = document.getElementById('login-prompt-btn');
    const profileBtn = document.getElementById('profile-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (isLoggedIn) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (profileBtn) profileBtn.classList.remove('hidden');
        if (logoutBtn) logoutBtn.classList.remove('hidden');
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (profileBtn) profileBtn.classList.add('hidden');
        if (logoutBtn) logoutBtn.classList.add('hidden');
    }
    
    window.dispatchEvent(new CustomEvent('auth-state-changed', {
        detail: { isLoggedIn }
    }));
}

// Load guest data
async function loadGuestData() {
    const { getGuestData } = await import('./local-storage-manager.js');
    const guestData = getGuestData();
    updateUIWithUserData(guestData);
}

// Đăng nhập với email/password
export async function loginWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// Đăng ký với email/password
export async function signupWithEmail(name, email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Tạo user document trong Firestore
        await setDoc(doc(db, 'users', user.uid), {
            displayName: name,
            email: email,
            createdAt: serverTimestamp(),
            streakDays: 0,
            longestStreak: 0,
            totalPoints: 0,
            level: 1,
            achievements: [],
            badges: [],
            lastCheckIn: null
        });
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// Đăng nhập với Google
export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Kiểm tra xem user đã có trong Firestore chưa
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            // Tạo user mới nếu chưa có
            await setDoc(doc(db, 'users', user.uid), {
                displayName: user.displayName || 'Người dùng',
                email: user.email,
                createdAt: serverTimestamp(),
                streakDays: 0,
                longestStreak: 0,
                totalPoints: 0,
                level: 1,
                achievements: [],
                badges: [],
                lastCheckIn: null
            });
        }
        
        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: getErrorMessage(error.code) };
    }
}

// Đăng xuất
export async function logout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Load user data từ Firestore
export async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            window.userData = userData;
            updateUIWithUserData(userData);
            return userData;
        }
    } catch (error) {
        console.error('Lỗi load user data:', error);
    }
    return null;
}

// Cập nhật UI với user data
function updateUIWithUserData(userData) {
    // Cập nhật streak
    const streakElement = document.getElementById('streak-days');
    if (streakElement) {
        streakElement.textContent = userData.streakDays || 0;
        animateNumber(streakElement);
    }
    
    // Cập nhật points
    const pointsElement = document.getElementById('total-points');
    if (pointsElement) {
        pointsElement.textContent = userData.totalPoints || 0;
    }
    
    // Cập nhật level
    const levelElement = document.getElementById('user-level');
    if (levelElement) {
        levelElement.textContent = userData.level || 1;
    }
}

// Kiểm tra daily check-in
async function checkDailyCheckIn(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastCheckIn = userData.lastCheckIn?.toDate();
            const now = new Date();
            
            // Kiểm tra xem đã check-in hôm nay chưa
            if (!lastCheckIn || !isSameDay(lastCheckIn, now)) {
                // Kiểm tra streak có bị gián đoạn không
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastCheckIn && !isSameDay(lastCheckIn, yesterday)) {
                    // Streak bị gián đoạn
                    await resetStreak(userId);
                }
                
                // Hiển thị check-in modal
                showCheckInModal();
            }
        }
    } catch (error) {
        console.error('Lỗi kiểm tra check-in:', error);
    }
}

// Kiểm tra xem 2 ngày có cùng ngày không
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Reset streak
async function resetStreak(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            await setDoc(doc(db, 'users', userId), {
                ...userData,
                streakDays: 0
            }, { merge: true });
        }
    } catch (error) {
        console.error('Lỗi reset streak:', error);
    }
}

// Hiển thị check-in modal
function showCheckInModal() {
    const modal = document.getElementById('checkin-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Tạo lời khen ngợi ngẫu nhiên
        const encouragements = [
            "Tuyệt vời! Bạn đang kiểm soát cuộc đời mình!",
            "Hôm nay là ngày mới! Bạn là chiến binh thật sự!",
            "Nội tâm bạn đang trở nên mạnh mẽ hơn mỗi ngày!",
            "Bạn đang trên con đường đúng đắn! Tiếp tục phấn đấu!",
            "Mỗi ngày là một chiến thắng mới! Bạn làm rất tốt!",
            "Sức mạnh nội tâm của bạn đang lớn dần!",
            "Bạn đang lấy lại quyền kiểm soát cuộc đời mình!",
            "Kiên trì là chìa khóa! Bạn đang làm rất tốt!",
            "Hôm nay bạn lại chiến thắng! Tuyệt vời!",
            "Bạn là nguồn cảm hứng cho chính mình!"
        ];
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        const messageElement = document.getElementById('checkin-message');
        if (messageElement) {
            messageElement.textContent = randomEncouragement;
        }
        
        // Cập nhật streak hiển thị
        const streakElement = document.getElementById('checkin-streak');
        if (streakElement && window.userData) {
            streakElement.textContent = window.userData.streakDays || 0;
        }
    }
}

// Animate number
function animateNumber(element) {
    element.style.animation = 'none';
    setTimeout(() => {
        element.style.animation = 'number-pulse 0.5s ease-out';
    }, 10);
}

// Hiển thị auth modal
function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

// Ẩn auth modal
function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Hiển thị game container
function showGameContainer() {
    const container = document.getElementById('game-container');
    if (container) {
        container.classList.remove('hidden');
    }
}

// Ẩn game container
function hideGameContainer() {
    const container = document.getElementById('game-container');
    if (container) {
        container.classList.add('hidden');
    }
}

// Lấy error message từ error code
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'Email không tồn tại',
        'auth/wrong-password': 'Mật khẩu không đúng',
        'auth/email-already-in-use': 'Email đã được sử dụng',
        'auth/weak-password': 'Mật khẩu quá yếu (tối thiểu 6 ký tự)',
        'auth/invalid-email': 'Email không hợp lệ',
        'auth/too-many-requests': 'Quá nhiều lần thử. Vui lòng thử lại sau',
        'auth/network-request-failed': 'Lỗi kết nối. Vui lòng kiểm tra internet'
    };
    return errorMessages[errorCode] || 'Đã xảy ra lỗi. Vui lòng thử lại';
}

// Export current user
export function getCurrentUser() {
    return currentUser;
}

// Export để sử dụng ở file khác
export { showCheckInModal, hideAuthModal };

