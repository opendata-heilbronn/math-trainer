var question;
var answer = document.getElementById("answer");
function randomNumber() {
    return Math.round(Math.random() * 9);
}


function onButtonClick(e) {
    e.preventDefault();


    question.timeEnd = new Date();
    question.userInput = answer.value;
    question.expectedAnswer = question.num1 * question.num2;
    question.correct = question.userInput === question.expectedAnswer;
    question.timeDifference = question.timeEnd - question.timeStart;
    if (question.correct) {
        document.getElementById("output").innerHTML = ("Richtig!");
    } else {
        document.getElementById("output").innerHTML = (question.userInput + " Ist Falsch! Richtig wäre " + question.expectedAnswer + "!");

    }
    answer.value = "";
    var timeDifferenceSeconds = question.timeDifference / 1000;
    document.getElementById("time").innerHTML = ("Du hast " + timeDifferenceSeconds + " Sekunden gebraucht!");
    nextQuestion();
    return false;


}

function nextQuestion() {
  question = {
    num1 : randomNumber(),
    num2 : randomNumber(),
    timeStart : new Date()
  }

    var questionText = "Was ist " + question.num1 + " * " + question.num2 + " ?";
    document.getElementById("question").innerHTML = questionText;

}


nextQuestion();
