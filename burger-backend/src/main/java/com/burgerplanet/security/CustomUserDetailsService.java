package com.burgerplanet.security;

import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.burgerplanet.repository.UsuarioRepository;
import com.burgerplanet.model.Usuario;

import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UsuarioRepository repo;
    public CustomUserDetailsService(UsuarioRepository repo){ this.repo = repo; }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = repo.findByUsername(username);
        if(u==null) throw new UsernameNotFoundException("Usuario no encontrado");
        return new User(u.getUsername(), u.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_"+u.getRol())));
    }
}
