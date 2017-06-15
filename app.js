function signIn() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken;
        var user = result.user;
        updateUserInfo(user);
        $('#welcome').hide();
        $('#challengeList').show();
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
    $("#currentUser").text(user.displayName);
}


$(function () {
    if (firebase.auth().currentUser) {
        updateUserInfo(firebase.auth().currentUser);
        $('#welcome').hide();
        $('#challengeList').show();
    } else {
        $("#loginButton").on("click", signIn);
    }
});