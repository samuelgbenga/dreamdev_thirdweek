export function formatDate(isoDate, opts = {}) {
  const d = new Date(isoDate + 'T00:00:00');
  const { month = 'short', day = 'numeric', year, weekday } = opts;
  return d.toLocaleDateString('en-US', { month, day, year, weekday });
}

export function formatDateParts(isoDate) {
  const d = new Date(isoDate + 'T00:00:00');
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-US', { month: 'short' }),
  };
}

export function prettyEnum(s) {
  if (!s) return '';
  return s.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}

export function categoryLabel(c) {
  const map = {
    PRESIDENTIAL: 'Presidential',
    GUBERNATORIAL: 'Gubernatorial',
    SENATORIAL: 'Senatorial',
    STATE_REPRESENTATIVE: 'State Representative',
    STATE_ASSEMBLY: 'State Assembly',
    LOCAL_COUNSELOR: 'Local Counselor',
  };
  return map[c] || prettyEnum(c);
}

export function initialsOf(name) {
  return (name || '')
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
