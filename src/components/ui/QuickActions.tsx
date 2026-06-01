"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: ReactNode;
  href?: string;
  onClick?: () => void;
  color?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
  className?: string;
}

const gridCols: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

function QuickActions({
  actions,
  columns = 2,
  className,
}: QuickActionsProps) {
  const cols = Math.min(Math.max(columns, 2), 4) as 2 | 3 | 4;

  return (
    <div className={cn("grid gap-3", gridCols[cols], className)}>
      {actions.map((action) => {
        const content = (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200",
              "hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5",
              action.onClick && "cursor-pointer",
            )}
            style={
              action.color
                ? {
                    borderColor: `${action.color}40`,
                    backgroundColor: `${action.color}08`,
                  }
                : undefined
            }
            onClick={action.onClick}
            role={action.onClick ? "button" : undefined}
            tabIndex={action.onClick ? 0 : undefined}
            onKeyDown={
              action.onClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      action.onClick?.();
                    }
                  }
                : undefined
            }
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={
                action.color
                  ? { backgroundColor: `${action.color}18`, color: action.color }
                  : { backgroundColor: "#EFF6FF", color: "#3B82F6" }
              }
            >
              {action.icon}
            </span>
            <span className="text-center text-xs">{action.label}</span>
          </div>
        );

        if (action.href) {
          return (
            <Link key={action.label} href={action.href}>
              {content}
            </Link>
          );
        }

        return <div key={action.label}>{content}</div>;
      })}
    </div>
  );
}

export { QuickActions };
export default QuickActions;
