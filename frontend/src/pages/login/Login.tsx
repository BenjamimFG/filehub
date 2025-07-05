import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2 } from "lucide-react";
import CryptoJS from "crypto-js";
import { useAuth } from "@/contexts/AuthContext"; // 1. Importe o hook useAuth

const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || "default-super-secret-key-for-dev";

// --- Interfaces para tipar a resposta da API ---
interface UserData {
  id: number;
  nome: string;
  perfil: "ADMIN" | "APROVADOR" | "USUARIO";
  email: string;
  repositoriosMembro: number[];
}

interface LoginApiResponse extends UserData {
  token: string;
}

const Login: React.FC = () => {
  const { login, user } = useAuth(); // 2. Obtenha a função de login do contexto
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          username,
          senha,
        }),
      });

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Usuário ou senha inválidos");
        else throw new Error("Falha na autenticação");
      }

      const data: LoginApiResponse | { message: string } =
        await response.json();

      const responseData = data as LoginApiResponse;

      if (responseData.token) {
        // --- ARMAZENAMENTO ATUALIZADO ---

        // 1. Criptografa e armazena o token como antes.
        const encryptedToken = CryptoJS.AES.encrypt(
          responseData.token,
          ENCRYPTION_KEY
        ).toString();
        localStorage.setItem("authToken", encryptedToken);

        // 2. CHAMA A FUNÇÃO DE LOGIN DO CONTEXTO
        // Isso irá definir o usuário no estado global e também salvá-lo no localStorage.
        login(responseData);

        console.log("user", user);

        // 3. Redireciona para o dashboard.
        window.location.href = "/dashboard";
      } else {
        throw new Error("Token não recebido do servidor.");
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
                placeholder="Usuário"
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
                "Entrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
