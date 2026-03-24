package com.examly.springapp.model;

public enum MatchStatus {
    SCHEDULED("Scheduled"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    POSTPONED("Postponed"),
    CANCELLED("Cancelled"),
    ABANDONED("Abandoned");

    private final String displayName;

    MatchStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


