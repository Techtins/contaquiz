package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.User;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserRepository implements PanacheRepositoryBase<User, Long> {
    
    public PanacheQuery<User> findByEmail(String email) {
        return find("email", email);
    }
}
