package com.assessment.blog.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data // Lombok handles getters, setters, and constructors
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    @Column(nullable = false)
    private String author; // We will tie this to the User entity later

    @Column(nullable = false)
    private String category;

    @ElementCollection
    private List<String> tags; // Automatically creates a side-table for tags

    @CreationTimestamp
    private LocalDateTime timestamp; // Auto-generates the creation time
}
