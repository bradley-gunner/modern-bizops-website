/**
 * BrowserFrame
 *
 * Minimal browser chrome wrapper for product screenshots and mockups.
 * Renders three traffic-light dots, an optional URL bar, and a content area
 * that holds whatever you pass as children (typically a Next Image).
 *
 * Props:
 *   children     — the screenshot or other content
 *   url          — URL text to display in the address bar (default: app.modernbizops.com)
 *   showUrl      — show the address bar on desktop (default: true). Always hidden on mobile.
 *   aspectRatio  — CSS aspect-ratio for the content area (default: "16/10"). Pass the
 *                  source image's exact ratio (e.g. "991/650") to avoid letterboxing.
 *   variant      — "light" (default) for cream/white sections, "dark" for navy sections
 *   className    — extra classes for the outermost wrapper (margins, max-width, etc.)
 */
export default function BrowserFrame({
  children,
  url = "app.modernbizops.com",
  showUrl = true,
  aspectRatio = "16/10",
  variant = "light",
  className = "",
}) {
  const isDark = variant === "dark";

  const wrapperClasses = [
    "w-full overflow-hidden rounded-[12px] shadow-lg",
    isDark
      ? "bg-navy-mid ring-1 ring-white/10"
      : "bg-white ring-1 ring-border",
    className,
  ].join(" ");

  const barClasses = [
    "flex items-center gap-2 px-3 sm:px-4 py-2.5 border-b",
    isDark
      ? "bg-[#16294A] border-white/10"
      : "bg-cream-dark border-border",
  ].join(" ");

  const urlClasses = [
    "hidden sm:block mx-auto px-3 py-1 rounded-[6px] text-[11px] font-body tracking-wide truncate max-w-[60%]",
    isDark
      ? "bg-white/5 text-white/60"
      : "bg-white text-text-mid",
  ].join(" ");

  return (
    <div className={wrapperClasses}>
      {/* Top bar: traffic-light dots + optional URL */}
      <div className={barClasses} aria-hidden="true">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
        </div>
        {showUrl && <span className={urlClasses}>{url}</span>}
        {/* Right-side spacer to keep URL visually centered when present */}
        <div className="w-[42px] shrink-0 hidden sm:block" />
      </div>

      {/* Content area */}
      <div
        className="relative w-full"
        style={{ aspectRatio }}
      >
        {children}
      </div>
    </div>
  );
}
