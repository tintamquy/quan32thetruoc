// ============================================
// AI COUNSELOR - Tư Vấn Khẩn Cấp
// Kết nối với Cloudflare Worker proxy để gọi Gemini API
// ============================================

import { getCurrentUser } from './auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

// URL của Cloudflare Worker
const WORKER_URL = 'https://gemini-proxy.phatda.workers.dev';

let conversationHistory = [];

// Khởi tạo AI counselor
export function initAICounselor() {
    const emergencyBtn = document.getElementById('emergency-help-btn');
    const aiModal = document.getElementById('ai-counselor-modal');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    const closeModal = aiModal?.querySelector('.close-modal');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) {
                // Chưa đăng nhập - yêu cầu đăng nhập để chat với thầy
                showLoginPromptForAICounselor();
            } else {
                showAICounselor();
            }
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            hideAICounselor();
        });
    }
    
    if (aiSendBtn && aiInput) {
        aiSendBtn.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendAIMessage();
            }
        });
    }
    
    // Suggestion buttons
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const gameName = e.target.dataset.game;
            if (gameName) {
                hideAICounselor();
                // Trigger game
                const event = new CustomEvent('gameSelected', {
                    detail: { gameName }
                });
                window.dispatchEvent(event);
            }
        });
    });
}

// Hiển thị prompt đăng nhập
function showLoginPromptForAICounselor() {
    const message = 'Để trò chuyện với Thầy Thích Nhất Hạnh, bạn cần đăng nhập để bảo vệ quyền riêng tư. Bạn có muốn đăng nhập ngay không?';
    if (confirm(message)) {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.classList.remove('hidden');
        }
    }
}

// Hiển thị AI counselor
function showAICounselor() {
    const modal = document.getElementById('ai-counselor-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Update title
        const title = modal.querySelector('h2');
        if (title) {
            title.textContent = '🧘 Thầy Thích Nhất Hạnh - Tư Vấn Khẩn Cấp';
        }
        
        // Reset conversation
        conversationHistory = [];
        
        // Add initial message
        addAIMessage('Xin chào con! Thầy Thích Nhất Hạnh ở đây để giúp con vượt qua cơn cuồng dục này. Hãy chia sẻ với thầy con đang cảm thấy thế nào?', 'ai');
    }
}

// Ẩn AI counselor
function hideAICounselor() {
    const modal = document.getElementById('ai-counselor-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Gửi message
async function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    // Clear input
    input.value = '';
    
    // Hiển thị user message
    addAIMessage(message, 'user');
    
    // Hiển thị loading
    const loadingId = addAIMessage('Đang suy nghĩ...', 'ai', true);
    
    try {
        // Gọi AI
        const response = await callGeminiAPI(message);
        
        // Remove loading message
        removeAIMessage(loadingId);
        
        // Hiển thị AI response
        if (response && response.text) {
            addAIMessage(response.text, 'ai');
            
            // Ghi log vào Firestore
            await logAIConversation(message, response.text);
        } else {
            addAIMessage('Xin lỗi, tôi gặp sự cố. Vui lòng thử lại sau.', 'ai');
        }
    } catch (error) {
        console.error('Lỗi gọi AI:', error);
        removeAIMessage(loadingId);
        addAIMessage('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau hoặc thử một mini-game để phân tâm.', 'ai');
    }
}

// Gọi Gemini API qua Cloudflare Worker
async function callGeminiAPI(userMessage) {
    const user = getCurrentUser();
    if (!user) {
        throw new Error('Chưa đăng nhập');
    }
    
    // Tạo prompt với context - Thầy Thích Nhất Hạnh
    const systemPrompt = `Bạn là Thầy Thích Nhất Hạnh - một thiền sư, nhà văn, nhà thơ, nhà khảo cứu, nhà hoạt động xã hội, và người vận động cho hòa bình người Việt Nam. Bạn nổi tiếng với triết lý sống chánh niệm và từ bi.

Người dùng đang trải qua cơn cuồng dục mạnh. Hãy trả lời như Thầy Thích Nhất Hạnh:
1. An ủi và động viên với tình thương và sự hiểu biết
2. Đưa ra 3-5 kỹ thuật chánh niệm để giảm dục vọng NGAY LẬP TỨC (như thở ý thức, quán chiếu, đi thiền hành)
3. Nhắc nhở về lý do tại sao họ bắt đầu hành trình thanh tịnh này
4. Khuyến khích họ thực hành thiền định hoặc chơi mini-game để chuyển hóa năng lượng
5. Giọng điệu ấm áp, từ bi, không phán xét, đầy hi vọng và trí tuệ như Thầy Thích Nhất Hạnh
6. Sử dụng ngôn ngữ đơn giản, dễ hiểu, có thể dùng thơ hoặc câu nói nổi tiếng của Thầy

Hãy trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin, với phong cách của Thầy Thích Nhất Hạnh.`;

    const fullPrompt = `${systemPrompt}\n\nNgười dùng: ${userMessage}`;
    
    // Thêm vào conversation history
    conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }]
    });
    
    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: fullPrompt,
                userId: user.uid
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse Gemini response
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const text = data.candidates[0].content.parts[0].text;
            
            // Thêm vào conversation history
            conversationHistory.push({
                role: 'model',
                parts: [{ text }]
            });
            
            return { text };
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Lỗi gọi Gemini API:', error);
        throw error;
    }
}

// Thêm message vào UI
function addAIMessage(text, sender, isLoading = false) {
    const container = document.getElementById('ai-chat-container');
    if (!container) return null;
    
    const messageDiv = document.createElement('div');
    const messageId = `ai-msg-${Date.now()}`;
    messageDiv.id = messageId;
    messageDiv.className = `ai-message ${sender}`;
    
    if (isLoading) {
        messageDiv.innerHTML = `<p>${text} <span class="loading-dots"></span></p>`;
    } else {
        messageDiv.innerHTML = `<p>${text}</p>`;
    }
    
    container.appendChild(messageDiv);
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
    
    // Typewriter effect cho AI messages
    if (sender === 'ai' && !isLoading) {
        typewriterEffect(messageDiv, text);
    }
    
    return messageId;
}

// Remove message
function removeAIMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
}

// Typewriter effect
function typewriterEffect(element, text) {
    const p = element.querySelector('p');
    if (!p) return;
    
    p.textContent = '';
    let index = 0;
    
    const type = () => {
        if (index < text.length) {
            p.textContent += text[index];
            index++;
            setTimeout(type, 20); // Tốc độ typing
        }
    };
    
    type();
}

// Ghi log conversation vào Firestore
async function logAIConversation(userMessage, aiResponse) {
    try {
        const user = getCurrentUser();
        if (!user) return;
        
        await setDoc(doc(db, 'ai_conversations', `${user.uid}_${Date.now()}`), {
            userId: user.uid,
            userMessage: userMessage,
            aiResponse: aiResponse,
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Lỗi ghi log conversation:', error);
    }
}

// Export
export { showAICounselor, hideAICounselor };

