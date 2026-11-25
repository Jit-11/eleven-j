package org.example.backend.Controller;


import org.example.backend.Service.EmailVerificationService;
import org.example.backend.Service.VerifyResult;
import org.example.backend.dto.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
    @RequestMapping("/api/v1")
public class EmailController {

    private final EmailVerificationService service;

    public EmailController(EmailVerificationService service) {
        this.service = service;
    }

    @PostMapping("/subscribe")
    public ResponseEntity<MessageResponse> subscribe(@Valid @RequestBody SubscribeRequest request) {
        service.requestVerification(request.email());
        return ResponseEntity.accepted()
                .body(new MessageResponse("If this address can be verified, we sent a link to it."));
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@Valid @RequestBody VerifyRequest request) {
        VerifyResult result = service.verify(request.token());
        return switch (result) {
            case SUCCESS -> ResponseEntity.ok(new VerifyResponse(result.name(), "Your email is verified."));
            case ALREADY_USED -> ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new VerifyResponse(result.name(), "This link was already used."));
            case EXPIRED -> ResponseEntity.status(HttpStatus.GONE)
                    .body(new VerifyResponse(result.name(), "This link has expired. Request a new one."));
            case INVALID -> ResponseEntity.badRequest()
                    .body(new VerifyResponse(result.name(), "This link is not valid."));
        };
    }
}
