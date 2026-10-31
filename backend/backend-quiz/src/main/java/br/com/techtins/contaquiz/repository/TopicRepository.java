package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.Topic;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TopicRepository implements PanacheRepositoryBase<Topic, Long> {

    public PanacheQuery<Topic> findByDisciplineId(Long disciplineId) {
        return find("discipline.id", disciplineId);
    }

    public PanacheQuery<Topic> findRootTopics() {
        return find("parentTopic IS NULL");
    }

    public PanacheQuery<Topic> findRootTopicsByDisciplineId(Long disciplineId) {
        return find("parentTopic IS NULL AND discipline.id = ?1", disciplineId);
    }

    public PanacheQuery<Topic> findByNameContainingIgnoreCase(String filter) {
        return find("LOWER(name) LIKE LOWER(?1)", "%" + filter + "%");
    }
}
