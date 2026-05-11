---



## Associate Software Engineer Assessment For E.W. Balasuriya Group of Companies.



---



# LiveBlog: Real-Time Interactive Blog Platform



LiveBlog is a full-stack, real-time blogging platform engineered with Spring Boot and React. It goes beyond standard CRUD operations by featuring robust JWT authentication, complex recursive comment trees, and live WebSocket integration for real-time presence tracking and instantaneous user notifications.



## 🎥 Application Demo



**[Click here to watch the full application demo on Google Drive](https://drive.google.com/file/d/1ps9Pz9agZkFxwWRy72PK0KTQxlrr2GjK/view?usp=sharing)**

*(This video demonstrates the real-time presence tracking, recursive comment engine, and live WebSocket notifications in action.)*



---



## 🚀 Core Architectural Features



* **Real-Time Presence Tracking (WebSockets):** Utilizing STOMP over SockJS, the application tracks and broadcasts live reader counts globally (Home Feed) and per-post. It handles chaotic network disconnects gracefully .

* **Live Notifications & Updates:** New comments are instantly broadcasted to active readers to trigger UI refreshes without polling. Furthermore, private WebSocket channels push slide-in "Toast" notifications directly to post authors when their content receives engagement(comments).

* **Recursive Comment Engine:** Users can leave nested replies to comments infinitely. This is managed efficiently via self-referential database relationships and recursive React component rendering.

* **Advanced Filtering & Pagination:** Server-side pagination and dynamic filtering (by category, tag, and keyword search) utilizing Spring Data JPA's `Pageable` interface, complete with robust edge-case handling on the frontend.

* **Enterprise Security & Data Integrity:** Stateless JWT authentication securing API endpoints, custom route guards in React, and cascading database deletions to prevent orphaned rows when deleting posts.



## 🛠️ Technology Stack



**Backend**



* Java 17

* Spring Boot 3

* Spring Security (JWT Authentication)

* Spring WebSockets (STOMP messaging)

* Spring Data JPA / Hibernate

* MySQL



**Frontend**



* React (Vite)

* React Router DOM

* Axios (with Interceptors for JWT injection)

* SockJS & StompJS

* CSS Variables for custom theming



---



## ⚙️ Setup Instructions



### Prerequisites



* Java Development Kit (JDK) 17+

* Node.js (v18+)

* MySQL Server (Running on default port 3306)



### 1. Database Configuration



Open MySQL Workbench or your terminal and create a new, empty database:



```sql

CREATE DATABASE blog_assessment;



```



Ensure your `src/main/resources/application.properties` file reflects your local MySQL credentials:



```properties

spring.datasource.url=jdbc:mysql://localhost:3306/blog_assessment

spring.datasource.username=root

spring.datasource.password=your_password



```



### 2. Running the Backend



1. Open a terminal and navigate to the backend directory.

2. Run the application using the Maven wrapper:



```bash

./mvnw spring-boot:run



```



> **🌱 Note on Seed Data:** The application includes a `DataSeeder` component. On the very first run (when the database is empty), it will automatically generate 3 user accounts (**Yasiru**, **John**, **Dam** - all with the password `password123`) and inject 10 high-quality posts with nested comment threads so you can immediately test filtering, pagination, and recursive rendering.



### 3. Running the Frontend



1. Open a separate terminal and navigate to the frontend directory.

2. Install the necessary dependencies:



```bash

npm install



```



3. Start the Vite development server:



```bash

npm run dev



```



4. Open your browser and navigate to `http://localhost:5173`.



---

---

## 📮 API Testing with Postman

During the backend development phase, **Postman** was utilized extensively to design, test, and validate the RESTful API endpoints independently of the frontend.

If you wish to test the APIs directly:

1. **Authentication:** First, send a `POST` request to `/api/auth/login` with valid user credentials (e.g., username: `Yasiru`, password: `password123`).
2. **Authorization:** Copy the JWT string returned in the response.
3. **Protected Routes:** For all `POST`, `PUT`, and `DELETE` requests, go to the **Authorization** tab in Postman, select **Bearer Token**, and paste the JWT.
4. **Pagination & Filtering:** You can test the robust `GET` endpoints by passing query parameters directly in Postman (e.g., `GET /api/posts?page=0&size=5&category=Technology`).

---


## 🧪 How to Demo the Real-Time Features (Local Testing)



If you wish to test the WebSockets locally, you will need two browser windows:



1. Open your main browser and log in as **Yasiru**.

2. Open an **Incognito Window** and log in as **Dam**.

3. **Test Presence:** Navigate to a specific post in the Incognito window. Watch the "Live Viewers" badge instantly increment on the Home Feed and Post Detail page in your main browser. Close the Incognito window to watch it instantly decrement.

4. **Test Notifications:** While logged in as Dam, leave a comment on Yasiru's post. A live notification will instantly slide onto Yasiru's screen.



---



## 🏗️ Architectural Notes, Limitations & Future Improvements



While this application fulfills all core requirements, a production-ready environment would necessitate the following upgrades:



### 1. Horizontal Scalability (The WebSocket Limitation)



**Current State:** The `WebSocketPresenceTracker` relies on an in-memory `ConcurrentHashMap` to track live viewers.

**Improvement:** If deployed across multiple server instances via a load balancer, Server A would not know about users connected to Server B. We would need to extract presence tracking and pub/sub messaging to an external **Redis** instance to sync WebSocket events across distributed microservices.



### 2. JWT Storage Security



**Current State:** The React frontend stores the JWT in `localStorage`.

**Improvement:** While standard for development and tutorials, this makes the token vulnerable to Cross-Site Scripting (XSS) attacks. A production refactor would involve storing the JWT in a secure, `HttpOnly` browser cookie, preventing JavaScript access entirely.



### 3. Pagination Optimization for Comments



**Current State:** The Posts feed utilizes strict server-side pagination, but the recursive nature of the comment tree currently fetches a large chunk of comments at once.

**Improvement:** If a post goes viral (10,000+ comments), this single query would bottleneck the database. We would implement "Cursor-based Pagination" or a "Load More Replies" UI pattern for nested child comments to defer database load until the user actively expands a thread.
