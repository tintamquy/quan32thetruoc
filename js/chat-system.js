// ============================================
// CHAT SYSTEM - Cộng Đồng Hỗ Trợ
// Real-time chat với Firestore + feed cho khách
// ============================================

import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    limit, 
    onSnapshot,
    updateDoc,
    doc,
    getDoc,
    increment,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import { addPoints } from './gamification.js';

const GUEST_CHAT_FEED = [
    {
        userName: 'Thiền hữu Ẩn Danh',
        message: 'Mình vừa thở 4-7-8 xong và cơn dục dịu hẳn. Cả nhà cứ kiên trì nhé!',
        minutesAgo: 3,
        streakDays: 14,
        badges: ['👣', '⚔️']
    },
    {
        userName: 'Huynh Tâm Hành',
        message: 'Nhìn thẳng 32 thể trược giúp mình nhớ thân này vô thường. Chúc mọi người vững chãi.',
        minutesAgo: 12,
        streakDays: 45,
        badges: ['💎']
    },
    {
        userName: 'Ẩn sĩ Bắc Sơn',
        message: 'Nếu thấy loạn tâm, hãy bấm Grounding 5-4-3-2-1. Mình đã vượt qua một đêm khó bằng cách ấy.',
        minutesAgo: 25,
        streakDays: 7,
        badges: []
    }
];

let chatUnsubscribe = null;
let chatInputRef = null;
let chatSendBtnRef = null;
let chatGuestNoteRef = null;

// Khởi tạo chat system
export function initChatSystem() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    chatSendBtnRef = document.getElementById('chat-send-btn');
    chatInputRef = document.getElementById('chat-input');
    chatGuestNoteRef = document.getElementById('chat-guest-note');
    
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => toggleChat());
    }
    
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => hideChat());
    }
    
    if (chatSendBtnRef && chatInputRef) {
        chatSendBtnRef.addEventListener('click', sendMessage);
        chatInputRef.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    window.addEventListener('auth-state-changed', (event) => {
        handleChatAccess(event.detail.isLoggedIn);
    });
    
    handleChatAccess(!!getCurrentUser());
}

// Toggle chat
function toggleChat() {
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) {
        chatPanel.classList.toggle('hidden');
    }
}

// Ẩn chat
function hideChat() {
    const chatPanel = document.getElementById('chat-panel');
    if (chatPanel) {
        chatPanel.classList.add('hidden');
    }
}

// Load messages
function loadMessages() {
    const user = getCurrentUser();
    if (!user) return;
    
    const messagesRef = collection(db, 'chat');
    const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));
    
    if (chatUnsubscribe) {
        chatUnsubscribe();
    }
    
    chatUnsubscribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((docSnapshot) => {
            messages.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        
        messages.reverse();
        displayMessages(messages);
    }, (error) => {
        console.error('Lỗi load messages:', error);
    });
}

