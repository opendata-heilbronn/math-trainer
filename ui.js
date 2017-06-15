function challengeEntry(challenge, refId) {
    return $("<div class='challenge-entry'/>")
        .append($("<div class='challenge-name'/>").text(challenge.name))
        .append($("<button type='button' class='start-challenge' data-challengeid='" + refId + "'/>").text("Diese Challenge starten"))
}
function challengeJoinEntry(challengeRoom, refId) {
    return $("<div class='challenge-entry'/>")
        .append($("<div class='challenge-name'/>").text(challengeRoom.name))
        .append($("<div class='challenge-details'/>").text("Erstellt von: "+challengeRoom.createdBy))
        .append($("<button type='button' class='join-challenge' data-challengeid='" + refId + "'/>").text("Jetzt mitmachen"))
}
