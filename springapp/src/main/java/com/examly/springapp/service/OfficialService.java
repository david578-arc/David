package com.examly.springapp.service;

import com.examly.springapp.model.Official;
import com.examly.springapp.model.OfficialType;
import com.examly.springapp.repository.OfficialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OfficialService {

    @Autowired
    private OfficialRepository officialRepository;

    public Official saveOfficial(Official official) {
        return officialRepository.save(official);
    }

    public List<Official> getAllOfficials() {
        return officialRepository.findAll();
    }

    public List<Official> getOfficialsByType(OfficialType type) {
        return officialRepository.findByOfficialType(type);
    }

    public List<Official> getOfficialsByNationality(String nationality) {
        return officialRepository.findByNationality(nationality);
    }

    public List<Official> getOfficialsByExperience(int minExperience) {
        return officialRepository.findByExperienceGreaterThanEqual(minExperience);
    }

    public Optional<Official> getOfficialById(Long id) {
        return officialRepository.findById(id);
    }

    public void deleteOfficial(Long id) {
        officialRepository.deleteById(id);
    }
}

