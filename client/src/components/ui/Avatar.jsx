import { getInitials } from '../../utils/formatters';

export function Avatar({ name = '', image, size = 'md', className = '' }) {
  const sizeClass = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }[size] || 'w-10 h-10 text-sm';

  if (image) {
    return (
      <div className={`${sizeClass} rounded-2xl overflow-hidden shrink-0 border border-stone-200 shadow-sm ${className}`}>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-2xl bg-[#111827] text-white font-display font-bold flex items-center justify-center shrink-0 border border-stone-800 shadow-sm ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
