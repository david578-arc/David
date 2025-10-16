package com.examly.springapp.repository;

import com.examly.springapp.model.Player;
import com.examly.springapp.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    
    List<Player> findByPosition(String position);
    
    List<Player> findByNationalityContainingIgnoreCaseOrderByNationalityAsc(String nationality);
    
    List<Player> findByTeam(Team team);
    
    List<Player> findByTeamId(Long teamId);
    
    List<Player> findByJerseyNumberAndTeam(Integer jerseyNumber, Team team);
    
    List<Player> findByIsAvailable(Boolean isAvailable);
    
    List<Player> findByMedicalClearance(Boolean medicalClearance);
    
    @Query("SELECT p FROM Player p WHERE p.dateOfBirth >= :minDate AND p.dateOfBirth <= :maxDate")
    List<Player> findByDateOfBirthBetween(@Param("minDate") LocalDate minDate, @Param("maxDate") LocalDate maxDate);
    
    @Query("SELECT p FROM Player p WHERE p.goalsScored >= :minGoals")
    List<Player> findByGoalsScoredGreaterThanEqual(@Param("minGoals") Integer minGoals);
    
    @Query("SELECT p FROM Player p WHERE p.capsEarned >= :minCaps")
    List<Player> findByCapsEarnedGreaterThanEqual(@Param("minCaps") Integer minCaps);
    
    @Query("SELECT p FROM Player p ORDER BY p.goalsScored DESC")
    List<Player> findAllOrderByGoalsScoredDesc();
    
    @Query("SELECT p FROM Player p WHERE p.team.confederation = :confederation")
    List<Player> findByTeamConfederation(@Param("confederation") String confederation);
    
    @Query("SELECT p FROM Player p WHERE p.firstName LIKE %:name% OR p.lastName LIKE %:name%")
    List<Player> findByNameContaining(@Param("name") String name);
    
    // Legacy methods for backward compatibility
    List<Player> findByCountryContainingIgnoreCaseOrderByCountryAsc(String country);
    

    List<Player> findAllByOrderByNationalityDesc();
//List<Player> findAllByOrderByCountryDesc();
}
