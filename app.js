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
            list.append(challengeJoinEntry(entry.val(), entry.key))
        });
        $('.join-challenge').on("click", function (event) {
            var challengeId = $(event.target).data("challengeid");
            console.log("join challenge room", challengeId);
        });
    });
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


function createChallengeRoom(challange) {
    var creator = firebase.auth().currentUser.displayName;
    return firebase.database().ref('/challengeRoom/').push().set({

    createdBy: creator,
    maxMultiplier: challange.maxMultiplier,
    maxQuestions: challange.maxQuestions,
    maxTime: challange.maxTime,
    name: challange.name

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
