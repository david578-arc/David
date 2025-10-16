package com.examly.springapp.model;

public enum TournamentStatus {
    PLANNED("Planned"),
    REGISTRATION("Registration"),
    GROUP_STAGE("Group Stage"),
    KNOCKOUT("Knockout"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    ACTIVE("ACTIVE"),
    UPCOMING("UPCOMING");

    private final String displayName;

    TournamentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
