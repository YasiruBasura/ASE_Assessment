package com.assessment.blog.config;

import com.assessment.blog.entity.Comment;
import com.assessment.blog.entity.Post;
import com.assessment.blog.entity.User;
import com.assessment.blog.repository.PostRepository;
import com.assessment.blog.repository.UserRepository;
import com.assessment.blog.service.CommentService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final PostRepository postRepository;
    private final CommentService commentService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(PostRepository postRepository,
                      CommentService commentService,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.postRepository = postRepository;
        this.commentService = commentService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        // 1. SEED USERS
        if (userRepository.count() == 0) {
            System.out.println("👤 Seeding User Accounts...");
            String defaultPassword = passwordEncoder.encode("password123");

            User yasiru = new User(); yasiru.setUsername("Yasiru"); yasiru.setPassword(defaultPassword);
            userRepository.save(yasiru);

            User john = new User(); john.setUsername("John"); john.setPassword(defaultPassword);
            userRepository.save(john);

            User dam = new User(); dam.setUsername("Dam"); dam.setPassword(defaultPassword);
            userRepository.save(dam);
        }

        // 2. SEED POSTS & COMMENTS
        if (postRepository.count() == 0) {
            System.out.println("📝 Seeding 10 Posts and Nested Comments...");

            // --- POST 1 ---
            Post post1 = new Post();
            post1.setTitle("Mastering Real-Time WebSockets in Spring Boot");
            post1.setAuthor("Yasiru");
            post1.setCategory("Technology");
            post1.setTags(Arrays.asList("spring-boot", "websockets", "java", "real-time"));
            post1.setBody("WebSockets fundamentally change how we build modern web applications. Unlike traditional HTTP REST APIs where the client must constantly poll the server for updates, WebSockets open a persistent, bi-directional TCP connection. This allows the server to push updates to the React frontend the exact millisecond they happen.");
            postRepository.save(post1);

            // --- POST 2 ---
            Post post2 = new Post();
            post2.setTitle("Why React Component Extraction Matters");
            post2.setAuthor("John");
            post2.setCategory("Tutorial");
            post2.setTags(Arrays.asList("react", "frontend", "ui-ux", "clean-code"));
            post2.setBody("When building complex applications, it is incredibly easy to fall into the 'God Component' anti-pattern—a single file that handles API calls, state management, UI rendering, and user inputs all at once. By ruthlessly extracting our UI into smaller, focused components, we achieve true Separation of Concerns.");
            postRepository.save(post2);

            // --- POST 3 ---
            Post post3 = new Post();
            post3.setTitle("Avoiding Burnout: The Developer's Guide");
            post3.setAuthor("Dam");
            post3.setCategory("Lifestyle");
            post3.setTags(Arrays.asList("mental-health", "productivity", "career"));
            post3.setBody("Software engineering requires intense, prolonged periods of deep focus. However, pushing yourself to code for 12 hours straight is a fast track to burnout. True productivity comes from managing your energy, not just your time. Implementing strict commitment devices is essential for long-term career survival.");
            postRepository.save(post3);

            // --- POST 4 ---
            Post post4 = new Post();
            post4.setTitle("Securing APIs with JWT and Spring Security");
            post4.setAuthor("Yasiru");
            post4.setCategory("Technology");
            post4.setTags(Arrays.asList("security", "jwt", "spring-boot", "authentication"));
            post4.setBody("JSON Web Tokens (JWT) provide a stateless, scalable way to handle user authentication. By signing the token with a secret key on the backend, we can trust the claims within the token without needing to query the database on every single request. Always remember to set a reasonable expiration time to limit the blast radius of a stolen token.");
            postRepository.save(post4);

            // --- POST 5 ---
            Post post5 = new Post();
            post5.setTitle("Deep Dive into React's useEffect Hook");
            post5.setAuthor("John");
            post5.setCategory("Tutorial");
            post5.setTags(Arrays.asList("react", "hooks", "javascript"));
            post5.setBody("The useEffect hook is notoriously misunderstood. It isn't just a lifecycle method; it's a synchronization tool. It synchronizes your React state with external systems like APIs, WebSockets, or the DOM. Understanding the dependency array is crucial to preventing infinite re-render loops and memory leaks.");
            postRepository.save(post5);

            // --- POST 6 ---
            Post post6 = new Post();
            post6.setTitle("Ergonomics 101 for Remote Workers");
            post6.setAuthor("Dam");
            post6.setCategory("Lifestyle");
            post6.setTags(Arrays.asList("health", "wfh", "productivity"));
            post6.setBody("Your monitor should be at eye level, your feet flat on the floor, and your keyboard positioned so your arms form a 90-degree angle. Investing in a good chair and a mechanical keyboard isn't a luxury; it's preventative healthcare. Don't wait until you have RSI (Repetitive Strain Injury) to fix your posture.");
            postRepository.save(post6);

            // --- POST 7 ---
            Post post7 = new Post();
            post7.setTitle("Database Indexing: Speed Up Your Queries");
            post7.setAuthor("Yasiru");
            post7.setCategory("Technology");
            post7.setTags(Arrays.asList("database", "mysql", "performance", "sql"));
            post7.setBody("If your application is slow, it's probably your database. Adding an index to columns that are frequently used in WHERE clauses or JOIN conditions can change a query's execution time from 5 seconds to 5 milliseconds. However, don't over-index, as it slows down INSERT and UPDATE operations.");
            postRepository.save(post7);

            // --- POST 8 ---
            Post post8 = new Post();
            post8.setTitle("State Management: Context API vs Redux");
            post8.setAuthor("John");
            post8.setCategory("Opinion");
            post8.setTags(Arrays.asList("react", "redux", "architecture"));
            post8.setBody("Not every application needs Redux. For global themes, user authentication state, or simple configurations, React's native Context API is more than enough. Reserve Redux or Zustand for complex, rapidly changing state that requires strict predictability and time-travel debugging.");
            postRepository.save(post8);

            // --- POST 9 ---
            Post post9 = new Post();
            post9.setTitle("The Pomodoro Technique for Programmers");
            post9.setAuthor("Dam");
            post9.setCategory("Productivity");
            post9.setTags(Arrays.asList("time-management", "focus", "lifestyle"));
            post9.setBody("25 minutes of deep coding, followed by a 5-minute break. It sounds too simple to work, but forcing yourself to step away from a bug often allows your brain to process the solution in the background. It also prevents the dreaded 'zombie scrolling' when you hit a wall.");
            postRepository.save(post9);

            // --- POST 10 ---
            Post post10 = new Post();
            post10.setTitle("Monoliths vs Microservices: When to Switch?");
            post10.setAuthor("Yasiru");
            post10.setCategory("Opinion");
            post10.setTags(Arrays.asList("architecture", "microservices", "system-design"));
            post10.setBody("Don't start with microservices. A well-structured monolith is significantly easier to develop, deploy, and debug. You should only fracture your application into microservices when your engineering team is too large to work in a single codebase without stepping on each other's toes, or when specific parts of your app have drastically different scaling requirements.");
            postRepository.save(post10);


            // ==========================================
            // 🗣️ SEEDING NESTED COMMENTS
            // ==========================================

            // Thread 1 (On Post 1 - Yasiru's WebSocket Post)
            Comment p1c1 = new Comment();
            p1c1.setAuthor("John");
            p1c1.setText("This is exactly what I needed for the frontend integration! STOMP makes life so much easier.");
            Comment savedP1C1 = commentService.addComment(post1.getId(), p1c1);

            Comment p1c2 = new Comment();
            p1c2.setAuthor("Yasiru");
            p1c2.setText("Glad it helped, John! Let me know if you run into any CORS issues.");
            p1c2.setParentId(savedP1C1.getId()); // <-- This nests it under John's comment!
            Comment savedP1C2 = commentService.addComment(post1.getId(), p1c2);

            Comment p1c3 = new Comment();
            p1c3.setAuthor("Dam");
            p1c3.setText("I had a CORS issue yesterday, but adding the correct allowed origins in SecurityConfig fixed it.");
            p1c3.setParentId(savedP1C2.getId()); // <-- This makes it a 3rd-level deep reply!
            commentService.addComment(post1.getId(), p1c3);

            // Thread 2 (On Post 2 - John's React Post)
            Comment p2c1 = new Comment();
            p2c1.setAuthor("Dam");
            p2c1.setText("So true. God components make debugging a nightmare.");
            Comment savedP2C1 = commentService.addComment(post2.getId(), p2c1);

            Comment p2c2 = new Comment();
            p2c2.setAuthor("John");
            p2c2.setText("Exactly. Plus, breaking them down makes testing with Jest so much cleaner.");
            p2c2.setParentId(savedP2C1.getId());
            commentService.addComment(post2.getId(), p2c2);

            // Thread 3 (On Post 10 - Yasiru's Microservices Post)
            Comment p10c1 = new Comment();
            p10c1.setAuthor("Dam");
            p10c1.setText("People always over-engineer their startups from day 1. Start with a monolith!");
            commentService.addComment(post10.getId(), p10c1);

            System.out.println("✅ Database Seeding Complete! 10 Posts and Nested Comments Generated.");
        }
    }
}