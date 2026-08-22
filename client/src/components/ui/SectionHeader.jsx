export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4 ${className}`}
    >
      <div>
        {eyebrow && (
          <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800">
            {eyebrow}
          </div>
        )}
        {title && (
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-0.5">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
