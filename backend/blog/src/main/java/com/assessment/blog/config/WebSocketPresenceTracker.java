package com.assessment.blog.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.HashMap;

@Component
public class WebSocketPresenceTracker {

    private final SimpMessagingTemplate messagingTemplate;

    // Tracks PostID -> Set of active WebSocket Session IDs
    private final ConcurrentHashMap<String, Set<String>> activeReaders = new ConcurrentHashMap<>();

    // Tracks SessionID -> PostID (So we know which post they were reading when they disconnect)
    private final ConcurrentHashMap<String, String> sessionToPostMap = new ConcurrentHashMap<>();

    public WebSocketPresenceTracker(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Triggered automatically when a user's React app subscribes to a WebSocket room
    @EventListener
    public void handleSubscribeEvent(SessionSubscribeEvent event) {
        SimpMessageHeaderAccessor headers = SimpMessageHeaderAccessor.wrap(event.getMessage());
        String sessionId = headers.getSessionId();
        String destination = headers.getDestination(); // Looks like: /topic/posts/1/comments

        if (destination != null && destination.startsWith("/topic/posts/")) {
            // Extract the Post ID from the URL string
            String[] parts = destination.split("/");
            if (parts.length >= 4) {
                String postId = parts[3];

                // Add the user to the maps
                sessionToPostMap.put(sessionId, postId);
                activeReaders.computeIfAbsent(postId, k -> ConcurrentHashMap.newKeySet()).add(sessionId);

                // Tell everyone in the room the new count!
                broadcastReaderCount(postId);
            }
        }
    }

    // Triggered automatically when a user closes the tab or navigates away
    @EventListener
    public void handleDisconnectEvent(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();

        // Find out which post they were looking at
        String postId = sessionToPostMap.remove(sessionId);

        if (postId != null) {
            Set<String> readers = activeReaders.get(postId);
            if (readers != null) {
                readers.remove(sessionId); // Remove them from the room

                // Clean up memory if room is empty
                if (readers.isEmpty()) {
                    activeReaders.remove(postId);
                }

                // Tell the remaining users the new count!
                broadcastReaderCount(postId);
            }
        }
    }

    private void broadcastReaderCount(String postId) {
        int count = activeReaders.getOrDefault(postId, Collections.emptySet()).size();
        // We broadcast this to a dedicated "readers" channel
        messagingTemplate.convertAndSend("/topic/posts/" + postId + "/readers", count);

        // Broadcast a global map for the Home Feed!
        Map<String, Integer> globalCounts = new HashMap<>();
        activeReaders.forEach((id, sessions) -> {
            if (!sessions.isEmpty()) {
                globalCounts.put(id, sessions.size());
            }
        });

        // Shout the map to a new global channel
        messagingTemplate.convertAndSend("/topic/readers/all", globalCounts);
    }

    public int getActiveReadersForPost(String postId) {
        return activeReaders.getOrDefault(postId, Collections.emptySet()).size();
    }

    public Map<String, Integer> getGlobalReaderCounts() {
        Map<String, Integer> globalCounts = new HashMap<>();
        activeReaders.forEach((id, sessions) -> {
            if (!sessions.isEmpty()) {
                globalCounts.put(id, sessions.size());
            }
        });
        return globalCounts;
    }

}