import Layout from "../layout/Layout";

export default function Payments() {
  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Pagos</h2>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600">Registros de pagos y cobros.</p>
      </div>
    </Layout>
  );
}
