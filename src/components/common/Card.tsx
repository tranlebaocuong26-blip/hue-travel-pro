import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "glass" | "warm";
}

export default function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const variantStyles = {
    default: "bg-off-white border border-gray-100 shadow-sm",
    elevated: "bg-white shadow-md border border-gray-100/80",
    glass: "bg-white/30 backdrop-blur-md border border-white/40 shadow-lg text-white",
    warm: "bg-warm-ivory border border-amber-100/60 shadow-sm",
  };

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-200 ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
