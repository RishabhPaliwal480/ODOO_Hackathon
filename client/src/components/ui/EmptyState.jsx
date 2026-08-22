import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There is nothing to display right now.',
  icon: Icon,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`clean-card p-10 text-center flex flex-col items-center justify-center space-y-4 ${className}`}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-slate-600">
          <Icon className="w-7 h-7 stroke-[1.5]" />
        </div>
      )}
      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-base text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="dark" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
