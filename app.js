const form = document.querySelector('#user-data');
const questionForm = document.querySelector('#question-form');
const userAnswers = {};
const questionTemplate = document.querySelector('[question-form-template]');

let questionNumber;
let testName;
function closeTest() {
    const container = document.querySelector("#test-container");
    container.remove();
}
//show results to user
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

//calculate and send answers
function calculateAnswers(answers, questions){
    questionForm.innerHTML = "";
    let noAnswers=0;
    let correctAnswers=0;
    let wrongAnswers=0;
    const checkedAnswers = {
        testName: testName,
        name: userAnswers.student.Name,
        surname: userAnswers.student.Surname,
        email: userAnswers.student.email,
        answers: []
    };
    const showResults = {};
    for(let i=1; i<=5; i++){
        if(answers[i][0]===userAnswers[i]){
            correctAnswers++;
            let answer;
            switch(userAnswers[i]){
                case "A": answer = questions[i][1]; 
                break;
                case "B": answer = questions[i][2]; 
                break;
                case "C": answer = questions[i][3]; 
                break;
                case "D": answer = questions[i][4];
            };          
            checkedAnswers.answers.push(`On question ${i}: ${questions[i][0]} student gave correct answer:${userAnswers[i]}-${answer}.`);
            showResults[`Question ${i}`] = [questions[i][0], "correct answer", answer];
        }else if(userAnswers[i]!=="no answer" && answers[i][0]!==userAnswers[i]){
            wrongAnswers++;
            let correctAnswer;
            switch(answers[i][0]){
                case "A": correctAnswer = questions[i][1]; 
                break;
                case "B": correctAnswer = questions[i][2]; 
                break;
                case "C": correctAnswer = questions[i][3]; 
                break;
                case "D": correctAnswer = questions[i][4];
            };          
            let answer
            switch(userAnswers[i]){
                case "A": answer = questions[i][1]; 
                break;
                case "B": answer = questions[i][2]; 
                break;
                case "C": answer = questions[i][3]; 
                break;
                case "D": answer = questions[i][4];
            };          
            checkedAnswers.answers.push(`On question ${i}: ${questions[i][0]} student gave wrong answer:${userAnswers[i]}-${answer}. Correct answer ${answers[i][0]}-${correctAnswer} (${answers[i][1]})`);
            showResults[`Question ${i}`] = [questions[i][0], "wrong answer", answer, correctAnswer, answers[i][1]];
        } else if (userAnswers[i]==="no answer"){
            noAnswers++
            let correctAnswer;
            switch(answers[i][0]){
                case "A": correctAnswer = questions[i][1]; 
                break;
                case "B": correctAnswer = questions[i][2]; 
                break;
                case "C": correctAnswer = questions[i][3]; 
                break;
                case "D": correctAnswer = questions[i][4];
            };          
            checkedAnswers.answers.push(`On question ${i}: ${questions[i][0]} student didn't give any answer!`)
            showResults[`Question ${i}`] = [questions[i][0], "no answer", correctAnswer, answers[i][1]];
        }
    };
    console.log(checkedAnswers);
    questionForm.style.justifyContent = "normal";
    questionForm.style.flexDirection = "column";
    questionForm.style.alignContent = "center";

    const result = Math.round((correctAnswers/ /*Object.keys(answers).length)*/5*100))/100;

    // SUMMARY TO SEND
    checkedAnswers.summary = `Student gave ${correctAnswers} correct answers, ${wrongAnswers} and didn't answer on ${noAnswers}. The student result is ${result*100}% correct answer.`
    //ADD SEND E-MAIL
    emailjs.send('service_dckp35n', 'template_4ypd9ca', checkedAnswers)
    .then(function(response) {
       console.log('SUCCESS!', response.status, response.text);
    }, function(error) {
       console.log('FAILED...', error);
    });
    
    questionForm.innerHTML =`
    <h2>Congratulations you have finished your test!</h2>
    <ul>
        <li> You gave ${correctAnswers} correct answers.</li>
        <li> You gave ${wrongAnswers} wrong answers.</li>
        <li> You didn't response on ${noAnswers} questions.</li>
        <li> Your result: ${result*100}%</li>
    </ul>
    <p>
        <button class="button" id="show-answers"> Show my answers </button>
        <button class="button" id="finish-test"> Finish the test </button>
    </p>
    `
    // BUTTON SHOW MY ANSWERS
    const showMeAnswer = document.querySelector('#show-answers');
    showMeAnswer.addEventListener('click', ()=>{showAnswers(showResults)});
    //BUTTON TO DELETE ALL TEST DIV (TO USE IT ON OTHER WEBSITE)
    const close = document.querySelector("#finish-test");
    close.addEventListener('click', ()=> {closeTest()});

}

