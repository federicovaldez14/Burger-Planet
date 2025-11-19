package com.burgerplanet.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.burgerplanet.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsername(String username);
}
