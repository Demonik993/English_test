import { userAnswers, container, closeTest } from "../app.js";
import { testName } from "./loadQuestion.js";

/*show results to user - client does'nt want to this
function showAnswers(results){
    questionForm.innerHTML = "";
    questionForm.style = "display:block; height:fit-content; width:fit-content; padding: 20px"
    for(let data of Object.entries(results)){
        const quest = document.createElement('h3');
        const para = document.createElement('p');
        para.style = "justify-content: flex-start; padding-left:20px"
        quest.textContent = `${data[0]}: ${data[1][0]}`
        if(data[1][1]==="correct answer"){para.textContent=`You are right, answer is: ${data[1][2]}.`}
        if(data[1][1]==="wrong answer"){para.textContent=`Your answer is ${data[1][2]}, correct answer is: ${data[1][3]} (${data[1][4]}).`}
        if(data[1][1]==="no answer"){para.textContent=`You didn't give any answer, correct answer is: ${data[1][2]} (${data[1][3]}).`}
        questionForm.appendChild(quest);
        questionForm.appendChild(para);
    }
    //append closing button
    const closeResults = document.createElement('button');
    closeResults.className = "button";
    closeResults.textContent ="I've got it. Finish the test";
    closeResults.addEventListener('click', ()=>{closeTest()});
    questionForm.appendChild(closeResults);

}
*/
//calculate and send answers
export function calculateAnswers(answers, questions) {
  let noAnswers = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;
  const checkedAnswers = {
    testName: testName,
    name: userAnswers.student.Name,
    surname: userAnswers.student.Surname,
    email: userAnswers.student.email,
    answers: [],
  };
  const showResults = {};
  const answersValue = {
    "A": 1,
    "B": 2,
    "C": 3,
    "D": 4
  };
  for (let i = 1; i <= Object.keys(answers).length; i++) {
    if (answers[i][0] === userAnswers[i]) {
      correctAnswers++;
      const answer = answersValue[answers[i][0]];
      checkedAnswers.answers.push(
        `On question ${i}: ${questions[i][0]} student gave correct answer:${userAnswers[i]}-${questions[i][answer]};`
      );
      showResults[`Question ${i}`] = [
        questions[i][0],
        "correct answer",
        userAnswers[i],
        userAnswers[i],
        answers[i][1]
      ];
    } else if (userAnswers[i] !== "no answer" &&
      answers[i][0] !== userAnswers[i]) {
      wrongAnswers++;
      const correctAnswer = answersValue[answers[i][0]];
      const answer = answersValue[userAnswers[i]];
      checkedAnswers.answers.push(
        `On question ${i}: ${questions[i][0]} student gave wrong answer:${userAnswers[i]}-${questions[i][answer]}. Correct answer ${answers[i][0]}-${questions[i][correctAnswer]} (${answers[i][1]})`
      );
      showResults[`Question ${i}`] = [
        questions[i][0],
        "wrong answer",
        userAnswers[i],
        answers[i][0],
        answers[i][1],
      ];
    } else if (userAnswers[i] === "no answer") {
      noAnswers++;
      const answer = answersValue[answers[i][0]];
      checkedAnswers.answers.push(
        `On question ${i}: ${questions[i][0]} student didn't give any answer;`
      );
      showResults[`Question ${i}`] = [
        questions[i][0],
        "no answer",
        "-",
        answers[i][0],
        answers[i][1],
      ];
    }
  };
  const result = Math.round((correctAnswers / Object.keys(answers).length) * 100) / 100;
  console.table(showResults)
  // SUMMARY TO SEND
  checkedAnswers.summary = `Student gave ${correctAnswers} correct answers, ${wrongAnswers} wrong and didn't answer on ${noAnswers}. The student result is ${result * 100}% correct answer.;`;

  //ADD SEND E-MAIL
  function sendEmail() {
    let isSent;
    emailjs
      .send("service_dckp35n", "template_4ypd9ca", checkedAnswers)
      .then(
        function (response) {
          isSent = true;
          console.log("SUCCESS!", response.status, response.text);
        },
        function (error) {
          alert("Please check if you are connected to internet.", error);
          isSent = false;
        }
      )
      .then(() => {
        container.innerHTML = "";
        const congrats = document.createElement("div");
        congrats.className = "congrats";
        congrats.innerHTML = isSent
          ? "<h2>Congratulations you have finished your test!</h2>"
          : "<h2>Send my answers again</h2>";
        const button = document.createElement("button");
        button.className = "button";
        button.id = "finish-test";
        button.textContent = isSent ? "OK" : "SEND";
        congrats.appendChild(button);
        container.appendChild(congrats);
        // BUTTON SHOW MY ANSWERS - owner doesn't want this function
        //const showMeAnswer = document.querySelector('#show-answers');
        //showMeAnswer.addEventListener('click', ()=>{showAnswers(showResults)});
        //BUTTON TO DELETE ALL TEST DIV (TO USE IT ON OTHER WEBSITE)
        const close = document.querySelector("#finish-test");
        close.addEventListener("click", () => {
          if (isSent) closeTest();
          else sendEmail();
        });
      });
  }
  sendEmail();
}
