import { useEffect, useState } from "react";
import { getUser } from "../lib/api";
import Layout from "../layout/Layout";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getUser().then((u) => {
      if (!u) return (window.location.href = "/login");
      setUser(u);
    });
  }, []);

  if (!user) return <div>Cargando...</div>;

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6 text-gray-900">
        Bienvenido, {user.email}
      </h2>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        <Card title="Citas de Hoy" value="12" />
        <Card title="Pacientes Nuevos" value="4" />
        <Card title="Mensajes sin leer" value="9" highlight />

      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LargeCard title="Últimos Mensajes" />
        <LargeCard title="Resumen de Producción" />
      </div>
    </Layout>
  );
}

function Card({ title, value, highlight }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        highlight
          ? "bg-blue-600 text-white"
          : "bg-white border-gray-200 text-gray-800"
      } shadow-sm`}
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}

function LargeCard({ title }: any) {
  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm h-64">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="text-gray-500">Contenido próximamente…</div>
    </div>
  );
}
