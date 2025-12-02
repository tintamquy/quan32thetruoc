// ============================================
// FEEDBACK FORM - Web3Forms integration
// Nhận góp ý tàm quý và thư tri ân
// ============================================

import { showEncouragementMessage } from './gamification.js';

const WEB3FORM_ENDPOINT = 'https://api.web3forms.com/submit';
const ACCESS_KEY = '3836678f-b484-42ee-9517-55b7132445ae';

export function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;
    
    const statusEl = document.getElementById('feedback-status');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        if (statusEl) {
            statusEl.textContent = 'Đang gửi thư...';
            statusEl.classList.remove('success', 'error');
        }
        
        const formData = new FormData(form);
        formData.set('access_key', ACCESS_KEY);
        formData.append('from_name', formData.get('name') || 'Ẩn danh');
        formData.append('subject', `PureMind Feedback - ${formData.get('topic') || 'general'}`);
        
        try {
            const response = await fetch(WEB3FORM_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            });
            
            const result = await response.json();
            if (result.success) {
                form.reset();
                if (statusEl) {
                    statusEl.textContent = 'Đã nhận được thư của bạn 🌸';
                    statusEl.classList.add('success');
                }
                showEncouragementMessage('Tri ân con đã góp ý với tâm tàm quý!', { celebrate: true });
            } else {
                throw new Error(result.message || 'Gửi thất bại');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            if (statusEl) {
                statusEl.textContent = 'Gửi thất bại, vui lòng thử lại.';
                statusEl.classList.add('error');
            }
        }
    });
}

