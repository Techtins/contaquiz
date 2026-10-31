package br.com.techtins.contaquiz.service;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class HashService {
    
    private static final Logger LOGGER = Logger.getLogger(HashService.class.getName());

    private final Argon2 argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);

    @ConfigProperty(name = "app.security.argon2.iterations", defaultValue = "3")
    int iterations;

    @ConfigProperty(name = "app.security.argon2.memory", defaultValue = "65536")
    int memory;

    @ConfigProperty(name = "app.security.argon2.parallelism", defaultValue = "4")
    int parallelism;

    @ConfigProperty(name = "app.security.argon2.hash-length", defaultValue = "32")
    int hashLength;

    @ConfigProperty(name = "app.security.argon2.salt-length", defaultValue = "16")
    int saltLength;

    public String Argon2(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Senha não pode ser nula ou vazia");
        }

        try {
            LOGGER.log(Level.FINE, "Gerando hash Argon2id com " +
                    "iterations=" + iterations +
                    ", memory=" + memory + "KB" +
                    ", parallelism=" + parallelism);
            String hash = argon2.hash(iterations, memory, parallelism, password.toCharArray());
            
            LOGGER.log(Level.FINE, "Hash Argon2id gerado com sucesso");
            return hash;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao gerar hash Argon2id: " + e.getMessage());
            throw new RuntimeException("Falha ao gerar hash de segurança", e);
        }
    }

    public boolean verifyArgon2(String password, String hashedPassword) {
        if (password == null || hashedPassword == null) {
            throw new IllegalArgumentException("Senha e hash não podem ser nulos");
        }

        try {
            LOGGER.log(Level.FINE, "Verificando senha Argon2id");
            
            boolean isValid = argon2.verify(hashedPassword, password.toCharArray());
            
            if (isValid) {
                LOGGER.log(Level.FINE, "Senha Argon2id verificada com sucesso");
            } else {
                LOGGER.log(Level.FINE, "Falha na verificação de senha Argon2id");
            }
            
            return isValid;

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Erro ao verificar hash Argon2id: " + e.getMessage());
            throw new RuntimeException("Falha ao verificar hash de segurança", e);
        }
    }
}
