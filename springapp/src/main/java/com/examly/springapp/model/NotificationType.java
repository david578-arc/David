package com.examly.springapp.model;

public enum NotificationType {
    MATCH_UPDATE("Match Update"),
    TOURNAMENT_ALERT("Tournament Alert"),
    TEAM_NOTIFICATION("Team Notification"),
    PLAYER_UPDATE("Player Update"),
    SYSTEM_ALERT("System Alert"),
    SCHEDULE_CHANGE("Schedule Change"),
    REGISTRATION_UPDATE("Registration Update"),
    SECURITY_ALERT("Security Alert");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}


