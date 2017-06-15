function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
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
        updateUserInfo(user)
        $('#welcome').hide();
        $('#challengeList').show();
    }).catch(function(error) {
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

function checkUserLogin() {

    var accessToken = localStorage.getItem("accessToken");
    var idToken = localStorage.getItem("idToken");

      if (idToken || accessToken){
        console.log("sie sind Angemeldet");
        var credential = firebase.auth.GoogleAuthProvider.credential(
          idToken, accessToken);
        firebase.auth().signInWithCredential(credential).then(function(user){
          updateUserInfo(user);
          $('#welcome').hide();
          $('#challengeList').show();
        }).catch(function(error){
          console.error(error);
        });
      }



}

$(function() {
    if (firebase.auth().currentUser) {
        updateUserInfo(firebase.auth().currentUser);
        $('#welcome').hide();
        $('#challengeList').show();
    } else {
        $("#loginButton").on("click", signIn);
        checkUserLogin();
    }
});
