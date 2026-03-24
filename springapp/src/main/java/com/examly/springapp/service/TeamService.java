package com.examly.springapp.service;

import com.examly.springapp.model.Team;
import com.examly.springapp.model.TeamStatus;
import com.examly.springapp.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    public Team saveTeam(Team team) {
        return teamRepository.save(team);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public List<Team> getTeamsByConfederation(String confederation) {
        return teamRepository.findByConfederation(confederation);
    }

    public List<Team> getTeamsByStatus(TeamStatus status) {
        return teamRepository.findByStatus(status);
    }

    public List<Team> getTeamsByRankingRange(int minRank, int maxRank) {
        return teamRepository.findByFifaRankingRange(minRank, maxRank);
    }

    public List<Team> getTeamsRegisteredSince(LocalDateTime since) {
        return teamRepository.findTeamsRegisteredSince(since);
    }

    public List<Team> getAllTeamsOrderByRanking() {
        return teamRepository.findAllOrderByFifaRanking();
    }

    public List<Team> getTeamsByConfederationOrderByRanking(String confederation) {
        return teamRepository.findByConfederationOrderByRanking(confederation);
    }

    public Optional<Team> getTeamById(Long id) {
        return teamRepository.findById(id);
    }

    public Optional<Team> getTeamByName(String teamName) {
        return teamRepository.findByTeamName(teamName);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public boolean teamExists(String teamName) {
        return teamRepository.existsByTeamName(teamName);
    }

    public Team updateTeamStatus(Long teamId, TeamStatus status) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        team.setStatus(status);
        return teamRepository.save(team);
    }
}

