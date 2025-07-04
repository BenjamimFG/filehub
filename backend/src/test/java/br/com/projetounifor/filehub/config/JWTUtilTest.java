package br.com.projetounifor.filehub.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.security.Key;
import java.util.Date;

import javax.crypto.SecretKey;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.InvalidKeyException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;

class JWTUtilTest {

    private JWTUtil jwtUtil;
    private SecretKey secretKey;
    private final long EXPIRATION_TIME = 86400000; // 24 horas em milissegundos
    private final String TEST_USERNAME = "testUser";

    @BeforeEach
    void setUp() {
        jwtUtil = new JWTUtil();
        // Reflexão ou manipulação direta não é necessária, usamos a mesma lógica de geração de chave
        secretKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
    }

    @Test
    void gerarToken_ShouldGenerateValidTokenWithCorrectUsernameAndExpiration() throws SignatureException, ExpiredJwtException, UnsupportedJwtException, MalformedJwtException, IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
        // Act
        String token = jwtUtil.gerarToken(TEST_USERNAME);

        // Assert
        assertNotNull(token, "O token não deve ser nulo");
        String extractedUsername = Jwts.parserBuilder()
                .setSigningKey((byte[]) jwtUtil.getClass().getDeclaredField("secretKey").get(jwtUtil))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        assertEquals(TEST_USERNAME, extractedUsername, "O username no token deve ser igual ao fornecido");

        Date expiration = Jwts.parserBuilder()
                .setSigningKey((byte[]) jwtUtil.getClass().getDeclaredField("secretKey").get(jwtUtil))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        assertTrue(expiration.after(new Date()), "A data de expiração deve ser futura");
        assertTrue(expiration.before(new Date(System.currentTimeMillis() + EXPIRATION_TIME + 1000)), 
                "A data de expiração deve estar dentro do tempo esperado");
    }

    @Test
    void obterUsername_ValidToken_ShouldReturnCorrectUsername() throws Exception {
        // Arrange
        String token = Jwts.builder()
                .setSubject(TEST_USERNAME)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith((Key) jwtUtil.getClass().getDeclaredField("secretKey").get(jwtUtil))
                .compact();

        // Act
        String username = jwtUtil.obterUsername(token);

        // Assert
        assertEquals(TEST_USERNAME, username, "O username extraído deve ser igual ao definido no token");
    }

    @Test
    void obterUsername_InvalidToken_ShouldThrowJwtException() throws Exception {
        // Arrange
        SecretKey wrongKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String invalidToken = Jwts.builder()
                .setSubject(TEST_USERNAME)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(wrongKey)
                .compact();

        // Act & Assert
        assertThrows(io.jsonwebtoken.JwtException.class, () -> jwtUtil.obterUsername(invalidToken),
                "Deve lançar JwtException para token com assinatura inválida");
    }

    @Test
    void validarToken_ValidToken_ShouldReturnTrue() {
        // Arrange
        String token = jwtUtil.gerarToken(TEST_USERNAME);

        // Act
        boolean isValid = jwtUtil.validarToken(token);

        // Assert
        assertTrue(isValid, "Token válido deve retornar true");
    }

    @Test
    void validarToken_ExpiredToken_ShouldReturnFalse() throws InvalidKeyException, IllegalArgumentException, IllegalAccessException, NoSuchFieldException, SecurityException {
        // Arrange
        String expiredToken = Jwts.builder()
                .setSubject(TEST_USERNAME)
                .setExpiration(new Date(System.currentTimeMillis() - 1000)) // Expirado
                .signWith((Key) jwtUtil.getClass().getDeclaredField("secretKey").get(jwtUtil))
                .compact();

        // Act
        boolean isValid = jwtUtil.validarToken(expiredToken);

        // Assert
        assertFalse(isValid, "Token expirado deve retornar false");
    }

    @Test
    void validarToken_InvalidSignature_ShouldReturnFalse() {
        // Arrange
        SecretKey wrongKey = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS512);
        String invalidToken = Jwts.builder()
                .setSubject(TEST_USERNAME)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(wrongKey)
                .compact();

        // Act
        boolean isValid = jwtUtil.validarToken(invalidToken);

        // Assert
        assertFalse(isValid, "Token com assinatura inválida deve retornar false");
    }

    @Test
    void validarToken_MalformedToken_ShouldReturnFalse() {
        // Arrange
        String malformedToken = "invalid.token.string";

        // Act
        boolean isValid = jwtUtil.validarToken(malformedToken);

        // Assert
        assertFalse(isValid, "Token malformado deve retornar false");
    }

    @Test
    void validarToken_NullToken_ShouldReturnFalse() {
        // Act
        boolean isValid = jwtUtil.validarToken(null);

        // Assert
        assertFalse(isValid, "Token nulo deve retornar false");
    }
}