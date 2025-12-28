import { useState } from "react";
import { signup } from "../lib/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signup(email, password);
      alert("Cuenta creada. Inicia sesión.");
      window.location.href = "/login";
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="center">
      <form onSubmit={handleSubmit} className="card">
        <h2>Crear Cuenta</h2>

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

        <button type="submit">Registrarme</button>
      </form>
    </div>
  );
}
