export function ToolButton({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`tool-btn ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {Icon && <Icon size={17} />}
      {label}
    </button>
  );
}

export function IconButton({ active, children, onClick, title }) {
  return (
    <button
      type="button"
      className={`icon-btn ${active ? "active" : ""}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

export function SideButton({ active, danger, icon: Icon, label, onClick }) {
  let className = "side-btn";
  if (active) className += " active";
  if (danger) className += " danger";

  return (
    <button type="button" className={className} onClick={onClick}>
      {Icon && <Icon size={16} />}
      {label}
    </button>
  );
}
