export const EmptyState = ({ title, message }: { title: string; message: string }) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center">
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
};
