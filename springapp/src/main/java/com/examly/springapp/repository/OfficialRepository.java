package com.examly.springapp.repository;

import com.examly.springapp.model.Official;
import com.examly.springapp.model.OfficialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfficialRepository extends JpaRepository<Official, Long> {
    
    List<Official> findByOfficialType(OfficialType officialType);
    
    List<Official> findByNationality(String nationality);
    
    @Query("SELECT o FROM Official o WHERE o.experience >= :minExperience")
    List<Official> findByExperienceGreaterThanEqual(@Param("minExperience") Integer minExperience);
    
    @Query("SELECT o FROM Official o ORDER BY o.experience DESC")
    List<Official> findAllOrderByExperienceDesc();
}

