export function Button({
  children,
  variant = 'dark',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClass = {
    dark: 'btn-dark',
    emerald: 'btn-emerald',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-dark';

  const sizeClass = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-xs sm:text-sm py-2.5 px-5',
    lg: 'text-sm sm:text-base py-3.5 px-7',
  }[size] || 'text-xs sm:text-sm py-2.5 px-5';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn-base ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!loading && IconRight && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  );
}
