package com.examly.springapp.controller;

import com.examly.springapp.model.Team;
import com.examly.springapp.model.TeamStatus;
import com.examly.springapp.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/teams")
//@CrossOrigin(origins = "*")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping("/register")
    public ResponseEntity<Team> registerTeam(@Valid @RequestBody Team team) {
        if (teamService.teamExists(team.getTeamName())) {
            throw new RuntimeException("Team name already exists");
        }
        Team savedTeam = teamService.saveTeam(team);
        return ResponseEntity.ok(savedTeam);
    }

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        Team team = teamService.getTeamById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return ResponseEntity.ok(team);
    }

    @GetMapping("/confederation/{confederation}")
    public ResponseEntity<List<Team>> getTeamsByConfederation(@PathVariable String confederation) {
        return ResponseEntity.ok(teamService.getTeamsByConfederation(confederation));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Team>> getTeamsByStatus(@PathVariable TeamStatus status) {
        return ResponseEntity.ok(teamService.getTeamsByStatus(status));
    }

    @GetMapping("/ranking")
    public ResponseEntity<List<Team>> getTeamsByRankingRange(
            @RequestParam int minRank, 
            @RequestParam int maxRank) {
        return ResponseEntity.ok(teamService.getTeamsByRankingRange(minRank, maxRank));
    }

    @GetMapping("/ranking/all")
    public ResponseEntity<List<Team>> getAllTeamsOrderByRanking() {
        return ResponseEntity.ok(teamService.getAllTeamsOrderByRanking());
    }

    @GetMapping("/confederation/{confederation}/ranking")
    public ResponseEntity<List<Team>> getTeamsByConfederationOrderByRanking(@PathVariable String confederation) {
        return ResponseEntity.ok(teamService.getTeamsByConfederationOrderByRanking(confederation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(@PathVariable Long id, @Valid @RequestBody Team teamDetails) {
        Team updatedTeam = teamService.getTeamById(id).map(existingTeam -> {
            existingTeam.setTeamName(teamDetails.getTeamName());
            existingTeam.setConfederation(teamDetails.getConfederation());
            existingTeam.setFifaRanking(teamDetails.getFifaRanking());
            existingTeam.setHeadCoach(teamDetails.getHeadCoach());
            existingTeam.setTeamManager(teamDetails.getTeamManager());
            existingTeam.setStatus(teamDetails.getStatus());
            return teamService.saveTeam(existingTeam);
        }).orElseThrow(() -> new RuntimeException("Team not found"));
        
        return ResponseEntity.ok(updatedTeam);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Team> updateTeamStatus(@PathVariable Long id, @RequestBody Map<String, String> statusData) {
        TeamStatus status = TeamStatus.valueOf(statusData.get("status"));
        Team updatedTeam = teamService.updateTeamStatus(id, status);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        if (teamService.getTeamById(id).isPresent()) {
            teamService.deleteTeam(id);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Team not found");
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getTeamAnalytics() {
        List<Team> allTeams = teamService.getAllTeams();
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalTeams", allTeams.size());
        
        Map<String, Long> statusCounts = allTeams.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        team -> team.getStatus().name(),
                        java.util.stream.Collectors.counting()
                ));
        analytics.put("statusCounts", statusCounts);
        
        Map<String, Long> confederationCounts = allTeams.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Team::getConfederation,
                        java.util.stream.Collectors.counting()
                ));
        analytics.put("confederationCounts", confederationCounts);
        
        return ResponseEntity.ok(analytics);
    }
}
