import type { ReactNode } from "react";
import { getAuthUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";

interface DashboardLayoutProps {
  children: ReactNode;
}

const ROLE_LABELS: Record<string, string> = {
  admin: "관리자 (Admin)",
  manager: "매니저 (Manager)",
  coach: "코치 (Coach)",
  parent: "학부모 (Parent)",
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getAuthUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  const title =
    user.role === "admin"
      ? "운영 대시보드"
      : user.role === "manager"
        ? "매니저 대시보드"
        : user.role === "coach"
          ? "코치 대시보드"
          : "학부모 대시보드";

  return (
    <DashboardShell
      role={user.role}
      title={title}
      clubName="Youth FC"
      userName={user.name}
      userEmail={user.email}
      userRoleLabel={ROLE_LABELS[user.role] ?? user.role}
      notificationCount={3}
    >
      {children}
    </DashboardShell>
  );
}
