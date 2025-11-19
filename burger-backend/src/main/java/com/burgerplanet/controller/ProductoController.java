package com.burgerplanet.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.burgerplanet.repository.ProductoRepository;
import com.burgerplanet.model.Producto;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository repo;

    public ProductoController(ProductoRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Producto> all() {
        return repo.findAll();
    }
}
