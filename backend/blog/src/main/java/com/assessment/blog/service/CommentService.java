package com.assessment.blog.service;

import com.assessment.blog.entity.Comment;
import com.assessment.blog.entity.Post;
import com.assessment.blog.repository.CommentRepository;
import com.assessment.blog.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
    }

    public Page<Comment> getCommentTreeForPost(Long postId, int page, int size) {
        // 1. Fetch paginated top-level comments
        Page<Comment> topLevelComments = commentRepository.findByPostIdAndParentIdIsNull(postId, PageRequest.of(page, size));

        // 2. Fetch ALL replies for this post
        List<Comment> allReplies = commentRepository.findByPostIdAndParentIdIsNotNull(postId);

        // 3. Group the replies by their parentId for lightning-fast lookups
        Map<Long, List<Comment>> repliesByParentId = allReplies.stream()
                .collect(Collectors.groupingBy(Comment::getParentId));

        // 4. Attach replies recursively to the top-level comments
        topLevelComments.forEach(comment -> attachReplies(comment, repliesByParentId));

        return topLevelComments;
    }

    // Recursive helper method to build the tree
    private void attachReplies(Comment comment, Map<Long, List<Comment>> repliesByParentId) {
        List<Comment> childReplies = repliesByParentId.getOrDefault(comment.getId(), List.of());
        comment.setReplies(childReplies);

        // Go deeper: attach replies to the replies
        childReplies.forEach(child -> attachReplies(child, repliesByParentId));
    }

    public Comment addComment(Long postId, Comment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setPost(post);
        return commentRepository.save(comment);
    }
}