export function ToolButton({ active, icon: Icon, label, onClick }) {
  return (
    <button className={active ? "tool active" : "tool"} onClick={onClick}>
      <Icon size={17} />
      <span>{label}</span>
    </button>
  );
}

export function IconButton({ active, children, onClick, title }) {
  return (
    <button title={title} className={active ? "icon-btn active" : "icon-btn"} onClick={onClick}>
      {children}
    </button>
  );
}

export function SideButton({ active, danger, icon: Icon, label, onClick }) {
  let className = "side-btn";
  if (active) className += " active";
  if (danger) className += " danger";

  return (
    <button className={className} onClick={onClick}>
      <Icon size={16} />
      {label}
    </button>
  );
}
