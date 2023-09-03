const form = document.querySelector('#user-data');
const questionForm = document.querySelector('#question-form');
const userAnswers = {};
const questionTemplate = document.querySelector('[question-form-template]');

let questionNumber;

//add form with question
function nextQuestion(questionNumber, questions){
    console.log(questions[questionNumber]); // to delete
    const question = questionTemplate.content.cloneNode(true).children[0]
    const legend = question.querySelector('legend');
    const questionVal = question.querySelector('[questionText]');
    const ansA = question.querySelector('[for="ansA"]');
    const ansB = question.querySelector('[for="ansB"]');
    const ansC = question.querySelector('[for="ansC"]');
    const ansD = question.querySelector('[for="ansD"]');
    const button = question.querySelector('[type="submit"')
    const buttonText = questionNumber<Object.keys(questions).length? "Next question" : "I'am done!"
    button.textContent = buttonText;
    legend.textContent = `Question ${questionNumber}`;
    questionVal.textContent = questions[questionNumber][0];
    ansA.textContent = questions[questionNumber][1];
    ansB.textContent = questions[questionNumber][2];
    ansC.textContent = questions[questionNumber][3];
    ansD.textContent = questions[questionNumber][4];
    questionForm.appendChild(question)


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