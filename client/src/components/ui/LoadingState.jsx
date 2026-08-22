export function LoadingState({ message = 'Loading data...', className = '' }) {
  return (
    <div className={`clean-card p-12 text-center flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="w-9 h-9 border-3 border-stone-200 border-t-slate-900 rounded-full animate-spin" />
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{message}</p>
    </div>
  );
}
