package com.burgerplanet.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.burgerplanet.model.Producto;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
