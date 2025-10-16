package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "confederations")
public class Confederation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "confederation_name")
    private String confederationName;

    @NotBlank
    @Size(max = 50)
    private String region;

    @Size(max = 100)
    @Column(name = "president_name")
    private String presidentName;

    @ElementCollection
    @CollectionTable(name = "confederation_member_countries", joinColumns = @JoinColumn(name = "confederation_id"))
    @Column(name = "country")
    private List<String> memberCountries;

    // Constructors
    public Confederation() {}

    public Confederation(String confederationName, String region) {
        this.confederationName = confederationName;
        this.region = region;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConfederationName() {
        return confederationName;
    }

    public void setConfederationName(String confederationName) {
        this.confederationName = confederationName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getPresidentName() {
        return presidentName;
    }

    public void setPresidentName(String presidentName) {
        this.presidentName = presidentName;
    }

    public List<String> getMemberCountries() {
        return memberCountries;
    }

    public void setMemberCountries(List<String> memberCountries) {
        this.memberCountries = memberCountries;
    }
}


