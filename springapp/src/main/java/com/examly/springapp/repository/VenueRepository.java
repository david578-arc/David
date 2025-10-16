package com.examly.springapp.repository;

import com.examly.springapp.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByCity(String city);
    List<Venue> findByCountry(String country);
    List<Venue> findBySurfaceType(String surfaceType);

    @Query("SELECT v FROM Venue v WHERE v.capacity >= :minCapacity")
    List<Venue> findByCapacityGreaterThanEqual(@Param("minCapacity") Integer minCapacity);

    @Query("SELECT v FROM Venue v WHERE v.capacity BETWEEN :minCapacity AND :maxCapacity")
    List<Venue> findByCapacityBetween(@Param("minCapacity") Integer minCapacity, @Param("maxCapacity") Integer maxCapacity);

    @Query("SELECT v FROM Venue v ORDER BY v.capacity DESC")
    List<Venue> findAllOrderByCapacityDesc();

    @Query("SELECT v FROM Venue v WHERE v.city = :city AND v.country = :country")
    List<Venue> findByCityAndCountry(@Param("city") String city, @Param("country") String country);
}

 