const startQuiz = document.querySelector('.start-quiz');
const infoBox = document.querySelector('.info-box');
const continueBtn = document.querySelector('.buttons .continue');
const exitBtn = document.querySelector('.buttons .exit');
const quizBox = document.querySelector('.quiz-box');
const nextBtn = document.querySelector('button.next');
const optionsList = document.querySelector('.options-list');
const resultBox = document.querySelector('.result-box');
const quitQuiz = document.querySelector('button.quit');
const restartQuiz = document.querySelector('button.restart');

const quizTime = document.querySelector('.timer-secs');
const quizText = document.querySelector('.timer-text');

const wrapperInfoBox = document.querySelector('.wrapper-infoBox');
const wrapperQuizBox = document.querySelector('.wrapper-quizBox');

const tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
const crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Final Score;
let finalScoreText;

// If startQuiz Button has been clicked;
startQuiz.addEventListener('click', () => {
    infoBox.classList.add('show'); // Show info box;
    wrapperInfoBox.classList.remove('disabled');
    wrapperInfoBox.classList.add('animate__animated', 'animate__bounceInDown');
});

// If ContinueBtn is clicked;
continueBtn.addEventListener('click', () => {
    infoBox.classList.remove('show');
    wrapperInfoBox.classList.add('disabled');
    quizBox.classList.add('show');
    wrapperQuizBox.classList.add('animate__animated', 'animate__bounceInUp');

    showQuestions(0);
    numberOfQuestion(1);
    startTimer(timeValue);
})

// If exitBtn is clicked;
exitBtn.addEventListener('click', () => {
    infoBox.classList.remove('show');
    wrapperInfoBox.classList.add('disabled');
})

// If quitQuiz button (from result box) is clicked;
quitQuiz.addEventListener('click', () => {
    window.location.reload();
})

// If restartQuiz button (from result box) is clicked;
restartQuiz.addEventListener('click', () => {
    resultBox.classList.remove('show');
    quizBox.classList.add('show');
    wrapperQuizBox.classList.remove('disabled');

    timeValue = 15;
    questionsCounter = 0;
    numberOfQuestionsCount = 1;
    userScore = 0;

    showQuestions(questionsCounter);
    numberOfQuestion(numberOfQuestionsCount);
    clearInterval(secondsCounter);
    startTimer(timeValue);
})

// <-------------------------- // -------------------------- > //

// Set initial values;
let questionsCounter = 0;
let numberOfQuestionsCount = 1;
let userScore = 0;
let secondsCounter;
let timeValue = 15;

// If nextBtn has been clicked;
nextBtn.addEventListener('click', () => {
    if (questionsCounter < questions.length - 1) {
        questionsCounter++;
        numberOfQuestionsCount++;
        showQuestions(questionsCounter);
        numberOfQuestion(numberOfQuestionsCount);
        startTimer(timeValue);
        nextBtn.style.display = 'none';
        if (window.location.hash === "#ptBr") {
            quizText.textContent = "Tempo";
        } else {
            quizText.textContent = "Time Left";
        }

        // Clear the explanation when moving to the next question
        const explanationDiv = document.querySelector('.explanation');
        if (explanationDiv) {
            explanationDiv.remove();
        }
    } else {
        console.log("Hey, you've completed the Quiz!");
        showResults();
    }
});
function showQuestions(index) {
    const questionTitle = document.querySelector('.question-title');
    const questionItself = `${questions[index].id}. ${questions[index].question}`;

    const optionsThemselves = `<li class="option">${questions[index].options[0]}</li>`
                                + `<li class="option">${questions[index].options[1]}</li>`
                                + `<li class="option">${questions[index].options[2]}</li>`
                                + `<li class="option">${questions[index].options[3]}</li>`;
                                
    questionTitle.innerHTML = questionItself;
    optionsList.innerHTML = optionsThemselves;

    const options = optionsList.querySelectorAll('.option');
    options.forEach(option => {
        option.setAttribute('onclick', 'optionSelected(this)');
    });
    const existingExplanation = document.querySelector('.explanation');
    if (existingExplanation) {
        existingExplanation.remove();
    }
}

