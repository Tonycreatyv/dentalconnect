export const StatusBadge = ({ value }: { value?: string | null }) => {
  const normalized = value?.toLowerCase() ?? "unknown";
  const styles: Record<string, string> = {
    connected: "bg-teal-500/10 text-teal-200 border-teal-500/30",
    pending: "bg-cyan-500/10 text-cyan-200 border-cyan-500/30",
    disconnected: "bg-red-500/10 text-red-200 border-red-500/30",
    requested: "bg-cyan-500/10 text-cyan-200 border-cyan-500/30",
    confirmed: "bg-teal-500/10 text-teal-200 border-teal-500/30",
    cancelled: "bg-red-500/10 text-red-200 border-red-500/30",
    active: "bg-teal-500/10 text-teal-200 border-teal-500/30",
    paused: "bg-amber-500/10 text-amber-200 border-amber-500/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
        styles[normalized] ?? "border-slate-700 bg-slate-800 text-slate-300"
      }`}
    >
      {value ?? "unknown"}
    </span>
  );
};
