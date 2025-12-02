// ============================================
// AI COUNSELOR - Tư Vấn Khẩn Cấp
// Kết nối với Cloudflare Worker proxy để gọi Gemini API
// ============================================

import { getCurrentUser } from './auth.js';
import { doc, setDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { db } from './firebase-config.js';

// URL của Cloudflare Worker
const WORKER_URL = 'https://gemini-proxy.phatda.workers.dev';

const COUNSELING_PLAYBOOKS = [
    {
        id: 'breath-anchor',
        title: 'Thở 4-7-8 & chạm đất',
        description: 'Tập trung vào hơi thở, chạm tay lên tim để ổn định.',
        response: `Con hãy đặt tay lên tim và bụng. Hít vào 4 nhịp, giữ 7 nhịp, thở ra 8 nhịp. Khi thở ra hãy thầm nói “Con đang trở về nhà”. Sau ba vòng thở, con nhìn quanh và gọi tên 5 điều đang bảo hộ mình. Cơn sóng dục sẽ tự tan như mây.`,
        prefill: 'Con đang thực tập thở 4-7-8 như Thầy chỉ.'
    },
    {
        id: 'thirtytwo-reminder',
        title: 'Quán 32 thể trược',
        description: 'Nhắc lại tiến trình quán thân bất tịnh.',
        response: `Con hãy mở Thiền 32 Thể Trược. Bắt đầu từ mái tóc, da đầu, rồi đến máu, mật, gan… Nhìn thân này như một dòng chảy hợp tan. Khi thấy rõ thân bất tịnh thì ái dục tự lắng xuống. Thầy đang đi cùng con từng phần một.`,
        prefill: 'Con sẽ quán 32 thể trược để buông dứt ái dục.'
    },
    {
        id: 'urge-surfing',
        title: 'Nương sóng dục',
        description: '3 bước Urge Surfing để không bị cuốn đi.',
        response: `1) Nhận diện: “Xin chào dục vọng, Thầy thấy con”. 2) Thở và theo dõi cảm giác trong thân như người quan sát sóng biển. 3) Đặt câu hỏi: “Nếu con chiều theo dục vọng này, con sẽ đánh mất điều gì?”. Trả lời bằng lòng từ bi dành cho chính mình.`,
        prefill: 'Con đang thực tập Urge Surfing, xin Thầy nhắc con.'
    }
];

let conversationHistory = [];
let aiCooldownUntil = 0;
let aiSendBtnRef = null;
let aiInputRef = null;
let isSendingAI = false;
let isGuestScriptMode = false;

// Khởi tạo AI counselor
export function initAICounselor() {
    const emergencyBtn = document.getElementById('emergency-help-btn');
    const aiModal = document.getElementById('ai-counselor-modal');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiInput = document.getElementById('ai-input');
    aiSendBtnRef = aiSendBtn;
    aiInputRef = aiInput;
    const closeModal = aiModal?.querySelector('.close-modal');
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (!user) {
                showAICounselor({ guestMode: true });
                showLoginPromptForAICounselor();
            } else {
                showAICounselor({ guestMode: false });
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
    
    renderPlaybookButtons();
    
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
    
    attachPlaybookHandlers();
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
function showAICounselor(options = {}) {
    const modal = document.getElementById('ai-counselor-modal');
    if (modal) {
        modal.classList.remove('hidden');
        isGuestScriptMode = !!options.guestMode;
        setAIGuestMode(isGuestScriptMode);
        
        // Update title
        const title = modal.querySelector('h2');
        if (title) {
            title.textContent = '🧘 Thầy Thích Nhất Hạnh - Tư Vấn Khẩn Cấp';
        }
        
        // Reset conversation
        conversationHistory = [];
        const chatContainer = document.getElementById('ai-chat-container');
        if (chatContainer) {
            chatContainer.innerHTML = '';
        }
        
        // Add initial message
        if (isGuestScriptMode) {
            addAIMessage('Con có thể bấm vào một kịch bản bên dưới để nhận hướng dẫn tức thì. Khi con sẵn sàng đăng nhập, Thầy sẽ lắng nghe trực tiếp.', 'ai');
        } else {
            addAIMessage('Xin chào con! Thầy Thích Nhất Hạnh đang ở đây. Hãy chia sẻ với Thầy con đang cảm thấy thế nào?', 'ai');
        }
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
    if (isSendingAI) return;
    
    const input = aiInputRef || document.getElementById('ai-input');
    const message = input?.value.trim();
    
    if (!message) return;
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        addAIMessage('Đăng nhập để Thầy có thể hồi đáp trực tiếp. Trong lúc chờ, hãy chọn kịch bản thực tập nhanh.', 'ai');
        return;
    }
    
    const now = Date.now();
    if (now < aiCooldownUntil) {
        const waitSeconds = Math.ceil((aiCooldownUntil - now) / 1000);
        addAIMessage(`Thầy đang tiếp thêm năng lượng. Hãy thở sâu và thử lại sau ${waitSeconds}s.`, 'ai');
        return;
    }
    
    isSendingAI = true;
    if (aiSendBtnRef) aiSendBtnRef.disabled = true;
    
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
        if (error?.code === 429 || error?.message === 'RATE_LIMIT') {
            const waitSeconds = Math.ceil((aiCooldownUntil - Date.now()) / 1000);
            addAIMessage(`Thầy đang nhận rất nhiều lời cầu cứu. Con hãy đặt tay lên ngực, hít sâu và thử lại sau ${waitSeconds}s.`, 'ai');
        } else {
            addAIMessage('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau hoặc thử một mini-game để phân tâm.', 'ai');
        }
        
        if (!isGuestScriptMode) {
            addAIMessage('Trong lúc đợi kết nối, con hãy thực tập theo hướng dẫn này nhé:', 'ai');
            playCounselingScript('breath-anchor', { trigger: 'fallback' });
        }
    } finally {
        if (aiSendBtnRef) aiSendBtnRef.disabled = false;
        isSendingAI = false;
    }
}

// Gọi Gemini API qua Cloudflare Worker
async function callGeminiAPI(userMessage, attempt = 1, appendHistory = true) {
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
    if (appendHistory) {
        conversationHistory.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });
    }
    
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
            if (response.status === 429) {
                if (attempt < 2) {
                    await waitFor(2000);
                    return callGeminiAPI(userMessage, attempt + 1, false);
                }
                aiCooldownUntil = Date.now() + 15000;
                const error = new Error('RATE_LIMIT');
                error.code = 429;
                throw error;
            }
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

function renderPlaybookButtons() {
    const container = document.getElementById('ai-playbook-buttons');
    if (!container) return;
    
    container.innerHTML = COUNSELING_PLAYBOOKS.map(script => `
        <button class="playbook-button" data-script-id="${script.id}">
            <h5>${script.title}</h5>
            <p>${script.description}</p>
        </button>
    `).join('');
}

function attachPlaybookHandlers() {
    const buttons = document.querySelectorAll('[data-script-id]');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            playCounselingScript(btn.dataset.scriptId);
        });
    });
}

