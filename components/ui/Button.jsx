import Link from "next/link";

export default function Button({
  href,
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-body font-semibold transition-colors duration-200 rounded-full";

  const variants = {
    primary: "bg-amber text-white hover:bg-amber-light",
    secondary:
      "bg-white text-navy border border-border hover:border-navy-mid",
    ghost: "text-navy-mid hover:text-navy underline underline-offset-4",
  };

  const sizes = {
    default: "px-8 py-3.5 text-base",
    large: "px-10 py-4 text-lg",
    small: "px-6 py-2.5 text-sm",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
