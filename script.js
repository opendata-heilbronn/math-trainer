var num1 = randomNumber();
var num2 = randomNumber();
var question = "Was ist " + num1 + " * " + num2 + " ?";





function randomNumber() {
    return Math.round(Math.random() * 9);
}


function randomNumberExtended() {
    return Math.round(Math.random() * 20);
}







/* function onButtonClickAdd(e) {
    e.preventDefault();
    var userInput = answer.value;
    if (userInput == num1 + num2) {

        document.getElementById("output").innerHTML = (userInput + " ist richtig!");
    } else {
        document.getElementById("output").innerHTML = (userInput + " Ist Falsch!");
    }
    answer.value = "";
    nextQuestionAdd();
    return false;
  }
*/


function onButtonClickMulti(e) {
    e.preventDefault();
    var userInput = answer.value;
    if (userInput == num1 * num2) {

        document.getElementById("output").innerHTML = ("Richtig!");
    } else {
        document.getElementById("output").innerHTML = ("Falsch!");
    }
    answer.value = "";
    nextQuestionMulti();
    return false;

}

function nextQuestionMulti() {
    num1 = randomNumber();
    num2 = randomNumber();
    var question = "Was ist " + num1 + " * " + num2 + " ?";
    document.getElementById("question").innerHTML = question;
}


     function nextQuestionAdd() {
        num1 = randomNumber();
        num2 = randomNumber();
        var question = "Was ist " + num1 + " + " + num2 + " ?";
        document.getElementById("question").innerHTML = question;

}
nextQuestionMulti();
onButtonClickMulti();