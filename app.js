const form = document.querySelector('#user-data');
const questionForm = document.querySelector('#question-form');
const userAnswers = {};
const questionTemplate = document.querySelector('[question-form-template]');

let questionNumber;

function calculateAnswers(answers){
    questionForm.innerHTML = "";
    const title = "Congratulations you have finished your test!"
    let noAnswers=0;
    let correctAnswers=0;
    let wrongAnswers=0;
    console.log(userAnswers)
    for(let keyAnswer of Object.entries(answers)){
        for(let answer of Object.entries(userAnswers)){
            if(keyAnswer[0]===answer[0] && keyAnswer[1][0] === answer[1]){
                correctAnswers++;
            } else if( keyAnswer[0] === answer[0] && answer[1]!=="no answer" && keyAnswer[1][0]!==answer[1]){
                wrongAnswers++;
            } else if(keyAnswer[0] === answer[0] && answer[1] === "no answer"){
                noAnswers++;
            }
        }
    }
    const result = Math.round((correctAnswers/ /*Object.keys(answers).length)*/5*100)/100);
    questionForm.innerHTML =`
    <h2>${title}</h2>
    <p> No answers: ${noAnswers}, correct answers ${correctAnswers}, wrong answers ${wrongAnswers}. </p>
    <p> Result: ${result*100}%</p>
    `
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
            .then (json => calculateAnswers(json))
        }
    };



};

//apply questions
function loadQuestion (questionNumber) {
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
console.log(userAnswers)