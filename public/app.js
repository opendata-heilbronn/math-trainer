var database = firebase.database();

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var accessToken = result.credential.accessToken;
        var idToken = result.credential.idToken;

        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
        if (idToken) {
            localStorage.setItem("idToken", idToken);
        }


        localStorage.setItem("provider", provider.prviderId);
        var user = result.user;
        updateUserInfo(user);
        readChallenges();
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
}

function updateUserInfo(user) {
    console.log("user: ", user);
    $("#currentUser").text('Eingeloggt als:   ' + user.displayName);
}

function startChallengeWithId(challengeId) {
    database.ref('/challenge/' + challengeId).once("value", function (snapshot) {
        createChallengeRoom(snapshot.val());
    });
}

function readChallenges() {
    var user = firebase.auth().currentUser;
    var isOwner;
    $('#welcome').hide();
    $('#challengeList').show();
    firebase.database().ref('/challenge/').on('value', function (snapshot) {
        var list = $("#possibleChallenges");
        list.empty();
        snapshot.forEach(function (entry) {
            list.append(challengeEntry(entry.val(), entry.key))
        });
        $('.start-challenge').on("click", function (event) {
            var challengeId = $(event.target).data("challengeid");
            startChallengeWithId(challengeId);
        });
    });
    firebase.database().ref('/challengeRoom/').on('value', function (snapshot) {
        var list = $("#activeChallenges");
        list.empty();
        snapshot.forEach(function (entry) {
            isOwner = user.uid == entry.val().createdById;
            list.append(challengeJoinEntry(entry.val(), entry.key, isOwner))
        });
        $('.join-challenge').on("click", function (event) {
            var challengeRoomId = $(event.target).data("challengeid");
            joinChallengeRoom(challengeRoomId);
        });
        $('.edit-challenge').on("click", function (event) {
            var challengeRoomId = $(event.target).data("challengeid");
            editChallengeRoom(challengeRoomId);
        });
    });
}

function joinChallengeRoom(challengeRoomId) {
    var user = firebase.auth().currentUser;
    database.ref("/challengeRoom/" + challengeRoomId + "/players/" + user.uid)
        .set({
            displayName: user.displayName
        }, function () {
            showChallengeRoom(challengeRoomId);
        });
}

function editChallengeRoom(challengeRoomId) {
    showChallengeRoom(challengeRoomId);
}

function backToChallengeRoom() {
    database.ref('/challengeRoom/' + challengeRoomId + '/' ).once('value', function(snapshot) {
        var currentChallenge = snapshot.val();
        database.ref('/statistics/' + challengeRoomId + '/challengeRoom').set(currentChallenge, function(){
          database.ref('/challengeRoom/' + challengeRoomId +).remove();
        });
    $("#challengeList").show();
    $("#gameView").hide();
    $("#outcome").hide()
  }

function checkUserLogin() {
    var accessToken = localStorage.getItem("accessToken");
    var idToken = localStorage.getItem("idToken");

    if (idToken || accessToken) {
        console.log("sie sind Angemeldet");
        var credential = firebase.auth.GoogleAuthProvider.credential(
            idToken, accessToken);
        firebase.auth().signInWithCredential(credential).then(function (user) {
            updateUserInfo(user);
            readChallenges();
        }).catch(function (error) {
            console.error(error);
        });
    }
}
function startCountdownForChallengeId(challengeRoomId) {
    var countdown = 10;
    var timer = setInterval(function () {
        if (countdown > 0) {
            countdown--;
            database.ref('/challengeRoom/' + challengeRoomId + "/countdown").set(countdown)
        } else {
            clearInterval(timer)
        }
    }, 1000);
}

function beginWithChallenge(challengeRoomId, challengeRoom) {
    $("#challengeRoom").hide();
    $("#gameView").show();
    startGame(challengeRoomId, challengeRoom.questions);
}

function cancelChallengeRoom(challengeRoomId) {
    database.ref("/challengeRoom/" + challengeRoomId).remove();
    $("#challengeRoom").hide();
    readChallenges();
}
function showChallengeRoom(challengeRoomId) {
    var user = firebase.auth().currentUser;

    $("#challengeList").hide();
    $("#challengeRoom").show();

    updatePlayers(challengeRoomId);
    database.ref('/challengeRoom/' + challengeRoomId).on('value', function (snapshot) {
        if (snapshot.exists()) {
            var challengeRoom = snapshot.val();

            if (challengeRoom["countdown"] !== undefined) {
                $("#crCountdown").text("Es geht los in " + challengeRoom["countdown"] + " Sekunden");
                $("#crCountdown").show();
                if (challengeRoom["countdown"] == 0) {
                    beginWithChallenge(challengeRoomId, challengeRoom);
                }
            } else {
                $("#crCountdown").hide();
            }

            if (user.uid == challengeRoom.createdById) {
                $("#crStart").show();
                $("#crQuit").hide();
                $("#crCancel").show();

            } else {
                $("#crCancel").hide();
                $("#crStart").hide();
                $("#crQuit").show();
            }
            $("#crQuit").on("click", function () {
              $("#challengeList").show();
              $("#challengeRoom").hide();
              database.ref('/challengeRoom/' + challengeRoomId + '/players/' + user.uid).remove();
            });
            $("#crStart").on("click", function () {
                startCountdownForChallengeId(challengeRoomId);
            });
            $("#crCancel").on("click", function () {
                cancelChallengeRoom(challengeRoomId);
            });

        } else {
            $("#challengeRoom").hide();
            readChallenges();
        }
    });
}

function updatePlayers(challengeRoom) {
    database.ref('/challengeRoom/' + challengeRoomId + "/player").on('value', function (snapshot) {
        var list = $("#challengeRoomPlayers");
        list.empty();
        snapshot.forEach(function (player) {
            list.append(playerEntry(player));
        })
    });
}

function createChallengeRoom(challange) {
    var user = firebase.auth().currentUser;
    var questions = createQuestions(challange.maxQuestions, challange.maxMultiplier);
    var challengeRoom = database.ref('/challengeRoom/').push();

    challengeRoom.set({
        createdById: user.uid,
        createdBy: user.displayName,
        maxMultiplier: challange.maxMultiplier,
        maxQuestions: challange.maxQuestions,
        maxTime: challange.maxTime,
        name: challange.name,
        questions: questions

    }, function () {
        showChallengeRoom(challengeRoom.key);
    });
}

//alle fuunktionen davor
$(function () {
    if (firebase.auth().currentUser) {
        updateUserInfo(firebase.auth().currentUser);
        readChallenges();
    } else {
        $("#loginButton").on("click", signIn);
        checkUserLogin();
    }
});
