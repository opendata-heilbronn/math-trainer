var num1 = randomNumber();
var num2 = randomNumber();
var question = "Was ist " + num1 + " * " + num2 + " ?";





function randomNumber() {
    return Math.round(Math.random() * 9);
}













function onButtonClick(e) {
    e.preventDefault();
    var userInput = answer.value;
    if (userInput == num1 * num2) {

        document.getElementById("output").innerHTML = (userInput + " ist richtig!");
    } else {
        document.getElementById("output").innerHTML = (userInput + " Ist Falsch!");
    }
    answer.value = "";
    nextQuestion();
    return false;

}

function nextQuestion() {
    num1 = randomNumber();
    num2 = randomNumber();
    var question = "Was ist " + num1 + " * " + num2 + " ?";
    document.getElementById("question").innerHTML = question;

}
