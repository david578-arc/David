package com.examly.springapp.controller;

import com.examly.springapp.model.Match;
import com.examly.springapp.model.MatchStatus;
import com.examly.springapp.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/matches")
//@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @PostMapping
    public ResponseEntity<Match> scheduleMatch(@Valid @RequestBody Match match) {
        Match savedMatch = matchService.saveMatch(match);
        return ResponseEntity.ok(savedMatch);
    }

    @GetMapping
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        Match match = matchService.getMatchById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        return ResponseEntity.ok(match);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Match>> getMatchesByStatus(@PathVariable MatchStatus status) {
        return ResponseEntity.ok(matchService.getMatchesByStatus(status));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Match>> getUpcomingMatches() {
        return ResponseEntity.ok(matchService.getUpcomingMatches());
    }

    @GetMapping("/live")
    public ResponseEntity<List<Match>> getLiveMatches() {
        return ResponseEntity.ok(matchService.getLiveMatches());
    }

    @GetMapping("/past")
    public ResponseEntity<List<Match>> getPastMatches() {
        return ResponseEntity.ok(matchService.getPastMatches());
    }

    @PutMapping("/{id}/result")
    public ResponseEntity<Match> recordMatchResult(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> result) {
        Integer homeScore = result.get("homeScore");
        Integer awayScore = result.get("awayScore");
        
        Match updatedMatch = matchService.updateMatchResult(id, homeScore, awayScore);
        return ResponseEntity.ok(updatedMatch);
    }

   @GetMapping("/{id}/statistics")
public ResponseEntity<Map<String, Object>> getMatchStatistics(@PathVariable Long id) {
    Match match = matchService.getMatchById(id)
            .orElseThrow(() -> new RuntimeException("Match not found"));

    Map<String, Object> stats = new HashMap<>();
    stats.put("matchId", match.getId());
    stats.put("homeTeam", match.getHomeTeam());
    stats.put("awayTeam", match.getAwayTeam());
    stats.put("homeScore", match.getHomeScore());
    stats.put("awayScore", match.getAwayScore());
    stats.put("status", match.getStatus());
    stats.put("venue", match.getVenue());
    stats.put("kickoffTime", match.getKickoffTime());

    return ResponseEntity.ok(stats);
}


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        if (matchService.getMatchById(id).isPresent()) {
            matchService.deleteMatch(id);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Match not found");
        }
    }
}
