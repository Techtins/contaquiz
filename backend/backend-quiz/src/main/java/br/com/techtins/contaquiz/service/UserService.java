package br.com.techtins.contaquiz.service;

import java.util.List;

import br.com.techtins.contaquiz.dto.user.UserRequest;
import br.com.techtins.contaquiz.exception.BusinessException;
import br.com.techtins.contaquiz.exception.ResourceNotFoundException;
import br.com.techtins.contaquiz.model.User;
import br.com.techtins.contaquiz.repository.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class UserService {

    @Inject
    private UserRepository userRepository;

    public User findById(Long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + id);
        }
        return user;
    }

    public User findByEmail(String email) {
        User user = userRepository.findByEmail(email).firstResult();
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + email);
        }
        return user;
    }

    public List<User> findAll() {
        return userRepository.findAll().list();
    }

    @Transactional
    public User create(User user) {
        if (userRepository.findByEmail(user.getEmail()).firstResult() != null) {
            throw new BusinessException("Email já cadastrado");
        }
        userRepository.persist(user);
        return user;
    }

    @Transactional
    public void update(Long id, UserRequest dto) {
        User existingUser = userRepository.findById(id);
        if (existingUser == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + id);
        }

        User userWithSameEmail = userRepository.findByEmail(dto.email()).firstResult();
        if (userWithSameEmail != null && !userWithSameEmail.getId().equals(id)) {
            throw new BusinessException("Email já cadastrado");
        }

        existingUser.setName(dto.name());
        existingUser.setEmail(dto.email());

        if (dto.password() != null && !dto.password().isBlank()) {
            existingUser.setPasswordHash(dto.password());
        }

        existingUser.setSystemRole(dto.role());
    }

    @Transactional
    public void delete(Long id) {
        User user = userRepository.findById(id);
        if (user == null) {
            throw new ResourceNotFoundException("Usuário não encontrado: " + id);
        }
        userRepository.deleteById(id);
    }
}
