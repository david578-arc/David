package com.examly.springapp.service;

import com.examly.springapp.model.Venue;
import com.examly.springapp.repository.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public Venue saveVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public List<Venue> getVenuesByCity(String city) {
        return venueRepository.findByCity(city);
    }

    public List<Venue> getVenuesByCountry(String country) {
        return venueRepository.findByCountry(country);
    }

    public List<Venue> getVenuesByCapacityRange(int minCapacity, int maxCapacity) {
        return venueRepository.findByCapacityBetween(minCapacity, maxCapacity);
    }

    public List<Venue> getVenuesBySurfaceType(String surfaceType) {
        return venueRepository.findBySurfaceType(surfaceType);
    }

    public Optional<Venue> getVenueById(Long id) {
        return venueRepository.findById(id);
    }

    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }
}

