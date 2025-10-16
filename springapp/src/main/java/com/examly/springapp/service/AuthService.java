package com.examly.springapp.service;

import com.examly.springapp.configuration.JWTUtil;
import com.examly.springapp.model.User;
import com.examly.springapp.model.UserRole;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPasswordHash(),
                user.getIsActive(),
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                getAuthorities(user.getRole())
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(UserRole role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    public String authenticate(String username, String password) {
        UserDetails userDetails = loadUserByUsername(username);
        
        if (passwordEncoder.matches(password, userDetails.getPassword())) {
            User user = userRepository.findByUsername(username).orElseThrow();
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
            
            return jwtUtil.generateToken(username, userDetails.getAuthorities());
        }
        
        throw new RuntimeException("Invalid credentials");
    }

       public User register(User user) {
    if (userRepository.existsByUsername(user.getUsername())) {
        throw new RuntimeException("Username already exists");
    }

    if (userRepository.existsByEmail(user.getEmail())) {
        throw new RuntimeException("Email already exists");
    }

    if (user.getFifaId() != null && userRepository.existsByFifaId(user.getFifaId())) {
        throw new RuntimeException("FIFA ID already exists");
    }
  //  if (!isValidTeamName(user.getTeam())) {
    //    throw new RuntimeException("Team name must contain only letters and cannot be empty");
    //}
    //if (user.getTeam() != null && userRepository.existsByTeamIgnoreCase(user.getTeam())) {
      //  throw new RuntimeException("Team name already exists");
    //}

    //if (!isValidFifaId(user.getFifaId())) {
      //  throw new RuntimeException("FIFA ID must contain both letters and numbers");
    //}

  //  if (!isValidPassword(user.getPasswordHash(), user, null)) {
    //    throw new RuntimeException("Password does not meet policy requirements");
    //}

    String encodedPassword = passwordEncoder.encode(user.getPasswordHash());
    user.setPasswordHash(encodedPassword);
    user.setPasswordChangedDate(LocalDateTime.now());

    user.setPreviousPasswords(List.of(encodedPassword)); // Initialize with first password

    user.setCreatedDate(LocalDateTime.now());
    user.setIsActive(true);

    return userRepository.save(user);
}
private boolean isValidFifaId(String fifaId) {
    return fifaId != null && fifaId.matches("^(?=.[A-Za-z])(?=.\\d)[A-Za-z\\d]+$");
}

private boolean isValidPassword(String password, User user, List<String> prevEncodedPasswords) {
    int minLength;
   switch (user.getRole()) {
    case FIFA_ADMIN:
        minLength = 12;
        break;
    default:
        minLength = 8;
        break;
};


    String lower = password.toLowerCase();
    List<String> bannedTerms = List.of("fifa", "tournament", "worldcup", "league", "cup", "match");

    // Policy checks
    boolean meetsCriteria =
            password.length() >= minLength &&
            password.matches(".[a-z].") &&
            password.matches(".[A-Z].") &&
            password.matches(".\\d.\\d.*") &&
            password.matches(".[!@#$%^&()_+=\\-\\[\\]{};':\"\\\\|,.<>/?].*") &&
            !lower.contains(user.getUsername().toLowerCase()) &&
            !lower.contains(user.getFifaId().toLowerCase()) &&
            bannedTerms.stream().noneMatch(lower::contains);

    if (prevEncodedPasswords != null && !prevEncodedPasswords.isEmpty()) {
        for (String prev : prevEncodedPasswords) {
            if (passwordEncoder.matches(password, prev)) {
                return false; // Reused password
            }
        }
    }

    return meetsCriteria;
}
public void updatePassword(String username, String newPassword) {
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    if (!isValidPassword(newPassword, user, user.getPreviousPasswords())) {
        throw new RuntimeException("Password does not meet policy or was used recently");
    }

    String encoded = passwordEncoder.encode(newPassword);
    List<String> history = new ArrayList<>(user.getPreviousPasswords());

    history.add(0, encoded); // Add to beginning
    if (history.size() > 8) {
        history = history.subList(0, 8); // Keep last 8 only
    }

    user.setPasswordHash(encoded);
    user.setPreviousPasswords(history);
    user.setPasswordChangedDate(LocalDateTime.now());

    userRepository.save(user);
}
public boolean isPasswordExpired(User user) {
    if (user.getPasswordChangedDate() == null) return true;

    long daysSinceChange = java.time.Duration.between(user.getPasswordChangedDate(), LocalDateTime.now()).toDays();

    switch (user.getRole()) {
    case TEAM_MANAGER:
        return daysSinceChange > 60;
    case FIFA_ADMIN:
        return daysSinceChange > 120;
    case PLAYER:
        return daysSinceChange > 180;
    default:
        return true;
}

}
private boolean isValidTeamName(String team) {
    return team != null && team.matches("^[A-Za-z ]+$");
}




    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}

