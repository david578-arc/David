package com.examly.springapp.repository;

import com.examly.springapp.model.Team;
import com.examly.springapp.model.TeamStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    Optional<Team> findByTeamName(String teamName);
    
    List<Team> findByConfederation(String confederation);
    
    List<Team> findByStatus(TeamStatus status);
    
    List<Team> findByHeadCoach(String headCoach);
    
    List<Team> findByTeamManager(String teamManager);
    
    @Query("SELECT t FROM Team t WHERE t.fifaRanking BETWEEN :minRank AND :maxRank")
    List<Team> findByFifaRankingRange(@Param("minRank") Integer minRank, @Param("maxRank") Integer maxRank);
    
    @Query("SELECT t FROM Team t WHERE t.registrationDate >= :since")
    List<Team> findTeamsRegisteredSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT t FROM Team t ORDER BY t.fifaRanking ASC")
    List<Team> findAllOrderByFifaRanking();
    
    @Query("SELECT t FROM Team t WHERE t.confederation = :confederation ORDER BY t.fifaRanking ASC")
    List<Team> findByConfederationOrderByRanking(@Param("confederation") String confederation);
    
    boolean existsByTeamName(String teamName);
}

