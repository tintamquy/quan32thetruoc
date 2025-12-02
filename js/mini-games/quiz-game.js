// ============================================
// QUIZ GAME - Hiểu Biết Chính Pháp
// Game quiz về tác hại thủ dâm và lợi ích thanh tịnh
// ============================================

import { addPoints, showEncouragementMessage } from '../gamification.js';

let currentQuestion = 0;
let score = 0;
let gameStarted = false;

const QUIZ_QUESTIONS = [
    {
        question: 'Thủ dâm có ảnh hưởng gì đến não bộ?',
        options: [
            'Làm suy giảm dopamine receptors',
            'Tăng cường trí nhớ',
            'Không có ảnh hưởng gì',
            'Cải thiện khả năng tập trung'
        ],
        correct: 0,
        explanation: 'Thủ dâm làm suy giảm dopamine receptors, dẫn đến cần kích thích mạnh hơn để cảm thấy hài lòng.'
    },
    {
        question: 'Lợi ích của việc thanh tịnh dục vọng là gì?',
        options: [
            'Tăng năng lượng sống',
            'Cải thiện sự tập trung',
            'Tăng tự tin',
            'Tất cả các đáp án trên'
        ],
        correct: 3,
        explanation: 'Thanh tịnh dục vọng mang lại nhiều lợi ích: tăng năng lượng, cải thiện tập trung, và tăng tự tin.'
    },
    {
        question: 'Thiền định giúp gì trong việc cai nghiện?',
        options: [
            'Tăng cường ý chí',
            'Giảm căng thẳng',
            'Cải thiện nhận thức',
            'Tất cả các đáp án trên'
        ],
        correct: 3,
        explanation: 'Thiền định giúp tăng cường ý chí, giảm căng thẳng, và cải thiện nhận thức về bản thân.'
    },
    {
        question: 'Quán tưởng 32 thể trược có mục đích gì?',
        options: [
            'Nhận thức sự bất tịnh của cơ thể',
            'Giảm ham muốn dục vọng',
            'Tăng sự tỉnh giác',
            'Tất cả các đáp án trên'
        ],
        correct: 3,
        explanation: 'Quán tưởng 32 thể trược giúp nhận thức sự bất tịnh, giảm ham muốn, và tăng tỉnh giác.'
    },
    {
        question: 'Streak (chuỗi ngày) quan trọng vì sao?',
        options: [
            'Tạo động lực duy trì',
            'Xây dựng thói quen tốt',
            'Tăng tự tin',
            'Tất cả các đáp án trên'
        ],
        correct: 3,
        explanation: 'Streak giúp tạo động lực, xây dựng thói quen, và tăng tự tin vào khả năng của mình.'
    }
];

// Khởi tạo game
export function initQuizGame() {
    const gameContent = document.getElementById('game-content');
    if (!gameContent) return;
    
    gameContent.innerHTML = `
        <div class="game-container">
            <h2 class="game-title">📚 Quiz - Hiểu Biết Chính Pháp</h2>
            <div class="game-stats">
                <div class="game-stat">
                    <div class="game-stat-label">Câu hỏi</div>
                    <div class="game-stat-value" id="quiz-question-number">1/5</div>
                </div>
                <div class="game-stat">
                    <div class="game-stat-label">Điểm</div>
                    <div class="game-stat-value" id="quiz-score">0</div>
                </div>
            </div>
            <div class="game-area">
                <div id="quiz-question" class="quiz-question"></div>
                <div id="quiz-options" class="quiz-options"></div>
                <div id="quiz-explanation" class="quiz-explanation hidden"></div>
            </div>
            <div class="game-controls">
                <button id="start-quiz-btn" class="game-btn-action">Bắt Đầu</button>
                <button id="next-question-btn" class="game-btn-action hidden" disabled>Câu Tiếp</button>
                <button id="finish-quiz-btn" class="game-btn-action hidden" disabled>Hoàn Thành</button>
            </div>
        </div>
    `;
    
    // Event listeners
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
    document.getElementById('next-question-btn').addEventListener('click', nextQuestion);
    document.getElementById('finish-quiz-btn').addEventListener('click', finishQuiz);
    
    resetQuiz();
}

// Reset quiz
function resetQuiz() {
    currentQuestion = 0;
    score = 0;
    gameStarted = false;
    
    document.getElementById('quiz-question-number').textContent = '1/5';
    document.getElementById('quiz-score').textContent = '0';
    document.getElementById('quiz-explanation').classList.add('hidden');
    document.getElementById('next-question-btn').classList.add('hidden');
    document.getElementById('finish-quiz-btn').classList.add('hidden');
}

// Bắt đầu quiz
function startQuiz() {
    gameStarted = true;
    currentQuestion = 0;
    score = 0;
    
    document.getElementById('start-quiz-btn').disabled = true;
    loadQuestion(currentQuestion);
}

