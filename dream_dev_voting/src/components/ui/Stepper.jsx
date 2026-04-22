import { Check } from './Icons';

export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <div className={`stepper-step ${i === current ? 'active' : i < current ? 'done' : ''}`}>
            <div className="stepper-dot">
              {i < current ? <Check size={11} /> : i + 1}
            </div>
            <span>{s}</span>
          </div>
          {i < steps.length - 1 && <div className="stepper-line" />}
        </span>
      ))}
    </div>
  );
}
