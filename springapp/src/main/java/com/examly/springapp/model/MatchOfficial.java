package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "match_officials")
public class MatchOfficial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "match_id")
    private Match match;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "official_id")
    private Official official;

    @Enumerated(EnumType.STRING)
    @Column(name = "official_role")
    private OfficialRole officialRole;

    // Constructors
    public MatchOfficial() {}

    public MatchOfficial(Match match, Official official, OfficialRole officialRole) {
        this.match = match;
        this.official = official;
        this.officialRole = officialRole;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Match getMatch() {
        return match;
    }

    public void setMatch(Match match) {
        this.match = match;
    }

    public Official getOfficial() {
        return official;
    }

    public void setOfficial(Official official) {
        this.official = official;
    }

    public OfficialRole getOfficialRole() {
        return officialRole;
    }

    public void setOfficialRole(OfficialRole officialRole) {
        this.officialRole = officialRole;
    }
}

