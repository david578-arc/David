package com.examly.springapp.model;

public enum OfficialRole {
    MAIN_REFEREE("Main Referee"),
    ASSISTANT_REFEREE_1("Assistant Referee 1"),
    ASSISTANT_REFEREE_2("Assistant Referee 2"),
    FOURTH_OFFICIAL("Fourth Official"),
    VAR_REFEREE("VAR Referee"),
    AVAR_REFEREE("AVAR Referee");

    private final String displayName;

    OfficialRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


