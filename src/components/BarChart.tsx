import type { ReactNode } from "react";

export type ChartDatum = {
  label: string;
  value: number;
  helper?: ReactNode;
};

export const BarChart = ({ title, data }: { title: string; data: ChartDatum[] }) => {
  const maxValue = Math.max(1, ...data.map((item) => item.value));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="text-xs text-slate-500">Last 7 days</span>
      </div>
      <div className="mt-4 grid gap-3">
        {data.map((item) => (
          <div key={item.label} className="grid gap-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{item.label}</span>
              <span className="text-slate-200">{item.value}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
            {item.helper ? <div className="text-[11px] text-slate-500">{item.helper}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
};