// Load question
function loadQuestion(index) {
    if (index >= QUIZ_QUESTIONS.length) {
        finishQuiz();
        return;
    }
    
    const question = QUIZ_QUESTIONS[index];
    const questionElement = document.getElementById('quiz-question');
    const optionsElement = document.getElementById('quiz-options');
    const explanationElement = document.getElementById('quiz-explanation');
    
    // Cập nhật UI
    document.getElementById('quiz-question-number').textContent = `${index + 1}/${QUIZ_QUESTIONS.length}`;
    
    // Hiển thị question
    questionElement.innerHTML = `<h3>${question.question}</h3>`;
    
    // Hiển thị options
    optionsElement.innerHTML = '';
    question.options.forEach((option, optionIndex) => {
        const optionButton = document.createElement('button');
        optionButton.className = 'quiz-option';
        optionButton.textContent = option;
        optionButton.dataset.index = optionIndex;
        optionButton.addEventListener('click', () => selectAnswer(optionIndex, question));
        optionsElement.appendChild(optionButton);
    });
    
    // Ẩn explanation
    explanationElement.classList.add('hidden');
    document.getElementById('next-question-btn').classList.add('hidden');
    document.getElementById('finish-quiz-btn').classList.add('hidden');
}

// Chọn đáp án
function selectAnswer(selectedIndex, question) {
    if (!gameStarted) return;
    
    const options = document.querySelectorAll('.quiz-option');
    const explanationElement = document.getElementById('quiz-explanation');
    const nextButton = document.getElementById('next-question-btn');
    const finishButton = document.getElementById('finish-quiz-btn');
    
    // Disable all options
    options.forEach(option => {
        option.disabled = true;
    });
    
    // Highlight correct/incorrect
    options.forEach((option, index) => {
        if (index === question.correct) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            option.classList.add('incorrect');
        }
    });
    
    // Hiển thị explanation
    explanationElement.innerHTML = `<p><strong>Giải thích:</strong> ${question.explanation}</p>`;
    explanationElement.classList.remove('hidden');
    
    // Tính điểm
    if (selectedIndex === question.correct) {
        score += 20;
        document.getElementById('quiz-score').textContent = score;
        showEncouragementMessage('Chính xác! Bạn hiểu rất tốt!');
    } else {
        showEncouragementMessage('Không sao, hãy đọc giải thích và tiếp tục!');
    }
    
    // Hiển thị nút tiếp theo
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        nextButton.classList.remove('hidden');
        nextButton.disabled = false;
    } else {
        finishButton.classList.remove('hidden');
        finishButton.disabled = false;
    }
}

// Câu tiếp theo
function nextQuestion() {
    currentQuestion++;
    loadQuestion(currentQuestion);
}

// Hoàn thành quiz
function finishQuiz() {
    gameStarted = false;
    
    // Thêm points
    addPoints(score, 'quiz');
    
    // Hiển thị kết quả
    const percentage = (score / (QUIZ_QUESTIONS.length * 20)) * 100;
    let message = `Bạn đã hoàn thành quiz với ${score} điểm (${percentage.toFixed(0)}%)!`;
    
    if (percentage === 100) {
        message += ' Hoàn hảo! Bạn hiểu rất rõ về chính pháp!';
    } else if (percentage >= 80) {
        message += ' Tuyệt vời! Bạn có kiến thức tốt!';
    } else {
        message += ' Tiếp tục học hỏi để hiểu sâu hơn!';
    }
    
    showEncouragementMessage(message);
    
    document.getElementById('start-quiz-btn').disabled = false;
    document.getElementById('start-quiz-btn').textContent = 'Chơi Lại';
    
    resetQuiz();
}

// CSS cho quiz game
const quizGameStyles = `
.quiz-question {
    margin: 30px 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
    text-align: center;
}

.quiz-question h3 {
    color: var(--gold-color);
    font-size: 24px;
    line-height: 1.6;
}

.quiz-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin: 30px 0;
}

.quiz-option {
    padding: 15px 20px;
    background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
    border: 2px solid var(--gold-color);
    border-radius: 10px;
    color: var(--text-light);
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.quiz-option:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
    transform: translateX(10px);
}

.quiz-option:disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.quiz-option.correct {
    background: linear-gradient(135deg, #4caf50, #45a049);
    border-color: #4caf50;
}

.quiz-option.incorrect {
    background: linear-gradient(135deg, #f44336, #d32f2f);
    border-color: #f44336;
}

.quiz-explanation {
    margin: 20px 0;
    padding: 20px;
    background: rgba(255, 215, 0, 0.1);
    border-radius: 10px;
    border: 2px solid var(--gold-color);
}

.quiz-explanation p {
    color: var(--text-light);
    line-height: 1.6;
}
`;

// Inject styles
if (!document.getElementById('quiz-game-styles')) {
    const style = document.createElement('style');
    style.id = 'quiz-game-styles';
    style.textContent = quizGameStyles;
    document.head.appendChild(style);
}

// Export đã có ở đầu file với export function

