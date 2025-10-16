package com.examly.springapp.service;

import com.examly.springapp.model.Match;
import com.examly.springapp.model.MatchStatus;
import com.examly.springapp.model.Team;
import com.examly.springapp.model.Tournament;
import com.examly.springapp.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    public List<Match> getMatchesByStatus(MatchStatus status) {
        return matchRepository.findByStatus(status);
    }

    public List<Match> getMatchesByTeam(Team team) {
        return matchRepository.findByTeam(team);
    }

    public List<Match> getMatchesByTournament(Tournament tournament) {
        return matchRepository.findByTournament(tournament);
    }

    public List<Match> getUpcomingMatches() {
        return matchRepository.findUpcomingMatches(LocalDateTime.now());
    }

    public List<Match> getLiveMatches() {
        return matchRepository.findLiveMatches();
    }

    public List<Match> getPastMatches() {
        return matchRepository.findPastMatches(LocalDateTime.now());
    }

    public Optional<Match> getMatchById(Long id) {
        return matchRepository.findById(id);
    }

    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    public Match updateMatchResult(Long matchId, Integer homeScore, Integer awayScore) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));
        
        match.setHomeScore(homeScore);
        match.setAwayScore(awayScore);
        match.setStatus(MatchStatus.COMPLETED);
        
        return matchRepository.save(match);
    }
}

