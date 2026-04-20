export default function TrustBar() {
  const items = [
    {
      label: "25 Businesses Served",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "15 Years Experience",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: "HubSpot Certified Partner",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white border-b border-border">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 py-3">
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-text-mid">
              <span className="text-amber">{item.icon}</span>
              <span className="font-body text-xs font-medium tracking-wide">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