function playCounselingScript(scriptId, options = {}) {
    const script = COUNSELING_PLAYBOOKS.find(item => item.id === scriptId);
    if (!script) return;
    
    addAIMessage(script.response, 'ai');
    conversationHistory.push({
        role: 'model',
        parts: [{ text: script.response }]
    });
    
    if (script.prefill && aiInputRef && !isGuestScriptMode) {
        aiInputRef.value = script.prefill;
        aiInputRef.focus();
    }
    
    if (!options.skipLog) {
        logAIConversation(`Playbook:${script.title}`, script.response);
    }
}

function setAIGuestMode(isGuest) {
    if (aiInputRef) {
        aiInputRef.disabled = isGuest;
        aiInputRef.placeholder = isGuest ? 'Đăng nhập để gửi câu hỏi riêng...' : 'Viết tin nhắn của bạn...';
    }
    
    if (aiSendBtnRef) {
        aiSendBtnRef.disabled = isGuest;
    }
    
    const guestNote = document.getElementById('ai-guest-note');
    if (guestNote) {
        guestNote.classList.toggle('hidden', !isGuest);
    }
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

if (typeof window !== 'undefined') {
    window.showAICounselor = (options) => showAICounselor(options);
    window.hideAICounselor = () => hideAICounselor();
}

function waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

