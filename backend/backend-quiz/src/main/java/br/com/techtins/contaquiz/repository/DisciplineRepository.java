package br.com.techtins.contaquiz.repository;

import br.com.techtins.contaquiz.model.Discipline;
import io.quarkus.hibernate.orm.panache.PanacheQuery;
import io.quarkus.hibernate.orm.panache.PanacheRepositoryBase;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DisciplineRepository implements PanacheRepositoryBase<Discipline, Long> {

    public Discipline findByName(String name) {
        return find("name", name).firstResult();
    }

    public PanacheQuery<Discipline> findByFilter(String filter, Boolean active) {
        StringBuilder query = new StringBuilder("1=1");
        java.util.Map<String, Object> params = new java.util.HashMap<>();

        if (filter != null && !filter.isBlank()) {
            query.append(" AND LOWER(name) LIKE LOWER(:filter)");
            params.put("filter", "%" + filter + "%");
        }

        if (active != null) {
            query.append(" AND active = :active");
            params.put("active", active);
        }

        return find(query.toString(), params);
    }
}
