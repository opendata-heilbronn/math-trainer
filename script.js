var num1 = randomNumber();
var num2 = randomNumber();
var datum1
var datum2
var question = "Was ist " + num1 + " * " + num2 + " ?";
nextQuestion();




function randomNumber() {
    return Math.round(Math.random() * 9);
}













function onButtonClick(e) {
    e.preventDefault();

    datum2 = new Date();
    var userInput = answer.value;
    if (userInput == num1 * num2) {

        document.getElementById("output").innerHTML = (userInput + " ist richtig!");
    } else {
        document.getElementById("output").innerHTML = (userInput + " Ist Falsch!");
    }
    answer.value = "";
    var datumDifferenz = datum2 - datum1;
    var datumDifferenzGerundet = datumDifferenz / 1000;
    alert(datumDifferenzGerundet);
    nextQuestion();
    return false;


}

function nextQuestion() {
    num1 = randomNumber();
    num2 = randomNumber();
    var question = "Was ist " + num1 + " * " + num2 + " ?";
    document.getElementById("question").innerHTML = question;
    datum1 = new Date();

}
