package com.finant.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name:FinAnt}")
    private String fromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ── Bienvenida ───────────────────────────────────────────────────
    public void sendWelcomeEmail(String toEmail, String userName) {
        String dashboardLink = frontendUrl + "/dashboard";
        send(toEmail, "¡Bienvenido a FinAnt! 🐜", buildWelcomeHtml(userName, dashboardLink));
    }

    // ── Recuperación ─────────────────────────────────────────────────
    public void sendPasswordResetEmail(String toEmail, String userName, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        send(toEmail, "Recuperar contraseña — FinAnt", buildResetHtml(userName, resetLink));
    }

    // ── Método base ──────────────────────────────────────────────────
    private void send(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, fromName);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email '{}' enviado a: {}", subject, to);
        } catch (Exception e) {
            log.error("Error al enviar email a {}: {}", to, e.getMessage());
            throw new RuntimeException("Error al enviar el correo.");
        }
    }

    // ── Templates ────────────────────────────────────────────────────
    private String buildWelcomeHtml(String userName, String dashboardLink) {
        String body = """
            <p style="color:#374151;font-size:15px;margin:0 0 12px;">
              Hola <strong>%s</strong>,
            </p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 20px;">
              Tu cuenta ha sido creada exitosamente. Ya puedes empezar a gestionar
              tus finanzas personales de forma inteligente con <strong>FinAnt</strong>.
            </p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;
                        padding:16px 20px;margin:0 0 24px;">
              <p style="margin:0;font-size:13px;color:#15803d;font-weight:600;">
                ✅ Registro exitoso
              </p>
              <p style="margin:6px 0 0;font-size:13px;color:#166534;">
                Tienes acceso a tus cuentas de Efectivo, Ahorros e Inversiones.
              </p>
            </div>
            <div style="text-align:center;">
              <a href="%s"
                style="display:inline-block;background:#4f46e5;color:white;padding:13px 30px;
                       border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
                Ir a mi dashboard →
              </a>
            </div>
            """.formatted(userName, dashboardLink);
        return baseTemplate("Bienvenido a FinAnt 🐜", body);
    }

    private String buildResetHtml(String userName, String resetLink) {
        String body = """
            <p style="color:#374151;font-size:15px;margin:0 0 12px;">
              Hola <strong>%s</strong>,
            </p>
            <p style="color:#6b7280;font-size:14px;line-height:1.7;margin:0 0 24px;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta.
            </p>
            <div style="text-align:center;margin:0 0 24px;">
              <a href="%s"
                style="display:inline-block;background:#4f46e5;color:white;padding:13px 30px;
                       border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
                Restablecer contraseña →
              </a>
            </div>
            <div style="background:#fefce8;border:1px solid #fde68a;border-radius:10px;
                        padding:14px 18px;">
              <p style="margin:0;font-size:13px;color:#92400e;">
                ⏱ Este enlace expira en <strong>30 minutos</strong>.<br>
                Si no solicitaste esto, ignora este correo.
              </p>
            </div>
            """.formatted(userName, resetLink);
        return baseTemplate("Recuperación de contraseña", body);
    }

    private String baseTemplate(String titulo, String contenido) {
        return """
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width,initial-scale=1.0">
            </head>
            <body style="margin:0;padding:0;background:#f8fafc;
                         font-family:'Segoe UI',Arial,sans-serif;">
              <table width="100%%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;padding:40px 16px;">
                <tr><td align="center">
                  <table width="540" cellpadding="0" cellspacing="0"
                    style="background:white;border-radius:16px;overflow:hidden;
                           box-shadow:0 4px 24px rgba(0,0,0,0.07);max-width:100%%;">
                    <tr>
                      <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);
                                 padding:28px 32px;text-align:center;">
                        <div style="font-size:32px;margin-bottom:6px;">🐜</div>
                        <h1 style="color:white;margin:0;font-size:20px;font-weight:700;">
                          FinAnt
                        </h1>
                        <p style="color:#c7d2fe;margin:4px 0 0;font-size:12px;">%s</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:28px 32px;">%s</td>
                    </tr>
                    <tr>
                      <td style="background:#f9fafb;padding:14px 32px;
                                 text-align:center;border-top:1px solid #e5e7eb;">
                        <p style="margin:0;font-size:11px;color:#9ca3af;">
                          © 2024 FinAnt · Tu gestor financiero personal
                        </p>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>
            </body>
            </html>
            """.formatted(titulo, contenido);
    }
}