package com.examly.springapp.repository;

import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByFifaId(String fifaId);
    List<User> findByRole(UserRole role);
    List<User> findByConfederation(String confederation);
    List<User> findByTeam(String team);
    List<User> findByIsActive(Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.lastLogin >= :since")
    List<User> findActiveUsersSince(@Param("since") LocalDateTime since);

    @Query("SELECT u FROM User u WHERE u.role IN :roles")
    List<User> findByRolesIn(@Param("roles") List<UserRole> roles);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByFifaId(String fifaId);
    boolean existsByTeamIgnoreCase(String team);

}

 