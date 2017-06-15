function randomNumber(maxMultiplier) {
    return Math.round(Math.random() * (maxMultiplier - 1)) + 1;
}

function createQuestions(maxQuestions, maxMultiplier) {
    var questions = [];
    for (var x = 0; x < maxQuestions; x++) {
        questions.push({
            num1: randomNumber(maxMultiplier),
            num2: randomNumber(maxMultiplier)
        })
    }
    return questions;
}