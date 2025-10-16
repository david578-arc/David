package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "players")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(name = "first_name")
    private String firstName;

    @NotBlank
    @Size(max = 50)
    @Column(name = "last_name")
    private String lastName;

    @NotBlank
    @Size(max = 20)
    private String position;

    @Column(name = "country")
    private String country;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @NotBlank
    @Size(max = 50)
    private String nationality;

    @Column(name = "caps_earned")
    private Integer capsEarned = 0;

    @Column(name = "goals_scored")
    private Integer goalsScored = 0;

    @Column(name = "club_affiliation")
    private String clubAffiliation;

    @Column(name = "medical_clearance")
    private Boolean medicalClearance = false;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PlayerStats> playerStats;

    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MatchEvent> matchEvents;

    // Constructors
    public Player() {}

    public Player(String firstName, String lastName, String position, String nationality) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.position = position;
        this.nationality = nationality;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPlayerName() {
        return firstName + " " + lastName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Integer getJerseyNumber() {
        return jerseyNumber;
    }

    public void setJerseyNumber(Integer jerseyNumber) {
        this.jerseyNumber = jerseyNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public Integer getCapsEarned() {
        return capsEarned;
    }

    public void setCapsEarned(Integer capsEarned) {
        this.capsEarned = capsEarned;
    }

    public Integer getGoalsScored() {
        return goalsScored;
    }

    public void setGoalsScored(Integer goalsScored) {
        this.goalsScored = goalsScored;
    }

    public String getClubAffiliation() {
        return clubAffiliation;
    }

    public void setClubAffiliation(String clubAffiliation) {
        this.clubAffiliation = clubAffiliation;
    }

    public Boolean getMedicalClearance() {
        return medicalClearance;
    }

    public void setMedicalClearance(Boolean medicalClearance) {
        this.medicalClearance = medicalClearance;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public List<PlayerStats> getPlayerStats() {
        return playerStats;
    }

    public void setPlayerStats(List<PlayerStats> playerStats) {
        this.playerStats = playerStats;
    }

    public Set<MatchEvent> getMatchEvents() {
        return matchEvents;
    }

    public void setMatchEvents(Set<MatchEvent> matchEvents) {
        this.matchEvents = matchEvents;
    }

    // Legacy methods for backward compatibility
    public String getCountry() {
        return nationality;
    }

    public void setCountry(String country) {
        this.nationality = country;
    }

    public int getAge() {
        if (dateOfBirth != null) {
            return LocalDate.now().getYear() - dateOfBirth.getYear();
        }
        return 0;
    }

    public void setAge(int age) {
        // This is a legacy method - age is calculated from dateOfBirth
    }

    public int getGoals() {
        return goalsScored != null ? goalsScored : 0;
    }

    public void setGoals(int goals) {
        this.goalsScored = goals;
    }
}
