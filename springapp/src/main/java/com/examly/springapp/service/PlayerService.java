package com.examly.springapp.service;

import com.examly.springapp.model.Player;
import com.examly.springapp.model.Team;
import com.examly.springapp.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public Player savePlayer(Player player) {
        return playerRepository.save(player);
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> getPlayersByPosition(String position) {
        return playerRepository.findByPosition(position);
    }

    public List<Player> getPlayersByNationality(String nationality) {
        return playerRepository.findByNationalityContainingIgnoreCaseOrderByNationalityAsc(nationality);
    }

    public List<Player> getPlayersByTeam(Long teamId) {
        return playerRepository.findByTeamId(teamId);
    }

    public List<Player> getAvailablePlayers() {
        return playerRepository.findByIsAvailable(true);
    }

    public List<Player> getPlayersWithMedicalClearance() {
        return playerRepository.findByMedicalClearance(true);
    }

    public List<Player> getTopScorers() {
        return playerRepository.findAllOrderByGoalsScoredDesc();
    }

    public List<Player> searchPlayers(String name) {
        return playerRepository.findByNameContaining(name);
    }

    public List<Player> getPlayersByAgeRange(int minAge, int maxAge) {
        LocalDate maxDate = LocalDate.now().minusYears(minAge);
        LocalDate minDate = LocalDate.now().minusYears(maxAge + 1);
        return playerRepository.findByDateOfBirthBetween(minDate, maxDate);
    }

    public List<Player> getPlayersByGoals(int minGoals) {
        return playerRepository.findByGoalsScoredGreaterThanEqual(minGoals);
    }

    public List<Player> getPlayersByCaps(int minCaps) {
        return playerRepository.findByCapsEarnedGreaterThanEqual(minCaps);
    }

    public List<Player> getPlayersByConfederation(String confederation) {
        return playerRepository.findByTeamConfederation(confederation);
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    // Legacy methods for backward compatibility
    public List<Player> getplayersbyCountry(String country) {
        return playerRepository.findByCountryContainingIgnoreCaseOrderByCountryAsc(country);
    }
}
