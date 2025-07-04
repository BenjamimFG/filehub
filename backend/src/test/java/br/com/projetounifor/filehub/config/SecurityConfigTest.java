package br.com.projetounifor.filehub.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@ExtendWith(MockitoExtension.class)
class SecurityConfigTest {

    @Mock
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Mock
    private AuthenticationConfiguration authenticationConfiguration;

    @Mock
    private HttpSecurity httpSecurity;

    @InjectMocks
    private SecurityConfig securityConfig;

    @Test
    void filterChain_ShouldConfigureCsrfAndFrameOptions() throws Exception {
        // Act
        SecurityFilterChain filterChain = securityConfig.filterChain(httpSecurity);

        // Assert
        verify(httpSecurity).csrf(any());
        verify(httpSecurity).headers(any());
        verify(httpSecurity).authorizeHttpRequests(any());
        verify(httpSecurity).addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        verify(httpSecurity).build();
        assertNotNull(filterChain, "O SecurityFilterChain não deve ser nulo");
    }

    @Test
    void authenticationManager_ShouldReturnAuthenticationManagerFromConfiguration() throws Exception {
        // Arrange
        AuthenticationManager mockAuthManager = mock(AuthenticationManager.class);
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(mockAuthManager);

        // Act
        AuthenticationManager result = securityConfig.authenticationManager(authenticationConfiguration);

        // Assert
        assertEquals(mockAuthManager, result, "Deve retornar o AuthenticationManager da configuração");
        verify(authenticationConfiguration, times(1)).getAuthenticationManager();
        verifyNoMoreInteractions(authenticationConfiguration);
    }

    @Test
    void passwordEncoder_ShouldReturnBCryptPasswordEncoder() {
        // Act
        PasswordEncoder passwordEncoder = securityConfig.passwordEncoder();

        // Assert
        assertTrue(passwordEncoder instanceof BCryptPasswordEncoder, 
                "O PasswordEncoder deve ser uma instância de BCryptPasswordEncoder");

        // Testa a funcionalidade do encoder
        String rawPassword = "testPassword";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        assertNotNull(encodedPassword, "A senha codificada não deve ser nula");
        assertTrue(passwordEncoder.matches(rawPassword, encodedPassword), 
                "A senha codificada deve corresponder à senha original");
    }
}