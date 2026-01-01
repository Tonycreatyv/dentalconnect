import { Bell, LogOut, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useClinic } from "../context/ClinicContext";

export const Topbar = () => {
  const { signOut, user } = useAuth();
  const { clinic } = useClinic();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/70 px-8 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Clinic</p>
        <h1 className="text-lg font-semibold text-slate-100">
          {clinic?.name ?? "DentalConnect Workspace"}
        </h1>
        <p className="text-xs text-slate-500">{clinic?.domain ?? "dental.creatyv.io"}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 md:flex">
          <Search className="h-4 w-4" />
          <span>Search patients, conversations...</span>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300">
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5">
          <span className="text-xs text-slate-300">{user?.email ?? "user@clinic.com"}</span>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 text-xs text-teal-300 hover:text-teal-200"
          >
            <LogOut className="h-3 w-3" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
