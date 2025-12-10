package com.petmatch.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String to, String token) {
        log.info("Sending password reset email to: {}", to);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Recuperación de Contraseña - PetMatch");
            message.setText("Para resetear tu contraseña, haz clic en el siguiente enlace: \n"
                    + frontendUrl + "/reset-password?token=" + token); // URL del frontend
            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Error sending password reset email to: {}", to, e);
        }
    }
}
