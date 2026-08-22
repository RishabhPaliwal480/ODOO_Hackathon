export const fmtDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
  } catch {
    return String(value);
  }
};

export const fmtShortDate = (value) => {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
  } catch {
    return String(value);
  }
};

export const money = (value) => `$${Number(value || 0).toLocaleString('en-US')}`;

export const getInitials = (name = '') => {
  if (!name) return 'GT';
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const calculateTripDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 1;
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return Math.max(1, days + 1);
};
