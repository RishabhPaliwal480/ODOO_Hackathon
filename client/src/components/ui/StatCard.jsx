import { Card } from './Card';

export function StatCard({ label, value, icon: Icon, subtext, trend, className = '' }) {
  return (
    <Card className={`p-5 sm:p-6 space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-slate-800">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          {trend && <span className="text-emerald-700 font-bold">{trend}</span>}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </Card>
  );
}
