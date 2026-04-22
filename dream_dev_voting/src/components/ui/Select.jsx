export default function Select({ children, options, placeholder, className = '', ...props }) {
  return (
    <select className={`select ${className}`} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options
        ? options.map(opt => (
            <option key={opt} value={opt}>
              {opt.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ')}
            </option>
          ))
        : children}
    </select>
  );
}
