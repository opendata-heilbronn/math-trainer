var totalTime = 0;
var timeStart = null;
var questions;
var challengeRoomId;
var question;
var questionId = 0;
var answer = document.getElementById("answer");
var correctAnswers = 0;
var wrongAnswers = 0;
var updateTimer = null;


function startGame(_challengeRoomId, _questions) {
    answerList = [];
    questionId = 0;
    totalTime = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    challengeRoomId = _challengeRoomId;
    questions = _questions;
    $("#results").empty();
    nextQuestion();
    timeStart = moment();
    updateCurrentTime();
    updateTimer = setInterval(updateCurrentTime, 1000);
    $("#continueButton").hide();
    $("#checkButton").show();

}

function updateCurrentTime() {
    var timeDifferenceSeconds = moment().diff(timeStart, "seconds");
    var text = "Du hast " + timeDifferenceSeconds + " Sekunden gebraucht!";
    if ((questionId - 1) > 0) {
        var timeAverage = Math.round((timeDifferenceSeconds / (questionId - 1)) * 10.0) / 10.0;
        text += " Durchschnitt: " + timeAverage + " Sekunden pro Frage!";
    }
    document.getElementById("time").innerHTML = text;
}

function onButtonClick(e) {
    e.preventDefault();
    question.timeEnd = new Date();
    question.userInput = answer.value;
    question.expectedAnswer = question.num1 * question.num2;
    question.correct = question.userInput == question.expectedAnswer; // vergleich mit == machen, ansonsten nach Number konvertieren
    question.timeDifference = question.timeEnd - question.timeStart;
    if (question.correct) {
        document.getElementById("output").innerHTML = ("Richtig!");
        correctAnswers++;
    } else {
        document.getElementById("output").innerHTML = (question.userInput + " Ist Falsch! Richtig wäre " + question.expectedAnswer + "!");
        wrongAnswers++;
    }

    var user = firebase.auth().currentUser;
    firebase.database().ref("/statistics/" + challengeRoomId + "/answers/" + user.uid + "/" + questionId).set(question);


    answer.value = "";
    totalTime += question.timeDifference;
    var timeDifferenceSeconds = question.timeDifference / 1000;
    /*    $("#results").append($("<tr><td>" + question.num1 + " * " + question.num2 +
     "</td><td>" + question.expectedAnswer + "</td><td>" + question.userInput +
     "</td><td>" + question.timeDifference + "</td><td>" + question.correct + "</td></tr>"));*/


    firebase.database().ref("/statistics/" + challengeRoomId + "/data/" + user.uid).set({
        displayName: user.displayName,
        correctAnswers: correctAnswers,
        totalQuestions: questions.length,
        totalTime: totalTime,
    });

    if (questionId >= questions.length) {
        clearInterval(updateTimer);
        updateTimer = null;
        let timeoutId = null;
        const showResults = function () {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
            timeoutId = null;
            var timeAverage = Math.round((totalTime / questions.length) / 100.0) / 10.0;
            $("#gameView").hide();
            $("#outcome").show();
            $("#yourTime").text(totalTime / 1000);
            $("#yourAverage").text(timeAverage);

            var correctAnswersInPercent = (correctAnswers / questions.length) * 100;
            $("#correctAnswersInPercent").text(correctAnswersInPercent);
        };

        const timeout = question.correct ? 0 : 4000;
        $("#checkButton").hide();
        $("#continueButton").one('click', showResults).show();
        timeoutId = setTimeout(showResults, timeout);

    } else {
        nextQuestion();
    }

    return false;


}

function nextQuestion() {
    var gameQuestion = questions[questionId];
    question = {
        num1: gameQuestion.num1,
        num2: gameQuestion.num2,
        timeStart: new Date()
    };
    document.getElementById("questionNo").innerHTML = (questionId + 1) + " / " + questions.length;
    document.getElementById("question").innerHTML = "Was ist " + question.num1 + " * " + question.num2 + " ?";
    questionId++;
}
