
const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answer-text"));
const questionCounterText = document.getElementById("counter");
const scoreText = document.getElementById("score");

const restart = document.getElementById("restart");

let questionCounter;
let score;

const MAX_QUESTIONS = 3;

let acceptingAnswers;

function loadFromFile() {
  let xhr = new XMLHttpRequest();

  xhr.open("GET", "question.json", false);

  xhr.send();

  xhr.onload = function () {
    if (this.status == 200) {
    } else {
      console.log("Oops something went wrong");
    }
  };

  return xhr.response;
}

console.log(loadFromFile);

let questions = JSON.parse(loadFromFile());

startGame = () => {
  questionCounter = 0;
  score = 0;
  acceptingAnswers = true;
  scoreText.innerText = score;

  availableQuestions = getRandomQuestions(questions, MAX_QUESTIONS);
  getNewQuestion();
};

const getRandomQuestions = (arr, n) => {
  let len = arr.length;
  if (n > len) {
    throw new RangeError(
      "getRandomQuestions: more elements taken than available!"
    );
  }

  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return (selected = shuffled.slice(0, n));
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    displayResults();
    return;
  }

  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;

  currentQuestion = availableQuestions[0];
  question.innerText = currentQuestion.question;

  answers.forEach((answer) => {
    answer.innerText = currentQuestion[answer.dataset["answer"]];
  });
  //TODO randomization

  answers.forEach((answer) => {
    answer.addEventListener("click", (e) => {
      console.log(e);
      if (!acceptingAnswers) {
        return;
      }
      acceptingAnswers = false;
      const clickedAnswer = e.target;

      const answeredLetter = clickedAnswer.dataset["answer"];

      let classToApply = "incorrect";

      if (answeredLetter === currentQuestion.answer) {
        score++;
        scoreText.innerText = score;
        classToApply = "correct";
      }

      clickedAnswer.parentElement.classList.add(classToApply);

      setTimeout(() => {
        clickedAnswer.parentElement.classList.remove(classToApply);
        acceptingAnswers = true;
        getNewQuestion();
      }, 1000);
    });
  });

  availableQuestions.shift();
};
displayResults = () => {
  const myModalEl = document.getElementById("myModal");
  const modal = new mdb.Modal(endGameModal);
  const modalBody = document.getElementById("modal-body");
  modalBody.innerText = `You scored: ${score}`;
  modal.show();
  acceptingAnswers = false;
};
restart.addEventListener("click", startGame);

startGame();
