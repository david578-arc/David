package com.examly.springapp.controller;

import com.examly.springapp.model.Player;
import com.examly.springapp.model.Team;
import com.examly.springapp.service.PlayerService;
import com.examly.springapp.service.TeamService;
import com.examly.springapp.exception.PlayerNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/players")
//@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    private TeamService teamService;

    @PostMapping
    public ResponseEntity<Player> addPlayer(@Valid @RequestBody Player player) {
        Player savedPlayer = playerService.savePlayer(player);
        return ResponseEntity.ok(savedPlayer);
    }

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playerService.getAllPlayers());
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Player>> getPlayersByTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(playerService.getPlayersByTeam(teamId));
    }

    @GetMapping("/position/{position}")
    public ResponseEntity<List<Player>> getPlayersByPosition(@PathVariable String position) {
        return ResponseEntity.ok(playerService.getPlayersByPosition(position));
    }

    @GetMapping("/nationality/{nationality}")
    public ResponseEntity<List<Player>> getPlayersByNationality(@PathVariable String nationality) {
        return ResponseEntity.ok(playerService.getPlayersByNationality(nationality));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Player>> getAvailablePlayers() {
        return ResponseEntity.ok(playerService.getAvailablePlayers());
    }

    @GetMapping("/medical-clearance")
    public ResponseEntity<List<Player>> getPlayersWithMedicalClearance() {
        return ResponseEntity.ok(playerService.getPlayersWithMedicalClearance());
    }

    @GetMapping("/top-scorers")
    public ResponseEntity<List<Player>> getTopScorers() {
        return ResponseEntity.ok(playerService.getTopScorers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Player>> searchPlayers(@RequestParam String name) {
        return ResponseEntity.ok(playerService.searchPlayers(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        return ResponseEntity.ok(player);
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getPlayerStats(@PathVariable Long id) {
        Player player = playerService.getPlayerById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("player", player);
        stats.put("goalsScored", player.getGoalsScored());
        stats.put("capsEarned", player.getCapsEarned());
        stats.put("age", player.getAge());
        stats.put("position", player.getPosition());
        stats.put("nationality", player.getNationality());
        
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/medical")
    public ResponseEntity<Player> submitMedicalClearance(@PathVariable Long id, @RequestBody Map<String, Boolean> medicalData) {
        Player player = playerService.getPlayerById(id)
                .orElseThrow(() -> new PlayerNotFoundException(id));
        
        player.setMedicalClearance(medicalData.get("medicalClearance"));
        Player updatedPlayer = playerService.savePlayer(player);
        
        return ResponseEntity.ok(updatedPlayer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Player> updatePlayer(@PathVariable Long id, @Valid @RequestBody Player playerDetails) {
        Player updatedPlayer = playerService.getPlayerById(id).map(existingPlayer -> {
            existingPlayer.setFirstName(playerDetails.getFirstName());
            existingPlayer.setLastName(playerDetails.getLastName());
            existingPlayer.setPosition(playerDetails.getPosition());
            existingPlayer.setJerseyNumber(playerDetails.getJerseyNumber());
            existingPlayer.setDateOfBirth(playerDetails.getDateOfBirth());
            existingPlayer.setNationality(playerDetails.getNationality());
            existingPlayer.setCapsEarned(playerDetails.getCapsEarned());
            existingPlayer.setGoalsScored(playerDetails.getGoalsScored());
            existingPlayer.setClubAffiliation(playerDetails.getClubAffiliation());
            existingPlayer.setMedicalClearance(playerDetails.getMedicalClearance());
            existingPlayer.setIsAvailable(playerDetails.getIsAvailable());
            
            if (playerDetails.getTeam() != null) {
                existingPlayer.setTeam(playerDetails.getTeam());
            }
            
            return playerService.savePlayer(existingPlayer);
        }).orElseThrow(() -> new PlayerNotFoundException(id));
        
        return ResponseEntity.ok(updatedPlayer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Long id) {
        if (playerService.getPlayerById(id).isPresent()) {
            playerService.deletePlayer(id);
            return ResponseEntity.ok().build();
        } else {
            throw new PlayerNotFoundException(id);
        }
    }

    // Legacy endpoints for backward compatibility
    @PostMapping("/addPlayer")
    public ResponseEntity<Player> addPlayerLegacy(@RequestBody Player player) {
        return addPlayer(player);
    }

    @GetMapping("/allPlayers")
    public ResponseEntity<List<Player>> getAllPlayersLegacy() {
        return getAllPlayers();
    }

    @GetMapping("/byPosition")
    public ResponseEntity<List<Player>> getPlayersByPositionLegacy(@RequestParam String position) {
        return getPlayersByPosition(position);
    }

    @GetMapping("/sortedByCountry")
    public ResponseEntity<List<Player>> getPlayerSortedByCountry(@RequestParam String country) {
        return ResponseEntity.ok(playerService.getPlayersByNationality(country));
    }

    @GetMapping("/getPlayerById/{id}")
    public ResponseEntity<Player> getPlayerBuId(@PathVariable Long id) {
        return getPlayerById(id);
    }
}
    

