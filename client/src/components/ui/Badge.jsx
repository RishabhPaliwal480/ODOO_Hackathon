export function Badge({ children, variant = 'stone', className = '', icon: Icon }) {
  const variantClass = {
    emerald: 'badge-emerald',
    stone: 'badge-stone',
    dark: 'badge-dark',
    glass: 'badge-glass',
  }[variant] || 'badge-stone';

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
