// src/pages/Login.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, Loader2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

// Chave de criptografia. EM UM PROJETO REAL, ISSO NUNCA DEVE SER ARMAZENADO NO CÓDIGO!
// O ideal é que venha de uma variável de ambiente, mas mesmo assim, a criptografia no frontend
// é considerada "segurança por obscuridade", não segurança real.
const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-super-secret-key-for-dev';


const Login: React.FC = () => {

  debugger;
  
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o login
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify({
          username,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao autenticar. Verifique suas credenciais.');
      }

      if (data.token) {
        // **ARMAZENAMENTO DO TOKEN**
        // Criptografando o token antes de salvar no localStorage.
        const encryptedToken = CryptoJS.AES.encrypt(data.token, ENCRYPTION_KEY).toString();
        
        // Usamos localStorage para persistir entre sessões. sessionStorage seria limpo ao fechar a aba.
        localStorage.setItem('authToken', encryptedToken);

        // Redireciona para o dashboard após o login
        // Em um app com react-router-dom, você usaria: navigate('/dashboard');
        window.location.href = '/dashboard';

      } else {
        throw new Error('Token não recebido do servidor.');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Acessar Plataforma</CardTitle>
          <CardDescription>
            Use suas credenciais para entrar no sistema.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="seu.usuario"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;

/**
 * =========================================================================
 * NOTA IMPORTANTE SOBRE SEGURANÇA DO TOKEN
 * =========================================================================
 * * 1.  **Criptografia no Frontend:** A criptografia do token no frontend, como 
 * feita aqui com `crypto-js`, é considerada **Segurança por Obscuridade**.
 * Ela dificulta, mas não impede que um invasor com acesso ao código-fonte
 * (que é todo o código do frontend) encontre a chave e descriptografe o token.
 * * 2.  **Melhor Prática (HttpOnly Cookies):** A forma mais segura de lidar com
 * tokens de autenticação é através de **cookies `HttpOnly`**.
 * - O **servidor**, ao autenticar o usuário, define o cookie na resposta.
 * - A flag `HttpOnly` impede que o JavaScript do navegador acesse o cookie.
 * Isso mitiga drasticamente o risco de roubo de token por ataques XSS.
 * - O navegador envia automaticamente o cookie em todas as requisições
 * subsequentes para a API.
 * - Neste caso, o frontend não precisaria armazenar o token manualmente.
 *
 * 3.  **Como Ler o Token para a API:** Para usar o token armazenado, você precisará
 * descriptografá-lo antes de cada chamada à API.
 *
 * ```typescript
 * function getAuthToken() {
 * const encryptedToken = localStorage.getItem('authToken');
 * if (!encryptedToken) return null;
 *
 * try {
 * const bytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
 * const originalToken = bytes.toString(CryptoJS.enc.Utf8);
 * return originalToken;
 * } catch (error) {
 * console.error("Failed to decrypt token:", error);
 * return null;
 * }
 * }
 *
 * // Exemplo de uso em uma chamada fetch:
 * const token = getAuthToken();
 * fetch('[http://api.example.com/data](http://api.example.com/data)', {
 * headers: {
 * 'Authorization': `Bearer ${token}`
 * }
 * })
 * ```
 * =========================================================================
 */