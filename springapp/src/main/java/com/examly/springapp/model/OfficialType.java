package com.examly.springapp.model;

public enum OfficialType {
    REFEREE("Referee"),
    ASSISTANT_REFEREE("Assistant Referee"),
    FOURTH_OFFICIAL("Fourth Official"),
    VAR_REFEREE("VAR Referee"),
    AVAR_REFEREE("AVAR Referee");

    private final String displayName;

    OfficialType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


