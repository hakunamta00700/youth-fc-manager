"use client";

import { useState } from "react";
import { Sidebar, type UserRole } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

interface DashboardShellProps {
  children: React.ReactNode;
  role: UserRole;
  title: string;
  clubName?: string;
  userName?: string;
  userEmail?: string;
  userRoleLabel?: string;
  notificationCount?: number;
}

function DashboardShell({
  children,
  role,
  title,
  clubName,
  userName,
  userEmail,
  userRoleLabel,
  notificationCount,
}: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar - fixed on mobile with toggle, static on md+ */}
      <div
        className={`${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 z-50 h-full transition-transform duration-300 md:static md:translate-x-0`}
      >
        <Sidebar
          role={role}
          clubName={clubName}
          userName={userName}
          userEmail={userEmail}
          onNavClick={closeMobileSidebar}
        />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col md:ml-0">
        <Topbar
          title={title}
          onMenuClick={handleMenuClick}
          notificationCount={notificationCount}
          userName={userName}
          userRole={userRoleLabel}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav role={role} />
    </div>
  );
}

export { DashboardShell };
