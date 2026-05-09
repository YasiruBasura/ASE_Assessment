package com.assessment.blog.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String text;

    @Column(nullable = false)
    private String author;

    // The ID of the parent comment. If this is null, it's a top-level comment.
    @Column(name = "parent_id")
    private Long parentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnore // Prevents infinite loops when converting to JSON
    private Post post;

    @CreationTimestamp
    private LocalDateTime timestamp;

    // @Transient means "Don't save this in MySQL, just use it in Java"
    @Transient
    private List<Comment> replies = new ArrayList<>();
}