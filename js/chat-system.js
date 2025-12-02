// ============================================
// CHAT SYSTEM - Cộng Đồng Hỗ Trợ
// Real-time chat với Firestore
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
    increment,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';
import { getCurrentUser } from './auth.js';
import { addPoints } from './gamification.js';

let chatUnsubscribe = null;

// Khởi tạo chat system
export function initChatSystem() {
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatPanel = document.getElementById('chat-panel');
    
    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            toggleChat();
        });
    }
    
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => {
            hideChat();
        });
    }
    
    if (chatSendBtn && chatInput) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Load messages
    loadMessages();
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
    
    // Unsubscribe previous listener
    if (chatUnsubscribe) {
        chatUnsubscribe();
    }
    
    chatUnsubscribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() });
        });
        
        // Reverse để hiển thị từ cũ đến mới
        messages.reverse();
        displayMessages(messages);
    }, (error) => {
        console.error('Lỗi load messages:', error);
    });
}

// Hiển thị messages
function displayMessages(messages) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Tạo message element
function createMessageElement(message) {
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
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-username">${escapeHtml(message.userName || 'Người dùng')}</span>
            ${message.streakDays ? `<span class="message-streak">🔥 ${message.streakDays}</span>` : ''}
            ${badgesHTML ? `<div class="message-badges">${badgesHTML}</div>` : ''}
        </div>
        <div class="message-text">${escapeHtml(message.message)}</div>
        <div class="message-footer">
            <span>${timeString}</span>
            <div class="message-likes ${message.likedBy && message.likedBy.includes(user?.uid) ? 'liked' : ''}" 
                 data-message-id="${message.id}" 
                 data-likes="${message.likes || 0}">
                ❤️ ${message.likes || 0}
            </div>
        </div>
    `;
    
    // Like button
    const likeButton = messageDiv.querySelector('.message-likes');
    if (likeButton && !isOwnMessage) {
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
    
    const input = document.getElementById('chat-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    // Filter từ ngữ tiêu cực
    if (containsNegativeWords(message)) {
        alert('Tin nhắn chứa từ ngữ không phù hợp. Vui lòng sửa lại.');
        return;
    }
    
    try {
        // Load user data để lấy streak và badges
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
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
        input.value = '';
        
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

