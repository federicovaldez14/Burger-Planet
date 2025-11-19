package com.burgerplanet.controller;

import org.springframework.web.bind.annotation.*;
import com.burgerplanet.service.PedidoService;
import com.burgerplanet.model.Pedido;
import com.burgerplanet.model.ItemPedido;
import com.burgerplanet.model.Producto;
import com.burgerplanet.repository.ProductoRepository;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "${app.frontend.origin}", allowCredentials = "true")
public class PedidoController {

    private final PedidoService service;
    private final ProductoRepository productoRepo;

    public PedidoController(PedidoService service, ProductoRepository productoRepo) {
        this.service = service;
        this.productoRepo = productoRepo;
    }

    // ===============================
    //         CREAR PEDIDO
    // ===============================
    @PostMapping
    public Pedido create(@RequestBody Pedido pedido) {

        for (ItemPedido item : pedido.getItems()) {

            // 1. Buscar el producto real en DB
            Producto p = productoRepo.findById(item.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + item.getProductoId()));

            // 2. Completar datos correctos
            item.setNombreProducto(p.getNombre());
            item.setSubtotal(p.getPrecio() * item.getCantidad());
        }

        return service.save(pedido);
    }

    // ===============================
    //         LISTAR PEDIDOS
    // ===============================
    @GetMapping
    public List<Pedido> list(@RequestParam(required=false) String estado,
                             @RequestParam(required=false) String cliente){
        if (estado != null) return service.findByEstado(estado.toUpperCase());
        if (cliente != null) return service.findByCliente(cliente);
        return service.findAll();
    }

    // ===============================
    //      CAMBIAR ESTADO PEDIDO
    // ===============================
    @PutMapping("/{id}/estado")
    public Pedido cambiarEstado(@PathVariable Long id, @RequestParam String estado){
        Pedido p = service.findById(id);
        if (p == null) return null;

        p.setEstado(estado.toUpperCase());
        return service.save(p);
    }
}
