package com.burgerplanet.controller;

import com.burgerplanet.model.Usuario;
import com.burgerplanet.repository.UsuarioRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "${app.frontend.origin}", allowCredentials = "true")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UsuarioRepository usuarioRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authManager,
            UsuarioRepository usuarioRepo,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.authManager = authManager;
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
    }

    // ======================= LOGIN ============================
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body, HttpServletRequest req){
        String username = body.get("username");
        String password = body.get("password");

        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        return Map.of("ok", true, "username", username);
    }

    // ======================= LOGOUT ============================
    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletRequest req, HttpServletResponse res){
        if(req.getSession(false)!=null){
            req.getSession().invalidate();
        }
        return Map.of("ok", true);
    }

    // ======================= REGISTRO ============================
    @PostMapping("/register")
    public Usuario register(@RequestBody Usuario usuario) {

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol("ADMIN"); // puedes cambiarlo a USER

        return usuarioRepo.save(usuario);
    }
}
