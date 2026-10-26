import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-full";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs min-h-[36px]",
    md: "px-5 py-2.5 text-sm min-h-[44px]",
    lg: "px-7 py-3 text-base min-h-[48px]",
  };

  const variantStyles = {
    primary:
      "bg-deep-violet text-white hover:bg-opacity-90 focus-visible:ring-deep-violet",
    secondary:
      "bg-soft-purple text-white hover:bg-opacity-90 focus-visible:ring-soft-purple",
    accent:
      "bg-electric-lime text-dark-ink font-semibold hover:bg-opacity-90 focus-visible:ring-electric-lime",
    outline:
      "border border-white/30 text-white hover:bg-white/10 focus-visible:ring-white",
    ghost:
      "text-dark-ink hover:bg-black/5 focus-visible:ring-dark-ink",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
