package br.com.projetounifor.filehub.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.web.servlet.MockMvc;

import br.com.projetounifor.filehub.config.JWTUtil;

@WebMvcTest(AuthenticationController.class)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private JWTUtil jwtUtil;

    @Test
    void login_WhenAuthenticationSucceeds_ShouldReturnToken() throws Exception {
        // Arrange
        String username = "testUser";
        String password = "testPassword";
        String token = "mockedToken";
        Authentication authentication = mock(Authentication.class);

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtUtil.gerarToken(username)).thenReturn(token);

        String requestBody = String.format("{\"username\": \"%s\", \"senha\": \"%s\"}", username, password);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token));

        verify(authManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtil, times(1)).gerarToken(username);
        verifyNoMoreInteractions(authManager, jwtUtil);
    }

    @Test
    void login_WhenAuthenticationFails_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        String username = "testUser";
        String password = "wrongPassword";

        when(authManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new AuthenticationException("Auth failed") {});

        String requestBody = String.format("{\"username\": \"%s\", \"senha\": \"%s\"}", username, password);

        // Act & Assert
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Usuário ou senha inválidos"));

        verify(authManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verifyNoInteractions(jwtUtil);
    }
}