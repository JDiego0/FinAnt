package com.finant.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from}")
    private String fromEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        String htmlContent = buildResetEmailHtml(userName, resetLink);

        try {
            Resend resend = new Resend(apiKey);
            CreateEmailOptions options = CreateEmailOptions.builder()
                    .from(fromEmail)
                    .to(toEmail)
                    .subject("Recuperar contraseña — FinAnt")
                    .html(htmlContent)
                    .build();

            resend.emails().send(options);
            log.info("Email de recuperación enviado a: {}", toEmail);

        } catch (ResendException e) {
            log.error("Error enviando email a {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Error al enviar el correo de recuperación");
        }
    }

    private String buildResetEmailHtml(String userName, String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 500px; margin: 40px auto; background: white;
                             border-radius: 12px; overflow: hidden;
                             box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
                .header { background: #4f46e5; padding: 32px; text-align: center; }
                .header h1 { color: white; margin: 0; font-size: 24px; }
                .header p { color: #c7d2fe; margin: 8px 0 0; }
                .body { padding: 32px; }
                .body p { color: #555; line-height: 1.6; }
                .btn { display: block; width: fit-content; margin: 24px auto;
                       background: #4f46e5; color: white; padding: 14px 32px;
                       border-radius: 8px; text-decoration: none; font-weight: bold; }
                .footer { padding: 16px 32px; background: #f9f9f9;
                          text-align: center; font-size: 12px; color: #999; }
                .warning { background: #fef3c7; border: 1px solid #fcd34d;
                           border-radius: 8px; padding: 12px; margin-top: 16px;
                           font-size: 13px; color: #92400e; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💰 FinAnt</h1>
                  <p>Recuperación de contraseña</p>
                </div>
                <div class="body">
                  <p>Hola <strong>%s</strong>,</p>
                  <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en FinAnt.</p>
                  <a href="%s" class="btn">Restablecer contraseña</a>
                  <div class="warning">
                    ⏱ Este enlace expira en <strong>30 minutos</strong>.<br>
                    Si no solicitaste esto, puedes ignorar este correo.
                  </div>
                </div>
                <div class="footer">
                  © 2024 FinAnt · Tu gestor financiero personal
                </div>
              </div>
            </body>
            </html>
            """.formatted(userName, resetLink);
    }
}