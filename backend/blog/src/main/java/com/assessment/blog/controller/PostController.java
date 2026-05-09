package com.assessment.blog.controller;

import com.assessment.blog.entity.Post;
import com.assessment.blog.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173") // Allows React to connect
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // GET: http://localhost:8080/api/posts?page=0&size=10
    @GetMapping
    public Page<Post> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return postService.getAllPosts(page, size);
    }

    // POST: http://localhost:8080/api/posts
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postService.createPost(post);
    }
}