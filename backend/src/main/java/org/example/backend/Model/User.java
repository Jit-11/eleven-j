package org.example.backend.Model;

import java.util.*;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="email",nullable = false, length = 254)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(name="status",nullable = false, length = 20)
    private UserStatus status = UserStatus.PENDING;

    @Column(name="verified_at")
    private Instant verifiedAt;

    @Column(name="created_at",nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name="updated_at",nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "user")
    private List<EmailVerificationToken> tokens = new ArrayList<>();

    protected User() { }

    public User(String email) { this.email = email; }

    @PrePersist
    void onCreate() { createdAt = updatedAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(Instant verifiedAt) { this.verifiedAt = verifiedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
