package io.github.rafaelouverney.backend.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMail;

    @Autowired
    private TemplateEngine templateEngine;

    @Async
    public void enviarEmailSimples(String para, String assunto, String mensagem){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(para);
        message.setSubject(assunto);
        message.setText(mensagem);
        javaMail.send(message);
    }

    public void emailTemplate(String para, String assunto, Context variaveisEmail, String arquivoTemplate){
        String process = templateEngine.process(arquivoTemplate, variaveisEmail);

        MimeMessage message = javaMail.createMimeMessage();
        MimeMessageHelper helper;
        try{
            helper = new MimeMessageHelper(message, true);
            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(process, true);
        }catch(Exception e){
            e.printStackTrace();
        }

        javaMail.send(message);
    }
}
