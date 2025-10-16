package com.examly.springapp.controller;

import com.examly.springapp.model.Ticket;
import com.examly.springapp.service.TicketService;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Ticket> book(@RequestBody Ticket ticket, @AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(ticketService.bookTicket(ticket, user.getId()));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> my(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getSubject();
        User user = userRepository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(ticketService.getMyTickets(user.getId()));
    }
}


