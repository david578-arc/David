package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    @Autowired
    private AuthService authService;

    @GetMapping
    public ResponseEntity<User> me(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = authService.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> update(@AuthenticationPrincipal Jwt jwt, @RequestBody User updates) {
        String username = jwt.getSubject();
        User user = authService.findByUsername(username).orElseThrow();
        // Only allow updating certain fields
        user.setEmail(updates.getEmail());
        user.setTeam(updates.getTeam());
        user.setConfederation(updates.getConfederation());
        return ResponseEntity.ok(authService.updateUser(user));
    }
}

