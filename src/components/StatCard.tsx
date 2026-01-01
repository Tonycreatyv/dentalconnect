import type { ReactNode } from "react";

export const StatCard = ({
  label,
  value,
  icon,
  helper,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  helper?: string;
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
        {icon}
      </div>
      <div className="mt-3 text-2xl font-semibold text-slate-100">{value}</div>
      {helper ? <p className="mt-2 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
};
