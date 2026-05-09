package com.assessment.blog.controller;

import com.assessment.blog.entity.Comment;
import com.assessment.blog.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to connect
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    // GET: http://localhost:8080/api/posts/1/comments?page=0&size=10
    @GetMapping
    public Page<Comment> getComments(
            @PathVariable Long postId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Returns the paginated tree structure!
        return commentService.getCommentTreeForPost(postId, page, size);
    }

    // POST: http://localhost:8080/api/posts/1/comments
    @PostMapping
    public Comment addComment(
            @PathVariable Long postId,
            @RequestBody Comment comment) {
        return commentService.addComment(postId, comment);
    }
}