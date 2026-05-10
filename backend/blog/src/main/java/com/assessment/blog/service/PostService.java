package com.assessment.blog.service;

import com.assessment.blog.entity.Post;
import com.assessment.blog.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Passes page and size directly to hit the pagination requirement
    public Page<Post> getAllPosts(int page, int size, String category, String tag, String keyword) {
        // Create a Pageable object, sorting by newest first
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        // Logic to choose the correct repository method based on the filters provided
        if (keyword != null && !keyword.isEmpty()) {
            return postRepository.findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(keyword, keyword, pageable);
        }else if (category != null && !category.isEmpty()) {
            return postRepository.findByCategory(category, pageable);
        } else if (tag != null && !tag.isEmpty()) {
            return postRepository.findByTagsContaining(tag, pageable);
        } else {
            return postRepository.findAll(pageable); // Default: Get all
        }
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }
    public Post updatePost(Long id, Post postDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setTitle(postDetails.getTitle());
        post.setBody(postDetails.getBody());
        post.setCategory(postDetails.getCategory());
        post.setTags(postDetails.getTags());
        // Note: We don't update the author or timestamp!

        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }


}