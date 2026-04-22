export default function Button({
  variant = 'primary',
  size,
  children,
  onClick,
  disabled,
  type = 'button',
  icon,
  trailingIcon,
  fullWidth,
  className = '',
  ...rest
}) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'lg' && 'btn-lg',
    size === 'sm' && 'btn-sm',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      style={fullWidth ? { width: '100%' } : undefined}
      {...rest}
    >
      {icon}
      {children}
      {trailingIcon}
    </button>
  );
}