//add form with question
function nextQuestion(questionNumber, questions){
    //adding progress bar
    const progressBar = document.querySelector("#progress-bar");
    const progress = document.querySelector("#progress");
    const width = Math.round((questionNumber/5/*Object.keys(questions).length ?*/)*100)/100;
    progress.style.width = `${width*(progressBar.offsetWidth)}px`;
   
    const question = questionTemplate.content.cloneNode(true).children[0];
    const legend = question.querySelector('legend');
    const questionVal = question.querySelector('[questionText]');
    const ansA = question.querySelector('[for="ansA"]');
    const ansB = question.querySelector('[for="ansB"]');
    const ansC = question.querySelector('[for="ansC"]');
    const ansD = question.querySelector('[for="ansD"]');
    const clear = question.querySelector('#clear');
    const button = question.querySelector('[type="submit"');
    const buttonText = questionNumber</*Object.keys(questions).length ?*/5? "Next question" : "I'am done!"
    button.textContent = buttonText;
    legend.textContent = `Question ${questionNumber}`;
    questionVal.textContent = questions[questionNumber][0];
    ansA.textContent = questions[questionNumber][1];
    ansB.textContent = questions[questionNumber][2];
    ansC.textContent = questions[questionNumber][3];
    ansD.textContent = questions[questionNumber][4];
    questionForm.appendChild(question);
    const answers = document.querySelectorAll('input');
      //add possibility to unchecked the input;
    clear.addEventListener('click', (e)=>{
        e.preventDefault();
        answers.forEach(ans=>{
            if(ans.checked) ans.checked = false;
        })
    });
    clear.addEventListener('keyevent', (e)=>{
        e.preventDefault();
        if(e.target === "enter")
        answers.forEach(ans=>{
            if(ans.checked) ans.checked = false;
        })
    }); 
    //adding answer and if done calculate results and send it on e-mail
    question.onsubmit = async (e) =>{
        e.preventDefault();
        let answer = "no answer";
        console.log(answers);
        answers.forEach(ans =>{answer = ans.checked ? ans.value : answer = answer});
        userAnswers[questionNumber] = answer;
        console.log(userAnswers);
        question.remove();
        if(questionNumber</*Object.keys(questions).length ?*/5){
        questionNumber++;
        loadQuestion(questionNumber);
        } else {
            fetch("https://sweet-kleicha-edf916.netlify.app/b1p-diagnostic-test-a-answer.json")
            .then(response => {
                if(!response.ok){
                    const err = new Error("No answers file accessable!")
                    err.status = 404;
                    return err;
                } else {return response.json();}
            })
            //and send to create form with question 
            .then (json => calculateAnswers(json, questions))
        }
    };
};

//apply questions
function loadQuestion (questionNumber) {
    testName = "b1p-diagnostic-test";
    //download questions 
    fetch("https://sweet-kleicha-edf916.netlify.app/b1p-diagnostic-test-a.json")
        .then(response => {
            if(!response.ok){
                const err = new Error("No answers file accessable!")
                err.status = 404;
                return err;
            } else {return response.json();}
        })
        //and send to create form with question 
        .then (json => nextQuestion(questionNumber, json));
};


//submit user ID form
form.onsubmit = async (e) =>{
    e.preventDefault();
    const name = document.querySelector('#first-name').value;
    const surname = document.querySelector('#last-name').value;
    const email = document.querySelector('#email').value;
    userAnswers.student = {Name:`${name}`, Surname:`${surname}`, email:`${email}`};
    
    //delete inner HTML of question form
    form.remove();
    //load test
    questionNumber = 1;
    loadQuestion(questionNumber);

}