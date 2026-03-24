package com.examly.springapp.repository;

import com.examly.springapp.model.Notification;
import com.examly.springapp.model.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserIdOrderByCreatedDateDesc(Long userId);
    
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedDateDesc(Long userId);
    
    List<Notification> findByType(NotificationType type);
    
    @Query("SELECT n FROM Notification n WHERE n.createdDate >= :since")
    List<Notification> findNotificationsSince(@Param("since") LocalDateTime since);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadNotificationsByUser(@Param("userId") Long userId);
}

