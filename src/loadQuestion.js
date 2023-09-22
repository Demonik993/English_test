import { nextQuestion } from "./nextQuestion.js"

let testName;

//apply questions
function loadQuestion(questionNumber) {
  testName = "b1p-diagnostic-test";
  //load questions
  fetch("./public/b1p-diagnostic-test-a.json")
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
    .then((json) => nextQuestion(questionNumber, json));
}
 export {testName, loadQuestion}