"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

function Card({
  title,
  subtitle,
  children,
  className,
  onClick,
  hoverable = false,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200",
        hoverable &&
          "cursor-pointer hover:shadow-md hover:border-gray-300 hover:-translate-y-0.5",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {(title || subtitle) && (
        <div className="border-b border-gray-100 px-5 py-4">
          {title && (
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export { Card };
export default Card;
