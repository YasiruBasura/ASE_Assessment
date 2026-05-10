package com.assessment.blog.controller;

import com.assessment.blog.entity.Comment;
import com.assessment.blog.entity.Post;
import com.assessment.blog.repository.PostRepository;
import com.assessment.blog.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@CrossOrigin(origins = "http://localhost:5173") // Allow React to connect
public class CommentController {

    private final CommentService commentService;
    private final SimpMessagingTemplate messagingTemplate;
    private final PostRepository postRepository;

    // We inject the MessagingTemplate and PostRepository here
    public CommentController(CommentService commentService,
                             SimpMessagingTemplate messagingTemplate,
                             PostRepository postRepository) {
        this.commentService = commentService;
        this.messagingTemplate = messagingTemplate;
        this.postRepository = postRepository;
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

        // 1. Save the comment to the database via the service
        Comment savedComment = commentService.addComment(postId, comment);

        // 2. Fetch the Post to find out who the original author is
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        String postAuthor = post.getAuthor();
        String commentAuthor = savedComment.getAuthor();

        // 3. Broadcast to the public comments room so everyone's screen updates live
        messagingTemplate.convertAndSend("/topic/posts/" + postId + "/comments", "New comment!");

        // 4. SECURITY/UX: Send private notification ONLY if the commenter is NOT the post author
        if (!postAuthor.equals(commentAuthor)) {
            String notificationMessage = commentAuthor + " just commented on your post: '" + post.getTitle() + "'";
            messagingTemplate.convertAndSend("/topic/notifications/" + postAuthor, notificationMessage);
        }

        return savedComment;
    }
}