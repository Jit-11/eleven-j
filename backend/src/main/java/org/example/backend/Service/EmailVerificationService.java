package org.example.backend.Service;

import org.example.backend.Model.*;
import org.example.backend.repository.AppUserRepository;
import org.example.backend.repository.EmailVerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;

@Service
public class EmailVerificationService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final AppUserRepository users;
    private final EmailVerificationTokenRepository tokens;
    private final MailService mail;
    private final String verifyUrl;
    private final Duration tokenTtl;
    private final Duration resendCooldown;

    public EmailVerificationService(AppUserRepository users,
                                    EmailVerificationTokenRepository tokens,
                                    MailService mail,
                                    @Value("${app.verify-url}") String verifyUrl,
                                    @Value("${app.token-ttl-minutes:30}") long ttlMinutes,
                                    @Value("${app.resend-cooldown-seconds:60}") long cooldownSeconds) {
        this.users = users;
        this.tokens = tokens;
        this.mail = mail;
        this.verifyUrl = verifyUrl;
        this.tokenTtl = Duration.ofMinutes(ttlMinutes);
        this.resendCooldown = Duration.ofSeconds(cooldownSeconds);
    }

    @Transactional
    public void requestVerification(String rawEmail) {
        String email = rawEmail.trim().toLowerCase(Locale.ROOT);

        User user = users.findByEmailIgnoreCase(email).orElseGet(() -> users.save(new User(email)));

        if (user.getStatus() == UserStatus.VERIFIED) {
            return;
        }

        Optional<EmailVerificationToken> last = tokens.findFirstByUserOrderByCreatedAtDesc(user);

        if (last.isPresent() && last.get().getCreatedAt().plus(resendCooldown).isAfter(Instant.now())) {
            return;
        }

        String raw = newToken();
        tokens.save(new EmailVerificationToken(user, sha256(raw), Instant.now().plus(tokenTtl)));
        mail.sendVerification(email, verifyUrl + (verifyUrl.contains("?") ? "&" : "?") + "token=" + raw);
    }


    @Transactional
    public VerifyResult verify(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return VerifyResult.INVALID;
        }
        Optional<EmailVerificationToken> found = tokens.findByTokenHash(sha256(rawToken.trim()));
        if (found.isEmpty()) {
            return VerifyResult.INVALID;
        }
        EmailVerificationToken token = found.get();
        Instant now = Instant.now();

        if (token.getUsedAt() != null) {
            return VerifyResult.ALREADY_USED;
        }
        if (token.getExpiresAt().isBefore(now)) {
            return VerifyResult.EXPIRED;
        }
        token.setUsedAt(now);
        User user = token.getUser();
        user.setStatus(UserStatus.VERIFIED);
        user.setVerifiedAt(now);
        return VerifyResult.SUCCESS;
    }

    private static String newToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