// Hiển thị messages
function displayMessages(messages, isGuestFeed = false) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message, isGuestFeed);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Tạo message element
function createMessageElement(message, isGuestFeed = false) {
    const user = getCurrentUser();
    const isOwnMessage = user && message.userId === user.uid;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message';
    if (isOwnMessage) {
        messageDiv.style.borderLeftColor = 'var(--voxel-blue)';
    }
    
    const timestamp = message.timestamp?.toDate();
    const timeString = timestamp ? formatTime(timestamp) : 'Vừa xong';
    
    // Badges (nếu có)
    let badgesHTML = '';
    if (message.badges && message.badges.length > 0) {
        badgesHTML = message.badges.map(badge => `<span class="badge-icon">${badge}</span>`).join('');
    }
    
    const likesTemplate = isGuestFeed ? '' : `
        <div class="message-likes ${message.likedBy && message.likedBy.includes(user?.uid) ? 'liked' : ''}" 
             data-message-id="${message.id}" 
             data-likes="${message.likes || 0}">
            ❤️ ${message.likes || 0}
        </div>`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(message.userName || 'Người dùng')}</span>
            ${message.streakDays ? `<span class="message-streak">🔥 ${message.streakDays}</span>` : ''}
            ${badgesHTML ? `<div class="message-badges">${badgesHTML}</div>` : ''}
        </div>
        <div class="message-text">${escapeHtml(message.message)}</div>
        <div class="message-footer">
            <span>${timeString}</span>
            ${likesTemplate}
        </div>
    `;
    
    // Like button
    const likeButton = messageDiv.querySelector('.message-likes');
    if (likeButton && !isOwnMessage && !isGuestFeed) {
        likeButton.addEventListener('click', () => {
            likeMessage(message.id, message.userId);
        });
    }
    
    return messageDiv;
}

// Gửi message
async function sendMessage() {
    const user = getCurrentUser();
    if (!user) {
        const message = 'Để tham gia cộng đồng hỗ trợ và khuyến khích mọi người, bạn cần đăng nhập. Bạn có muốn đăng nhập ngay không?';
        if (confirm(message)) {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.classList.remove('hidden');
            }
        }
        return;
    }
    
    const message = chatInputRef?.value.trim();
    
    if (!message) return;
    
    // Filter từ ngữ tiêu cực
    if (containsNegativeWords(message)) {
        alert('Tin nhắn chứa từ ngữ không phù hợp. Vui lòng sửa lại.');
        return;
    }
    
    try {
        // Load user data để lấy streak và badges
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        // Gửi message
        await addDoc(collection(db, 'chat'), {
            userId: user.uid,
            userName: userData?.displayName || user.displayName || 'Người dùng',
            message: message,
            timestamp: serverTimestamp(),
            likes: 0,
            likedBy: [],
            streakDays: userData?.streakDays || 0,
            badges: userData?.badges || []
        });
        
        // Clear input
        chatInputRef.value = '';
        
        // Thêm points cho việc chat khuyến khích
        addPoints(20, 'chat_encouragement');
    } catch (error) {
        console.error('Lỗi gửi message:', error);
        alert('Lỗi gửi tin nhắn. Vui lòng thử lại.');
    }
}

// Like message
async function likeMessage(messageId, messageUserId) {
    const user = getCurrentUser();
    if (!user) return;
    
    try {
        const messageRef = doc(db, 'chat', messageId);
        const messageDoc = await getDoc(messageRef);
        
        if (!messageDoc.exists()) return;
        
        const messageData = messageDoc.data();
        const likedBy = messageData.likedBy || [];
        
        if (likedBy.includes(user.uid)) {
            // Unlike
            await updateDoc(messageRef, {
                likes: increment(-1),
                likedBy: likedBy.filter(id => id !== user.uid)
            });
        } else {
            // Like
            await updateDoc(messageRef, {
                likes: increment(1),
                likedBy: [...likedBy, user.uid]
            });
            
            // Thêm points cho người gửi message
            if (messageUserId !== user.uid) {
                const { doc: userDocRef, updateDoc: updateUserDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                const userRef = userDocRef(db, 'users', messageUserId);
                await updateUserDoc(userRef, {
                    totalPoints: increment(5)
                });
            }
        }
    } catch (error) {
        console.error('Lỗi like message:', error);
    }
}

// Format time
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Kiểm tra từ ngữ tiêu cực
function containsNegativeWords(text) {
    const negativeWords = [
        // Thêm các từ ngữ cần filter
        'từ chối', 'bỏ cuộc', 'thất bại'
    ];
    
    const lowerText = text.toLowerCase();
    return negativeWords.some(word => lowerText.includes(word));
}

// Cleanup khi logout
export function cleanupChat() {
    if (chatUnsubscribe) {
        chatUnsubscribe();
        chatUnsubscribe = null;
    }
}

function handleChatAccess(isLoggedIn) {
    if (isLoggedIn) {
        setChatInputState(true);
        loadMessages();
    } else {
        setChatInputState(false);
        cleanupChat();
        displayGuestFeed();
    }
}

function setChatInputState(enabled) {
    if (chatInputRef) {
        chatInputRef.disabled = !enabled;
        chatInputRef.placeholder = enabled ? 'Nhắn tin khuyến khích mọi người...' : 'Đăng nhập để gửi lời nhắn của bạn...';
    }
    
    if (chatSendBtnRef) {
        chatSendBtnRef.disabled = !enabled;
    }
    
    if (chatGuestNoteRef) {
        chatGuestNoteRef.classList.toggle('hidden', enabled);
    }
}

function displayGuestFeed() {
    const mapped = GUEST_CHAT_FEED.map((item, index) => ({
        ...item,
        id: `guest_${index}`,
        isGuest: true,
        timestamp: {
            toDate: () => new Date(Date.now() - (item.minutesAgo || 5) * 60000)
        }
    }));
    
    displayMessages(mapped, true);
}

