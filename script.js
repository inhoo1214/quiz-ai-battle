// 퀴즈 문제 예시 (퀄리티 향상: 다양한 주제, 난이도, 해설 추가)
const quizData = [
    {
        question: "지구에서 가장 큰 동물은?",
        choices: ["코끼리", "파란고래", "기린", "상어"],
        answer: 1,
        explanation: "파란고래는 지구에서 가장 큰 동물입니다."
    },
    {
        question: "HTML의 약자는?",
        choices: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Multi Language"],
        answer: 1,
        explanation: "HTML은 Hyper Text Markup Language의 약자입니다."
    },
    {
        question: "대한민국의 수도는?",
        choices: ["서울", "부산", "인천", "대전"],
        answer: 0,
        explanation: "대한민국의 수도는 서울입니다."
    },
    {
        question: "3의 3제곱은?",
        choices: ["6", "9", "27", "81"],
        answer: 2,
        explanation: "3의 3제곱은 3x3x3=27입니다."
    },
    {
        question: "물의 화학식은?",
        choices: ["CO2", "H2O", "O2", "NaCl"],
        answer: 1,
        explanation: "물의 화학식은 H2O입니다."
    }
];

let current = 0;
let playerScore = 0;
let aiScore = 0;
let timer;
let timeLeft = 10;
let aiAnswered = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startGame() {
    current = 0;
    playerScore = 0;
    aiScore = 0;
    shuffle(quizData);
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('ai-score').textContent = aiScore;
    document.getElementById('restart-btn').style.display = 'none';
    showQuestion();
}

function showQuestion() {
    aiAnswered = false;
    timeLeft = 10;
    document.getElementById('result').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
    const q = quizData[current];
    document.getElementById('question-area').textContent = `Q${current+1}. ${q.question}`;
    const choicesArea = document.getElementById('choices-area');
    choicesArea.innerHTML = '';
    q.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.onclick = () => selectAnswer(idx);
        choicesArea.appendChild(btn);
    });
    document.getElementById('timer').textContent = `⏰ 남은 시간: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `⏰ 남은 시간: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            selectAnswer(-1); // 시간 초과
        }
    }, 1000);
    // AI 답변 (퀄리티 향상: 난이도별 AI 정답률, 랜덤 시간)
    setTimeout(aiSelect, aiResponseTime());
}

function aiResponseTime() {
    // AI가 답변하는 시간(1~8초 랜덤)
    return Math.floor(Math.random() * 7000) + 1000;
}

function aiSelect() {
    if (aiAnswered) return;
    aiAnswered = true;
    const q = quizData[current];
    // 난이도별 AI 정답률(쉬움: 90%, 보통: 70%, 어려움: 50%로 가정)
    let correctRate = 0.7;
    if (current < 2) correctRate = 0.9;
    else if (current > 3) correctRate = 0.5;
    const aiCorrect = Math.random() < correctRate;
    let aiChoice = aiCorrect ? q.answer : randomWrong(q.answer, q.choices.length);
    markAIAnswer(aiChoice);
}

function randomWrong(answerIdx, total) {
    let idx;
    do {
        idx = Math.floor(Math.random() * total);
    } while (idx === answerIdx);
    return idx;
}

function markAIAnswer(aiChoice) {
    const q = quizData[current];
    const choices = document.querySelectorAll('#choices-area button');
    choices[aiChoice].classList.add(aiChoice === q.answer ? 'correct' : 'wrong');
    if (aiChoice === q.answer) aiScore++;
    document.getElementById('ai-score').textContent = aiScore;
}

function selectAnswer(idx) {
    clearInterval(timer);
    const q = quizData[current];
    const choices = document.querySelectorAll('#choices-area button');
    choices.forEach((btn, i) => {
        btn.disabled = true;
        if (i === q.answer) btn.classList.add('correct');
        else if (i === idx) btn.classList.add('wrong');
    });
    if (idx === q.answer) {
        document.getElementById('result').textContent = '정답! 🎉';
        playerScore++;
        document.getElementById('player-score').textContent = playerScore;
    } else if (idx === -1) {
        document.getElementById('result').textContent = '시간 초과!';
    } else {
        document.getElementById('result').textContent = '오답!';
    }
    // AI가 아직 답을 안 했으면 강제로 답변
    if (!aiAnswered) aiSelect();
    // 해설 표시
    setTimeout(() => {
        document.getElementById('result').textContent += `\n해설: ${q.explanation}`;
        document.getElementById('next-btn').style.display = 'block';
    }, 800);
}

document.getElementById('next-btn').onclick = () => {
    current++;
    if (current < quizData.length) {
        showQuestion();
    } else {
        showResult();
    }
};

document.getElementById('restart-btn').onclick = startGame;

function showResult() {
    document.getElementById('question-area').textContent = '';
    document.getElementById('choices-area').innerHTML = '';
    document.getElementById('timer').textContent = '';
    let msg = `최종 점수<br>나: ${playerScore}점<br>AI: ${aiScore}점<br><br>`;
    if (playerScore > aiScore) msg += '🎉 승리! AI를 이겼어요!';
    else if (playerScore < aiScore) msg += '😅 아쉽게도 AI가 이겼어요.';
    else msg += '🤝 무승부!';
    document.getElementById('result').innerHTML = msg;
    document.getElementById('restart-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
}

// 게임 시작
startGame();
