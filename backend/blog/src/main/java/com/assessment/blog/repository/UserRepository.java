package com.assessment.blog.repository;

import com.assessment.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Spring Data JPA  writes the SQL query for this based on the method name!
    Optional<User> findByUsername(String username);
}