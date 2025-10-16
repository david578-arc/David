package com.examly.springapp.repository;

import com.examly.springapp.model.Match;
import com.examly.springapp.model.MatchStatus;
import com.examly.springapp.model.Team;
import com.examly.springapp.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    
    List<Match> findByStatus(MatchStatus status);
    
    List<Match> findByHomeTeam(Team homeTeam);
    
    List<Match> findByAwayTeam(Team awayTeam);
    
    List<Match> findByTournament(Tournament tournament);
    
    @Query("SELECT m FROM Match m WHERE m.homeTeam = :team OR m.awayTeam = :team")
    List<Match> findByTeam(@Param("team") Team team);
    
    @Query("SELECT m FROM Match m WHERE m.matchDate >= :startDate AND m.matchDate <= :endDate")
    List<Match> findByMatchDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT m FROM Match m WHERE m.round = :round")
    List<Match> findByRound(@Param("round") String round);
    
    @Query("SELECT m FROM Match m WHERE m.tournament = :tournament AND m.round = :round")
    List<Match> findByTournamentAndRound(@Param("tournament") Tournament tournament, @Param("round") String round);
    
    @Query("SELECT m FROM Match m WHERE m.matchDate >= :date ORDER BY m.matchDate ASC")
    List<Match> findUpcomingMatches(@Param("date") LocalDateTime date);
    
    @Query("SELECT m FROM Match m WHERE m.matchDate < :date ORDER BY m.matchDate DESC")
    List<Match> findPastMatches(@Param("date") LocalDateTime date);
    
    @Query("SELECT m FROM Match m WHERE m.status = 'IN_PROGRESS'")
    List<Match> findLiveMatches();
}

