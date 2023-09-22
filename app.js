import { loadQuestion } from "./src/loadQuestion.js";

const container = document.querySelector("#test-container");
const form = document.querySelector("#user-data");
const userContainer = document.querySelector("#user-data-container");
const questionForm = document.querySelector("#question-form");
const userAnswers = {};
const questionTemplate = document.querySelector("[question-form-template]");
const closeMark = document.querySelector("#closing-mark");
const changeColor = document.querySelector("#dark-light");
let colorLight = true;
let questionNumber;

function closeTest() {
  container.remove();
}
// tochange dark/light mode
function appearance() {
  const style = document.querySelector('[rel="stylesheet"]');
  if (colorLight) {
    style.setAttribute("href", "dark.css");
    colorLight = false;
    document.querySelector("#dark-light").innerHTML = "&#9790";
  } else {
    style.setAttribute("href", "style.css");
    colorLight = true;
    document.querySelector("#dark-light").innerHTML = "&#x263C";
  }
}
//add button close test
closeMark.onclick = () => {
  closeTest();
};
//add change color
changeColor.onclick = () => {
  appearance();
};
//submit user ID form
form.onsubmit = async (e) => {
  e.preventDefault();
  const name = document.querySelector("#first-name").value;
  const surname = document.querySelector("#last-name").value;
  const email = document.querySelector("#email").value;
  userAnswers.student = {
    Name: `${name}`,
    Surname: `${surname}`,
    email: `${email}`,
  };

  //delete inner HTML of user container form
  userContainer.remove();
  //load test
  questionNumber = 1;
  loadQuestion(questionNumber);
};
export {container, userAnswers, questionTemplate, colorLight, questionNumber, closeTest, appearance }