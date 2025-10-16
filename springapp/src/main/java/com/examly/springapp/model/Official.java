package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;

@Entity
@Table(name = "officials")
public class Official {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "official_name")
    private String officialName;

    @Enumerated(EnumType.STRING)
    @Column(name = "official_type")
    private OfficialType officialType;

    @NotBlank
    @Size(max = 50)
    private String nationality;

    private Integer experience;

    @OneToMany(mappedBy = "official", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<MatchOfficial> assignedMatches;

    // Constructors
    public Official() {}

    public Official(String officialName, OfficialType officialType, String nationality) {
        this.officialName = officialName;
        this.officialType = officialType;
        this.nationality = nationality;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOfficialName() {
        return officialName;
    }

    public void setOfficialName(String officialName) {
        this.officialName = officialName;
    }

    public OfficialType getOfficialType() {
        return officialType;
    }

    public void setOfficialType(OfficialType officialType) {
        this.officialType = officialType;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public Set<MatchOfficial> getAssignedMatches() {
        return assignedMatches;
    }

    public void setAssignedMatches(Set<MatchOfficial> assignedMatches) {
        this.assignedMatches = assignedMatches;
    }
}


