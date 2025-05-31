// 개선버전: 닉네임, 랭킹판, 디자인, 타이머바 반영
const quizData = [
    { question: "지구에서 가장 큰 동물은?", choices: ["코끼리", "파란고래", "기린", "상어"], answer: 1, explanation: "파란고래는 지구에서 가장 큰 동물입니다." },
    { question: "HTML의 약자는?", choices: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Multi Language"], answer: 1, explanation: "HTML은 Hyper Text Markup Language의 약자입니다." },
    { question: "대한민국의 수도는?", choices: ["서울", "부산", "인천", "대전"], answer: 0, explanation: "대한민국의 수도는 서울입니다." },
    { question: "3의 3제곱은?", choices: ["6", "9", "27", "81"], answer: 2, explanation: "3의 3제곱은 3x3x3=27입니다." },
    { question: "물의 화학식은?", choices: ["CO2", "H2O", "O2", "NaCl"], answer: 1, explanation: "물의 화학식은 H2O입니다." }
];

let current = 0, playerScore = 0, aiScore = 0, timer, timeLeft = 10, aiAnswered = false, nickname = "";
const TIMER_MAX = 10;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showNicknameInput() {
    document.getElementById('nickname-area').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
    document.getElementById('score-area').style.display = 'none';
    document.getElementById('leaderboard-area').style.display = 'none';
}

function startGame() {
    current = 0;
    playerScore = 0;
    aiScore = 0;
    shuffle(quizData);
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('ai-score').textContent = aiScore;
    document.getElementById('restart-btn').style.display = 'none';
    document.getElementById('game-area').style.display = 'block';
    document.getElementById('score-area').style.display = 'block';
    document.getElementById('leaderboard-area').style.display = 'none';
    document.getElementById('nickname-label').textContent = nickname;
    showQuestion();
}

function showQuestion() {
    aiAnswered = false;
    timeLeft = TIMER_MAX;
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
    updateTimerBar();
    document.getElementById('timer').textContent = `⏰ 남은 시간: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        updateTimerBar();
        document.getElementById('timer').textContent = `⏰ 남은 시간: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            selectAnswer(-1); // 시간 초과
        }
    }, 1000);
    setTimeout(aiSelect, aiResponseTime());
}

function updateTimerBar() {
    const percent = Math.max(0, (timeLeft / TIMER_MAX) * 100);
    document.getElementById('timer-bar').style.width = percent + '%';
}

function aiResponseTime() {
    return Math.floor(Math.random() * 7000) + 1000;
}

function aiSelect() {
    if (aiAnswered) return;
    aiAnswered = true;
    const q = quizData[current];
    let correctRate = 0.7;
    if (current < 2) correctRate = 0.9;
    else if (current > 3) correctRate = 0.5;
    const aiCorrect = Math.random() < correctRate;
    let aiChoice = aiCorrect ? q.answer : randomWrong(q.answer, q.choices.length);
    markAIAnswer(aiChoice);
}

function randomWrong(answerIdx, total) {
    let idx;
    do { idx = Math.floor(Math.random() * total); } while (idx === answerIdx);
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
    updateTimerBar();
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
    if (!aiAnswered) aiSelect();
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

document.getElementById('restart-btn').onclick = () => {
    showNicknameInput();
};

document.getElementById('start-btn').onclick = () => {
    const input = document.getElementById('nickname-input');
    nickname = input.value.trim() || '플레이어';
    document.getElementById('nickname-area').style.display = 'none';
    startGame();
};

document.getElementById('nickname-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('start-btn').click();
    }
});

function showResult() {
    document.getElementById('question-area').textContent = '';
    document.getElementById('choices-area').innerHTML = '';
    document.getElementById('timer').textContent = '';
    document.getElementById('timer-bar').style.width = '0%';
    let msg = `최종 점수<br>${nickname}: ${playerScore}점<br>AI: ${aiScore}점<br><br>`;
    if (playerScore > aiScore) msg += '🎉 승리! AI를 이겼어요!';
    else if (playerScore < aiScore) msg += '😅 아쉽게도 AI가 이겼어요.';
    else msg += '🤝 무승부!';
    document.getElementById('result').innerHTML = msg;
    document.getElementById('restart-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';
    updateLeaderboard();
}

function updateLeaderboard() {
    // 로컬스토리지에 랭킹 저장/불러오기
    let leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
    leaderboard.push({ name: nickname, score: playerScore });
    leaderboard = leaderboard.sort((a, b) => b.score - a.score).slice(0, 5); // 상위 5명
    localStorage.setItem('quiz_leaderboard', JSON.stringify(leaderboard));
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    leaderboard.forEach((entry, i) => {
        const li = document.createElement('li');
        li.textContent = `${entry.name} - ${entry.score}점`;
        list.appendChild(li);
    });
    document.getElementById('leaderboard-area').style.display = 'block';
}

// 최초 진입시 닉네임 입력
showNicknameInput();
