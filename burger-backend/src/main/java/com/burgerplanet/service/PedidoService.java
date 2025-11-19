package com.burgerplanet.service;

import org.springframework.stereotype.Service;
import com.burgerplanet.repository.PedidoRepository;
import com.burgerplanet.model.Pedido;

import java.util.List;

@Service
public class PedidoService {
    private final PedidoRepository repo;
    public PedidoService(PedidoRepository repo){ this.repo = repo; }

    public Pedido save(Pedido p){ return repo.save(p); }
    public List<Pedido> findAll(){ return repo.findAll(); }
    public List<Pedido> findByEstado(String estado){ return repo.findByEstado(estado); }
    public List<Pedido> findByCliente(String cliente){ return repo.findByClienteContainingIgnoreCase(cliente); }
    public Pedido findById(Long id){ return repo.findById(id).orElse(null); }
}
