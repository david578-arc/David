package com.examly.springapp.exception;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(PlayerNotFoundException.class)
     public ResponseEntity<Void> handlePlayerNotFound(PlayerNotFoundException ex) {
        return ResponseEntity.notFound().build();
     }
  }
   
