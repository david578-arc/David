package com.examly.springapp.model;

public enum UserRole {
    GUEST("Guest"),
    PLAYER("Player"),
    COACH("Coach"),
    TEAM_MANAGER("Team Manager"),
    TOURNAMENT_DIRECTOR("Tournament Director"),
    FIFA_ADMIN("FIFA Admin"),
    MATCH_OFFICIAL("Match Official"),
    MEDIA_REPRESENTATIVE("Media Representative");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}

