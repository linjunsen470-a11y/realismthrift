import React from "react";

interface SkeletonProps {
  className?: string;
  count?: number;
  variant?: "text" | "rect" | "circle";
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  count = 1,
  variant = "rect"
}) => {
  const baseClass = "animate-pulse bg-gray-100 relative overflow-hidden";
  const variantClass = 
    variant === "circle" ? "rounded-full" : 
    variant === "text" ? "rounded-sm h-4" : 
    "rounded-sm";

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variantClass} ${className}`}
        >
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      ))}
    </>
  );
};
