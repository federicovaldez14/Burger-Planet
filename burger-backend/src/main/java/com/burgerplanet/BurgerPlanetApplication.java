package com.burgerplanet;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.burgerplanet.model.Producto;
import com.burgerplanet.model.Usuario;
import com.burgerplanet.repository.ProductoRepository;
import com.burgerplanet.repository.UsuarioRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class BurgerPlanetApplication {

    public static void main(String[] args) {
        SpringApplication.run(BurgerPlanetApplication.class, args);
    }

    @Bean
    CommandLineRunner init(ProductoRepository productoRepo, UsuarioRepository usuarioRepo, BCryptPasswordEncoder encoder) {
        return args -> {
            if (productoRepo.count() == 0) {
                productoRepo.save(new Producto(null, "Burger Clásica", "Hamburguesas", "Hamburguesa clásica con queso", 12000.0, "/images/hclasica.png"));
                productoRepo.save(new Producto(null, "Papas Fritas", "Acompañamientos", "Porción de papas", 5000.0, "/images/papas.png"));
                productoRepo.save(new Producto(null, "Combo Planetario", "Combos", "Combo con bebida y papas", 20000.0, "/images/planetaria.png"));
            }
            if (usuarioRepo.findByUsername("empleado") == null) {
                Usuario u = new Usuario();
                u.setUsername("empleado");
                u.setPassword(encoder.encode("password123"));
                u.setRol("EMPLEADO");
                usuarioRepo.save(u);
                System.out.println("Usuario inicial creado: empleado / password123");
            }
        };
    }
}
