function playerEntry(player) {
    return $("<div class='player-entry'/>").text(player.displayName);
}
function challengeEntry(challenge, refId) {
    return $("<div class='challenge-entry'/>")
        .append($("<div class='challenge-name'/>").text(challenge.name))
        .append($("<button type='button' class='start-challenge' data-challengeid='" + refId + "'/>").text("Diese Challenge starten"))
}

function challengeJoinEntry(challengeRoom, refId, isOwner) {
    var entry = $("<div class='challenge-entry'/>");
    entry.append($("<div class='challenge-name'/>").text(challengeRoom.name));
    entry.append($("<div class='challenge-details'/>").text("Erstellt von: " + challengeRoom.createdBy));
    if (isOwner) {
        entry.append($("<button type='button' class='edit-challenge' data-challengeid='" + refId + "'/>").text("Verwalten"))

    } else {
        entry.append($("<button type='button' class='join-challenge' data-challengeid='" + refId + "'/>").text("Jetzt mitmachen"))
    }
    return entry;

}
