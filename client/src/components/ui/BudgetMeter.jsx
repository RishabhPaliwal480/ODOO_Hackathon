import { money } from '../../utils/formatters';

export function BudgetMeter({ spent = 0, budget = 1500, label = 'Budget Meter' }) {
  const percentage = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;
  const remaining = Math.max(0, budget - spent);

  return (
    <div className="budget-meter space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
        <span>{label}</span>
        <span>
          {money(spent)} / {money(budget)} ({percentage}%)
        </span>
      </div>
      <div className="budget-meter-bar">
        <div className="budget-meter-fill" style={{ width: `${percentage}%` }} />
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
        <span>Spent: {money(spent)}</span>
        <span>Remaining: {money(remaining)}</span>
      </div>
    </div>
  );
}
