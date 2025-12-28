import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const { pathname } = useLocation();

  const itemClass = (path: string) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
      pathname === path
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-6 flex flex-col">
      {/* BRAND */}
      <h2 className="text-2xl font-bold mb-8 tracking-tight text-blue-700">
        DentalConnect
      </h2>

      {/* MENU */}
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className={itemClass("/dashboard")}>
          🏠 Dashboard
        </Link>

        <Link to="/chatinbox" className={itemClass("/chatinbox")}>
          💬 Inbox
        </Link>

        <Link to="/appointments" className={itemClass("/appointments")}>
          📅 Citas
        </Link>

        <Link to="/patients" className={itemClass("/patients")}>
          👤 Pacientes
        </Link>

        <Link to="/payments" className={itemClass("/payments")}>
          💳 Pagos
        </Link>

        <Link to="/reports" className={itemClass("/reports")}>
          📊 Reportes
        </Link>

        <Link to="/analytics" className={itemClass("/analytics")}>
          📈 Analytics
        </Link>

        <Link to="/settings" className={itemClass("/settings")}>
          ⚙️ Ajustes
        </Link>
      </nav>

      {/* FOOTER */}
      <div className="mt-auto pt-10 text-gray-500 text-sm">
        Powered by <span className="text-blue-600 font-semibold">CREATYV.IO</span>
      </div>
    </div>
  );
}
