package com.assessment.blog.repository;

import com.assessment.blog.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 1. Get ONLY top-level comments with pagination
    Page<Comment> findByPostIdAndParentIdIsNull(Long postId, Pageable pageable);

    // 2. Get ALL replies for a specific post so we can build the tree in-memory
    List<Comment> findByPostIdAndParentIdIsNotNull(Long postId);
}