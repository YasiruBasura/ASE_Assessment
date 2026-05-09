package com.assessment.blog.repository;

import com.assessment.blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Handles the requirement: Filter posts by category with pagination
    Page<Post> findByCategory(String category, Pageable pageable);

    // Handles the requirement: Filter posts by tag with pagination
    Page<Post> findByTagsContaining(String tag, Pageable pageable);

    // Handles the BONUS: Search posts by keyword (checks title and body)
    Page<Post> findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(String title, String body, Pageable pageable);
}