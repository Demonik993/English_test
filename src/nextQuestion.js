import { calculateAnswers } from "./calculateAnswers.js";
import { questionTemplate, colorLight, container, closeTest, appearance, userAnswers } from "../app.js";

//add form with question
function nextQuestion(questionNumber, questions) {
  //adding progress bar
  const width = Math.round((questionNumber / Object.keys(questions).length) * 100) / 100;
  const question = questionTemplate.content.cloneNode(true).children[0];
  const progressBar = question.querySelector("#progress-bar");
  const progress = question.querySelector("#progress");
  const legend = question.querySelector("legend");
  const questionVal = question.querySelector("[questionText]");
  const ansA = question.querySelector('[for="ansA"]');
  const ansB = question.querySelector('[for="ansB"]');
  const ansC = question.querySelector('[for="ansC"]');
  const ansD = question.querySelector('[for="ansD"]');
  const clear = question.querySelector("#clear");
  const button = question.querySelector('[type="submit"');
  const close = question.querySelector("#closing-mark");
  const changeColor = question.querySelector("#dark-light");
  changeColor.innerHTML = colorLight ? "&#x263C" : "&#9790";
  button.textContent =
    questionNumber < Object.keys(questions).length
      ? "Next question"
      : "I'am done!";
  button.title =
    questionNumber < Object.keys(questions).length
      ? "Następne pytanie"
      : "Pokaż odpowiedzi";
  legend.textContent = `Question ${questionNumber}/${Object.keys(questions).length}`;
  questionVal.textContent = questions[questionNumber][0];
  ansA.textContent = questions[questionNumber][1];
  ansB.textContent = questions[questionNumber][2];
  ansC.textContent = questions[questionNumber][3];
  ansD.textContent = questions[questionNumber][4];
  container.appendChild(question);
  const progressContainer = document.querySelector("#progress-bar");
  console.log(progressContainer.offsetWidth);
  document.querySelector("#progress").style.width = `${width * progressContainer.offsetWidth}px`;
  const answers = document.querySelectorAll("input");
  //add possibility to unchecked the input;
  clear.addEventListener("click", (e) => {
    e.preventDefault();
    answers.forEach((ans) => {
      if (ans.checked) ans.checked = false;
    });
  });

  close.onclick = () => {
    closeTest();
  };
  changeColor.onclick = () => {
    appearance();
  };
  //adding answer and if done calculate results and send it on e-mail
  question.onsubmit = async (e) => {
    e.preventDefault();
    let answer = "no answer";
    answers.forEach((ans) => {
      answer = ans.checked ? ans.value : (answer = answer);
    });
    userAnswers[questionNumber] = answer;
    question.remove();
    if (questionNumber <Object.keys(questions).length) {
      questionNumber++;
      nextQuestion(questionNumber, questions);
    } else {
      fetch("./public/b1p-diagnostic-test-a-answer.json")
        .then((response) => {
          if (!response.ok) {
            const err = new Error("No answers file accessable!");
            err.status = 404;
            return err;
          } else {
            return response.json();
          }
        })
        //and send to create form with question
        .then((json) => calculateAnswers(json, questions));
    }
  };
}; 
export {nextQuestion}
