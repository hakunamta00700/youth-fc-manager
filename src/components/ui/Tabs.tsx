"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 border-b border-gray-200",
        className,
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {tab.icon && (
              <span className="h-4 w-4">{tab.icon}</span>
            )}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1 rounded-full px-2 py-0.5 text-xs font-medium",
                  isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600",
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export { Tabs };
export default Tabs;
