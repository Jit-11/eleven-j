package org.example.backend.Model;


import jakarta.persistence.*;
import jakarta.persistence.GenerationType;


import java.time.Instant;


@Entity
@Table(name = "email_verification_token")
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user;

    /** SHA-256 hex of the token sent by email. The raw token is never stored. */
    @Column(name = "token_hash", nullable = false, length = 64)
    private String tokenHash;

    @Column(name="expires_at",nullable = false)
    private Instant expiresAt;

    @Column(name="used_at")
    private Instant usedAt;

    @Column(name="created_at",nullable = false, updatable = false)
    private Instant createdAt;

    protected EmailVerificationToken() { }

    public EmailVerificationToken(User user, String tokenHash, Instant expiresAt) {
        this.user = user;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getTokenHash() { return tokenHash; }
    public Instant getExpiresAt() { return expiresAt; }
    public Instant getUsedAt() { return usedAt; }
    public void setUsedAt(Instant usedAt) { this.usedAt = usedAt; }
    public Instant getCreatedAt() { return createdAt; }
}
