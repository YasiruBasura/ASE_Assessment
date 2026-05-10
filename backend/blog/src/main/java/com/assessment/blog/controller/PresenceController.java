package com.assessment.blog.controller;

import com.assessment.blog.config.WebSocketPresenceTracker;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/presence")
@CrossOrigin(origins = "http://localhost:5173")
public class PresenceController {

    private final WebSocketPresenceTracker presenceTracker;

    public PresenceController(WebSocketPresenceTracker presenceTracker) {
        this.presenceTracker = presenceTracker;
    }

    // Get count for a single post
    @GetMapping("/posts/{postId}")
    public int getPostViewers(@PathVariable String postId) {
        return presenceTracker.getActiveReadersForPost(postId);
    }

    // Get global counts for the Home Feed
    @GetMapping("/posts")
    public Map<String, Integer> getAllViewers() {
        return presenceTracker.getGlobalReaderCounts();
    }
}
