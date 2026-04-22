import { useState, useEffect } from 'react';

export default function Countdown({ target }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = new Date(target) - now;
  if (diff <= 0) return <span>Voting is live</span>;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  return (
    <span className="hero-countdown-display">
      {days}d {pad(hours)}h {pad(mins)}m {pad(secs)}s
    </span>
  );
}
