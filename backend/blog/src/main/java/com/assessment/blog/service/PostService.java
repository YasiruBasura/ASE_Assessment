package com.assessment.blog.service;

import com.assessment.blog.entity.Post;
import com.assessment.blog.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Passes page and size directly to hit the pagination requirement
    public Page<Post> getAllPosts(int page, int size) {
        return postRepository.findAll(PageRequest.of(page, size));
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

