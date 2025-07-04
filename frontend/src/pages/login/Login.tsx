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
// O ideal é que venha de uma variável de ambiente.
// CORREÇÃO: Vite usa `import.meta.env` para acessar variáveis de ambiente, não `process.env`.
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-super-secret-key-for-dev';


const Login: React.FC = () => {
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
        // Tenta pegar uma mensagem de erro mais específica da API, se houver
        const errorMessage = data?.message || data?.error || 'Falha ao autenticar. Verifique suas credenciais.';
        throw new Error(errorMessage);
      }

      if (data.token) {
        // **ARMAZENAMENTO DO TOKEN**
        // Criptografando o token antes de salvar no localStorage.
        const encryptedToken = CryptoJS.AES.encrypt(data.token, ENCRYPTION_KEY).toString();
        
        // Usamos localStorage para persistir entre sessões.
        localStorage.setItem('authToken', encryptedToken);

        // Redireciona para o dashboard após o login
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
                placeholder="Usuario"
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