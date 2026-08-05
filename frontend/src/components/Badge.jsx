import "./Badge.css";

export default function Badge({ children, color = "#22c55e" }) {
  return (
    <div
      className="badge"
      style={{
        background: color,
      }}
    >
      {children}
    </div>
  );
}