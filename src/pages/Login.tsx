import { useState } from "react";
import { login } from "../lib/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      window.location.href = "/dashboard";
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="center">
      <form onSubmit={handleSubmit} className="card">
        <h2>Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
