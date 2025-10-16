package com.examly.springapp.controller;

import com.examly.springapp.model.Tournament;
import com.examly.springapp.model.TournamentStatus;
import com.examly.springapp.service.TournamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tournaments")
//@CrossOrigin(origins = "*")
public class TournamentController {

    @Autowired
    private TournamentService tournamentService;

    @PostMapping
    public ResponseEntity<Tournament> createTournament(@Valid @RequestBody Tournament tournament) {
        Tournament savedTournament = tournamentService.saveTournament(tournament);
        return ResponseEntity.ok(savedTournament);
    }

    @GetMapping
    public ResponseEntity<List<Tournament>> getAllTournaments() {
        return ResponseEntity.ok(tournamentService.getAllTournaments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tournament> getTournamentById(@PathVariable Long id) {
        Tournament tournament = tournamentService.getTournamentById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        return ResponseEntity.ok(tournament);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Tournament>> getTournamentsByStatus(@PathVariable TournamentStatus status) {
        return ResponseEntity.ok(tournamentService.getTournamentsByStatus(status));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Tournament>> getActiveTournaments() {
        return ResponseEntity.ok(tournamentService.getActiveTournaments(LocalDate.now()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Tournament>> getUpcomingTournaments() {
        return ResponseEntity.ok(tournamentService.getUpcomingTournaments(LocalDate.now()));
    }

    @GetMapping("/{id}/standings")
    public ResponseEntity<Map<String, Object>> getTournamentStandings(@PathVariable Long id) {
        Map<String, Object> standings = tournamentService.getTournamentStandings(id);
        return ResponseEntity.ok(standings);
    }

    @GetMapping("/{id}/bracket")
    public ResponseEntity<Map<String, Object>> getTournamentBracket(@PathVariable Long id) {
        Map<String, Object> bracket = tournamentService.getTournamentBracket(id);
        return ResponseEntity.ok(bracket);
    }

    @PutMapping("/{id}/advance")
    public ResponseEntity<Tournament> advanceTournament(@PathVariable Long id) {
        Tournament tournament = tournamentService.advanceTournament(id);
        return ResponseEntity.ok(tournament);
    }

    @GetMapping("/{id}/statistics")
    public ResponseEntity<Map<String, Object>> getTournamentStatistics(@PathVariable Long id) {
        Map<String, Object> statistics = tournamentService.getTournamentStatistics(id);
        return ResponseEntity.ok(statistics);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tournament> updateTournament(@PathVariable Long id, @Valid @RequestBody Tournament tournamentDetails) {
        Tournament updatedTournament = tournamentService.getTournamentById(id).map(existingTournament -> {
            existingTournament.setTournamentName(tournamentDetails.getTournamentName());
            existingTournament.setStartDate(tournamentDetails.getStartDate());
            existingTournament.setEndDate(tournamentDetails.getEndDate());
            existingTournament.setHostCountry(tournamentDetails.getHostCountry());
            existingTournament.setStatus(tournamentDetails.getStatus());
            existingTournament.setEdition(tournamentDetails.getEdition());
            return tournamentService.saveTournament(existingTournament);
        }).orElseThrow(() -> new RuntimeException("Tournament not found"));
        
        return ResponseEntity.ok(updatedTournament);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTournament(@PathVariable Long id) {
        if (tournamentService.getTournamentById(id).isPresent()) {
            tournamentService.deleteTournament(id);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Tournament not found");
        }
    }
}
