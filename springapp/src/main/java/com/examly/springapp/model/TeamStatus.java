package com.examly.springapp.model;

public enum TeamStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    REJECTED("Rejected"),
    QUALIFIED("Qualified"),
    ELIMINATED("Eliminated"),
    CHAMPION("Champion");

    private final String displayName;

    TeamStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

