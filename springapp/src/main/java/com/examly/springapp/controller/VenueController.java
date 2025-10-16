package com.examly.springapp.controller;

import com.examly.springapp.model.Venue;
import com.examly.springapp.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/venues")
//@CrossOrigin(origins = "*")
public class VenueController {

    @Autowired
    private VenueService venueService;

    @PostMapping
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody Venue venue) {
        Venue savedVenue = venueService.saveVenue(venue);
        return ResponseEntity.ok(savedVenue);
    }

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long id) {
        Venue venue = venueService.getVenueById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        return ResponseEntity.ok(venue);
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Venue>> getVenuesByCity(@PathVariable String city) {
        return ResponseEntity.ok(venueService.getVenuesByCity(city));
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<Venue>> getVenuesByCountry(@PathVariable String country) {
        return ResponseEntity.ok(venueService.getVenuesByCountry(country));
    }

    @GetMapping("/capacity")
    public ResponseEntity<List<Venue>> getVenuesByCapacityRange(
            @RequestParam int minCapacity, 
            @RequestParam int maxCapacity) {
        return ResponseEntity.ok(venueService.getVenuesByCapacityRange(minCapacity, maxCapacity));
    }

    @GetMapping("/surface/{surfaceType}")
    public ResponseEntity<List<Venue>> getVenuesBySurfaceType(@PathVariable String surfaceType) {
        return ResponseEntity.ok(venueService.getVenuesBySurfaceType(surfaceType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long id, @Valid @RequestBody Venue venueDetails) {
        Venue updatedVenue = venueService.getVenueById(id).map(existingVenue -> {
            existingVenue.setVenueName(venueDetails.getVenueName());
            existingVenue.setCity(venueDetails.getCity());
            existingVenue.setCountry(venueDetails.getCountry());
            existingVenue.setCapacity(venueDetails.getCapacity());
            existingVenue.setSurfaceType(venueDetails.getSurfaceType());
            return venueService.saveVenue(existingVenue);
        }).orElseThrow(() -> new RuntimeException("Venue not found"));
        
        return ResponseEntity.ok(updatedVenue);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable Long id) {
        if (venueService.getVenueById(id).isPresent()) {
            venueService.deleteVenue(id);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Venue not found");
        }
    }
}
