import { Link } from "react-router-dom";
import "./dashboard-layout.css";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="layout-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">Creatyv Dental</h2>

        <nav className="menu">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/chatroom">Chat Room</Link>
          <Link to="/chatinbox">Inbox</Link>
          <Link to="/appointments">Citas</Link>
          <Link to="/patients">Pacientes</Link>
          <Link to="/payments">Pagos</Link>
          <Link to="/reports">Reportes</Link>
          <Link to="/analytics">Analítica</Link>
          <Link to="/settings">Configuración</Link>
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="content">
        <header className="topbar">
          <span>Panel Dental</span>
        </header>

        <div className="page-content">{children}</div>
      </main>

    </div>
  );
}
