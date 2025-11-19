package com.burgerplanet.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.burgerplanet.model.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByEstado(String estado);
    List<Pedido> findByClienteContainingIgnoreCase(String cliente);
}
