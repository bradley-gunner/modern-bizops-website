export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-border rounded-[14px] shadow-md p-8 ${className}`}
    >
      {children}
    </div>
  );
}
