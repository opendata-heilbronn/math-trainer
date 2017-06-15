function challengeEntry(challenge, refId) {
    return $("<div class='challenge-entry'/>")
        .append($("<div class='challenge-name'/>").text(challenge.name))
        .append($("<button type='button' class='start-challenge' data-challengeid='" + refId + "'/>").text("Diese Challenge starten"))
}