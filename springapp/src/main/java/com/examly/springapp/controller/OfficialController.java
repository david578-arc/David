package com.examly.springapp.controller;

import com.examly.springapp.model.Official;
import com.examly.springapp.model.OfficialType;
import com.examly.springapp.service.OfficialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/officials")
//@CrossOrigin(origins = "*")
public class OfficialController {

    @Autowired
    private OfficialService officialService;

    @PostMapping
    public ResponseEntity<Official> createOfficial(@Valid @RequestBody Official official) {
        Official savedOfficial = officialService.saveOfficial(official);
        return ResponseEntity.ok(savedOfficial);
    }

    @GetMapping
    public ResponseEntity<List<Official>> getAllOfficials() {
        return ResponseEntity.ok(officialService.getAllOfficials());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Official> getOfficialById(@PathVariable Long id) {
        Official official = officialService.getOfficialById(id)
                .orElseThrow(() -> new RuntimeException("Official not found"));
        return ResponseEntity.ok(official);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Official>> getOfficialsByType(@PathVariable OfficialType type) {
        return ResponseEntity.ok(officialService.getOfficialsByType(type));
    }

    @GetMapping("/nationality/{nationality}")
    public ResponseEntity<List<Official>> getOfficialsByNationality(@PathVariable String nationality) {
        return ResponseEntity.ok(officialService.getOfficialsByNationality(nationality));
    }

    @GetMapping("/experience")
    public ResponseEntity<List<Official>> getOfficialsByExperience(@RequestParam int minExperience) {
        return ResponseEntity.ok(officialService.getOfficialsByExperience(minExperience));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Official> updateOfficial(@PathVariable Long id, @Valid @RequestBody Official officialDetails) {
        Official updatedOfficial = officialService.getOfficialById(id).map(existingOfficial -> {
            existingOfficial.setOfficialName(officialDetails.getOfficialName());
            existingOfficial.setOfficialType(officialDetails.getOfficialType());
            existingOfficial.setNationality(officialDetails.getNationality());
            existingOfficial.setExperience(officialDetails.getExperience());
            return officialService.saveOfficial(existingOfficial);
        }).orElseThrow(() -> new RuntimeException("Official not found"));
        
        return ResponseEntity.ok(updatedOfficial);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOfficial(@PathVariable Long id) {
        if (officialService.getOfficialById(id).isPresent()) {
            officialService.deleteOfficial(id);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Official not found");
        }
    }
}
