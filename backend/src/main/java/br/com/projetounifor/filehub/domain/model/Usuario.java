package br.com.projetounifor.filehub.domain.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import br.com.projetounifor.filehub.domain.model.enums.Perfil;

import java.util.Collection;
import java.util.Collections;
import java.util.Set;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Usuario implements UserDetails {
	private static final long serialVersionUID = 1L;
	
	@Id @GeneratedValue
    private Long id;
    private String nome;
    private String email;
    private String username;
    private String senha;

    @Enumerated(EnumType.STRING)
    private Perfil perfil;

    @ManyToMany(mappedBy = "usuarios")
    private Set<Projeto> projetos;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // ou retornar perfil como authority
    }

    @Override public String getPassword() { return senha; }
    @Override public String getUsername() { return username; }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}

