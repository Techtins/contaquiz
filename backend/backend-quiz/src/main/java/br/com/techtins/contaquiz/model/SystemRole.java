package br.com.techtins.contaquiz.model;

public enum SystemRole {
    ADMIN(1L), ALUNO(2L);

    private final Long ID;

    SystemRole(Long ID) {
        this.ID = ID;
    }

    public Long getID() {
        return ID;
    }

    public static SystemRole valueOf(Long id) {
        for (SystemRole role : SystemRole.values()) {
            if (role.getID().equals(id)) {
                return role;
            }
        }
        return null;
    }
}