// Start Timer (15 seconds);
function startTimer(time) {
    secondsCounter = setInterval(timer, 1000);

    function timer() {
        quizTime.textContent = time;
        time--;

        if (time < 9) {
            let addZero = quizTime.textContent;
            quizTime.textContent = '0' + addZero;
        }

        if (time < 0) {
            clearInterval(secondsCounter);
            quizText.innerHTML = window.location.hash === "#ptBr" ? "Acabou!" : "Time Off";

            const allOptions = optionsList.children.length;
            const correctAnswers = questions[questionsCounter].answer;

            for (let i = 0; i < allOptions; i++) {
                if (optionsList.children[i].textContent === correctAnswers) {
                    optionsList.children[i].setAttribute('class', 'option correct');
                    optionsList.children[i].insertAdjacentHTML('beforeend', tickIcon);
                }

                for (let i = 0; i < allOptions; i++) {
                    optionsList.children[i].classList.add('disabled');
                }

                nextBtn.style.display = 'block';
            }
        }
    }
}

// User selecting an option;
function optionSelected(answer) {
    clearInterval(secondsCounter);
    let userAnswers = answer.textContent;
    let correctAnswers = questions[questionsCounter].answer;
    const allOptions = optionsList.children.length;

    const explanationDiv = document.createElement('div');
    explanationDiv.classList.add('explanation');

    if (userAnswers === correctAnswers) {
        answer.classList.add('correct');
        userScore++;
        explanationDiv.innerHTML = `<p>Correct! ${questions[questionsCounter].explanation}</p>`;
    } else {
        answer.classList.add('wrong');
        answer.insertAdjacentHTML('beforeend', crossIcon);
        explanationDiv.innerHTML = `<p>Wrong! ${questions[questionsCounter].explanation}</p>`;
    }

    optionsList.insertAdjacentElement('afterend', explanationDiv);
    nextBtn.style.display = 'block';

    for (let i = 0; i < allOptions; i++) {
        if (optionsList.children[i].textContent === correctAnswers) {
            optionsList.children[i].setAttribute('class', 'option correct');
            optionsList.children[i].insertAdjacentHTML('beforeend', tickIcon);
        }
    }

    for (let i = 0; i < allOptions; i++) {
        optionsList.children[i].classList.add('disabled');
    }
}

function numberOfQuestion(index) {
    const totalQuestions = document.querySelector('.total-questions');
    let currentNumberQuestion;

    if (window.location.hash === "#ptBr") {
        currentNumberQuestion = `<p><span>${index}</span> de <span>${questions.length}</span> Perguntas</p>`;
    } else {
        currentNumberQuestion = `<p><span>${index}</span> of <span>${questions.length}</span> Questions</p>`;
    }
    
    totalQuestions.innerHTML = currentNumberQuestion;
}

// Show Results;
function showResults() {
    quizBox.classList.remove('show');
    wrapperQuizBox.classList.add('disabled');

    resultBox.classList.add('show');

    const finalScoreDiv = document.querySelector('.result-box-score');

    if (userScore === 0) {
        finalScoreText = window.location.hash === "#ptBr" ? "que azar! Você não conseguiu acertar nenhuma..." : "KondaErripukka 💩, you didn't score any points...";
        finalScoreDiv.innerHTML = finalScoreText;

    } else if (userScore <= 4) {   
        finalScoreText = window.location.hash === "#ptBr" ? `que pena! Você só acertou <span>${userScore}</span> de <span>${questions.length}</span>` : `Erripukka 🤣, you got only <span>${userScore}</span> out of <span>${questions.length}</span}...`;
        finalScoreDiv.innerHTML = finalScoreText;

    } else if (userScore <= 6) {
        finalScoreText = window.location.hash === "#ptBr" ? `boaa! Tu conseguiu acertar <span>${userScore}</span> de <span>${questions.length}</span>!` : `PichiPukka! You got <span>${userScore}</span> out of <span>${questions.length}</span>`;
        finalScoreDiv.innerHTML = finalScoreText;

    } else if (userScore <= 9) {
        finalScoreText = window.location.hash === "#ptBr" ? `muito bom tchê! Tu acertou quase todas! <span>${userScore}</span> de <span>${questions.length}</span>` : `parvala! You almost got all answers right! <span>${userScore}</span> out of <span>${questions.length}</span>`;
        finalScoreDiv.innerHTML = finalScoreText;

    } else {
        finalScoreText = window.location.hash === "#ptBr" ? `Meus parabéns, você acertou todas! Konoha está orgulhosa de você ;) <span>${userScore}</span> de <span>${questions.length}</span>` : ` Dengoo & Congratulations, you got all answers right! Konoha is proud of you ;) <span>${userScore}</span> out of <span>${questions.length}</span>`;
        finalScoreDiv.innerHTML = finalScoreText;
    }
}


// Disable TouchMove Event;
// document.body.addEventListener('touchmove', function(e) {
//     e.preventDefault();
//     e.stopPropagation();
// }, false);