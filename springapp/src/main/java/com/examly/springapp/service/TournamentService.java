package com.examly.springapp.service;

import com.examly.springapp.model.Tournament;
import com.examly.springapp.model.TournamentStatus;
import com.examly.springapp.repository.TournamentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@Service
public class TournamentService {

    @Autowired
    private TournamentRepository tournamentRepository;

    public Tournament saveTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public List<Tournament> getTournamentsByStatus(TournamentStatus status) {
        return tournamentRepository.findByStatus(status);
    }

    public List<Tournament> getActiveTournaments(LocalDate date) {
        return tournamentRepository.findActiveTournaments(date);
    }

    public List<Tournament> getUpcomingTournaments(LocalDate date) {
        return tournamentRepository.findUpcomingTournaments(date);
    }

    public Optional<Tournament> getTournamentById(Long id) {
        return tournamentRepository.findById(id);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    public Map<String, Object> getTournamentStandings(Long tournamentId) {
        // Implementation for tournament standings
        Map<String, Object> standings = new HashMap<>();
        standings.put("tournamentId", tournamentId);
        standings.put("message", "Standings calculation in progress");
        return standings;
    }

    public Map<String, Object> getTournamentBracket(Long tournamentId) {
        // Implementation for tournament bracket
        Map<String, Object> bracket = new HashMap<>();
        bracket.put("tournamentId", tournamentId);
        bracket.put("message", "Bracket generation in progress");
        return bracket;
    }

    public Tournament advanceTournament(Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        
        // Logic to advance tournament to next round
        return tournamentRepository.save(tournament);
    }

    public Map<String, Object> getTournamentStatistics(Long tournamentId) {
        // Implementation for tournament statistics
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("tournamentId", tournamentId);
        statistics.put("message", "Statistics calculation in progress");
        return statistics;
    }
}

