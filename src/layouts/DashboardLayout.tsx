import { Sidebar } from "../components/Sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>

    </div>
  );
}
