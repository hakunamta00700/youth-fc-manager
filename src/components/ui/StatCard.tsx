"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: TrendDirection;
  trendValue?: string;
  color?: string;
  className?: string;
}

const trendIcons: Record<TrendDirection, ReactNode> = {
  up: <TrendingUp className="h-4 w-4" />,
  down: <TrendingDown className="h-4 w-4" />,
  neutral: <Minus className="h-4 w-4" />,
};

const trendColors: Record<TrendDirection, string> = {
  up: "text-green-600",
  down: "text-red-600",
  neutral: "text-gray-500",
};

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p
            className="mt-1 text-3xl font-bold tracking-tight text-gray-900"
            style={color ? { color } : undefined}
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div
              className={cn(
                "mt-2 flex items-center gap-1 text-sm font-medium",
                trendColors[trend],
              )}
            >
              {trendIcons[trend]}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg",
              color ? "bg-opacity-10" : "bg-blue-50",
            )}
            style={
              color
                ? { backgroundColor: `${color}1A`, color }
                : { color: "#3b82f6" }
            }
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export { StatCard };
export default StatCard;
