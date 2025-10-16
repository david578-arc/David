package com.examly.springapp.repository;

import com.examly.springapp.model.Tournament;
import com.examly.springapp.model.TournamentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TournamentRepository extends JpaRepository<Tournament, Long> {
    
    Optional<Tournament> findByTournamentName(String tournamentName);
    
    List<Tournament> findByStatus(TournamentStatus status);
    
    List<Tournament> findByHostCountry(String hostCountry);
    
    List<Tournament> findByEdition(String edition);
    
    @Query("SELECT t FROM Tournament t WHERE t.startDate >= :startDate AND t.endDate <= :endDate")
    List<Tournament> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT t FROM Tournament t WHERE t.startDate <= :date AND t.endDate >= :date")
    List<Tournament> findActiveTournaments(@Param("date") LocalDate date);
    
    @Query("SELECT t FROM Tournament t WHERE t.startDate > :date")
    List<Tournament> findUpcomingTournaments(@Param("date") LocalDate date);
    
    @Query("SELECT t FROM Tournament t WHERE t.endDate < :date")
    List<Tournament> findCompletedTournaments(@Param("date") LocalDate date);
    
    @Query("SELECT t FROM Tournament t ORDER BY t.startDate DESC")
    List<Tournament> findAllOrderByStartDateDesc();
}

