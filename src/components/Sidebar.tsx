import { NavLink } from "react-router-dom";
import {
  Calendar,
  LineChart,
  ClipboardList,
  MessageSquareText,
  Plug,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: LineChart },
  { to: "/conversations", label: "Conversations", icon: MessageSquareText },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/appointments", label: "Appointments", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: ClipboardList },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900/70 px-5 py-6">
      <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/10">
          <Stethoscope className="h-5 w-5 text-teal-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">DentalConnect</p>
          <p className="text-xs text-slate-400">Creatyv</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-teal-500/10 text-teal-200"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-slate-100"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-3 text-xs text-slate-400">
        <p className="font-medium text-slate-200">Dental SaaS</p>
        <p className="mt-1">Enterprise-grade messaging automation.</p>
      </div>
    </aside>
  );
};
