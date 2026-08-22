import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Something went wrong',
  description = 'Failed to load content. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`clean-card p-10 text-center flex flex-col items-center justify-center space-y-4 border-red-200 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-base text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
