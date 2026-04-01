export default function Section({
  children,
  bg = "cream",
  className = "",
  id,
  narrow = true,
}) {
  const backgrounds = {
    cream: "bg-cream",
    white: "bg-white",
    navy: "bg-navy text-white",
  };

  return (
    <section id={id} className={`py-16 md:py-20 ${backgrounds[bg]} ${className}`}>
      <div
        className={`mx-auto px-6 md:px-8 ${
          narrow ? "max-w-[720px]" : "max-w-[1200px]"
        }`}
      >
        {children}
      </div>
    </section>
  );
}
