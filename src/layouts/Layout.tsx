import { Sidebar } from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Layout({ children }: any) {
  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
