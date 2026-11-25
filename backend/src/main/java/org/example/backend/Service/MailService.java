package org.example.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender sender;
    private final String from;

    public MailService(JavaMailSender sender, @Value("${spring.mail.username}") String from) {
        this.sender = sender;
        this.from = from;
    }

    /** Throws org.springframework.mail.MailException if sending fails. */
    public void sendVerification(String to, String link) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Verify your email for eleven-j");
        msg.setText("Hi!\n\nConfirm your email by opening this link:\n" + link
                + "\n\nIf you didn't ask for this, you can ignore this email.");
        sender.send(msg);
    }
}
