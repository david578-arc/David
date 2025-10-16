package com.examly.springapp.model;

public enum EventType {
    GOAL("Goal"),
    ASSIST("Assist"),
    YELLOW_CARD("Yellow Card"),
    RED_CARD("Red Card"),
    SUBSTITUTION("Substitution"),
    PENALTY("Penalty"),
    OWN_GOAL("Own Goal"),
    SAVE("Save"),
    CORNER("Corner"),
    FREE_KICK("Free Kick"),
    OFFSIDE("Offside"),
    FOUL("Foul");

    private final String displayName;

    EventType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


