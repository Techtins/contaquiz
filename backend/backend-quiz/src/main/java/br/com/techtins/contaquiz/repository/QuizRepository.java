package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.Quiz;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QuizRepository implements PanacheRepositoryBase<Quiz, Long> {

    public Quiz findByTitle(String title) {
        return find("title", title).firstResult();
    }
}
