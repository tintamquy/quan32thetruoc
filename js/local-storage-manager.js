// ============================================
// LOCAL STORAGE MANAGER
// Quản lý dữ liệu local cho người chơi chưa đăng nhập
// ============================================

const STORAGE_KEY = 'quan32thetruoc_guest_data';

// Lấy guest data
export function getGuestData() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : getDefaultGuestData();
    } catch (error) {
        console.error('Lỗi đọc localStorage:', error);
        return getDefaultGuestData();
    }
}

// Lưu guest data
export function saveGuestData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Lỗi lưu localStorage:', error);
    }
}

// Default guest data
function getDefaultGuestData() {
    return {
        displayName: 'Khách',
        streakDays: 0,
        longestStreak: 0,
        totalPoints: 0,
        level: 1,
        achievements: [],
        badges: [],
        lastCheckIn: null,
        isGuest: true
    };
}

// Cập nhật points
export function updateGuestPoints(points) {
    const data = getGuestData();
    data.totalPoints = (data.totalPoints || 0) + points;
    data.level = Math.floor(data.totalPoints / 1000) + 1;
    saveGuestData(data);
    return data;
}

// Cập nhật streak
export function updateGuestStreak() {
    const data = getGuestData();
    const now = new Date();
    const lastCheckIn = data.lastCheckIn ? new Date(data.lastCheckIn) : null;
    
    // Kiểm tra xem đã check-in hôm nay chưa
    if (lastCheckIn && isSameDay(lastCheckIn, now)) {
        return data; // Đã check-in rồi
    }
    
    // Kiểm tra streak có bị gián đoạn không
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastCheckIn && !isSameDay(lastCheckIn, yesterday)) {
        // Streak bị gián đoạn
        data.streakDays = 1;
    } else {
        // Tăng streak
        data.streakDays = (data.streakDays || 0) + 1;
    }
    
    data.longestStreak = Math.max(data.streakDays, data.longestStreak || 0);
    data.lastCheckIn = now.toISOString();
    data.totalPoints = (data.totalPoints || 0) + 100; // +100 điểm check-in
    data.level = Math.floor(data.totalPoints / 1000) + 1;
    
    saveGuestData(data);
    return data;
}

// Kiểm tra xem 2 ngày có cùng ngày không
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Thêm achievement
export function addGuestAchievement(achievementId) {
    const data = getGuestData();
    if (!data.achievements.includes(achievementId)) {
        data.achievements.push(achievementId);
        saveGuestData(data);
    }
    return data;
}

// Sync guest data lên Firebase khi đăng nhập
export async function syncGuestDataToFirebase(userId) {
    const guestData = getGuestData();
    if (!guestData.isGuest) return; // Đã sync rồi
    
    try {
        const { doc, getDoc, setDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        const { db } = await import('./firebase-config.js');
        
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const firebaseData = userDoc.data();
            // Merge data - lấy giá trị cao hơn
            const mergedData = {
                ...firebaseData,
                streakDays: Math.max(firebaseData.streakDays || 0, guestData.streakDays || 0),
                longestStreak: Math.max(firebaseData.longestStreak || 0, guestData.longestStreak || 0),
                totalPoints: Math.max(firebaseData.totalPoints || 0, guestData.totalPoints || 0),
                level: Math.max(firebaseData.level || 1, guestData.level || 1),
                achievements: [...new Set([...(firebaseData.achievements || []), ...(guestData.achievements || [])])],
                badges: [...new Set([...(firebaseData.badges || []), ...(guestData.badges || [])])]
            };
            
            await setDoc(userRef, mergedData, { merge: true });
        } else {
            // Tạo mới với guest data
            await setDoc(userRef, {
                ...guestData,
                userId: userId,
                createdAt: serverTimestamp(),
                isGuest: false
            });
        }
        
        // Clear guest data sau khi sync
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Lỗi sync guest data:', error);
    }
}

// Export
export { getDefaultGuestData };

