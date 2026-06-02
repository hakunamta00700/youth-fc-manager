"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Megaphone,
  Settings,
  BarChart3,
  Receipt,
  User,
  Calendar,
  ClipboardCheck,
  Dumbbell,
  Camera,
  Home,
  CalendarCheck,
  FileBarChart,
  Images,
} from "lucide-react";

type UserRole = "admin" | "manager" | "coach" | "parent";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileNavProps {
  role: UserRole;
}

const MOBILE_NAV_ITEMS: Record<UserRole, MobileNavItem[]> = {
  admin: [
    { label: "대시보드", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: "원생", href: "/admin/students", icon: <Users className="h-5 w-5" /> },
    { label: "회비", href: "/admin/fees", icon: <DollarSign className="h-5 w-5" /> },
    { label: "공지", href: "/admin/notices", icon: <Megaphone className="h-5 w-5" /> },
    { label: "설정", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
  ],
  manager: [
    { label: "대시보드", href: "/manager", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "회비", href: "/manager/monthly", icon: <Receipt className="h-5 w-5" /> },
    { label: "원생", href: "/manager/students", icon: <User className="h-5 w-5" /> },
    { label: "정산", href: "/manager/transactions", icon: <DollarSign className="h-5 w-5" /> },
    { label: "설정", href: "/manager/statistics", icon: <Settings className="h-5 w-5" /> },
  ],
  coach: [
    { label: "일정", href: "/coach", icon: <Calendar className="h-5 w-5" /> },
    { label: "출석", href: "/coach/attendance", icon: <ClipboardCheck className="h-5 w-5" /> },
    { label: "훈련", href: "/coach/training", icon: <Dumbbell className="h-5 w-5" /> },
    { label: "사진", href: "/coach/photos", icon: <Camera className="h-5 w-5" /> },
    { label: "게시판", href: "/coach/board", icon: <Megaphone className="h-5 w-5" /> },
  ],
  parent: [
    { label: "홈", href: "/parent", icon: <Home className="h-5 w-5" /> },
    { label: "출석", href: "/parent/attendance", icon: <CalendarCheck className="h-5 w-5" /> },
    { label: "회비", href: "/parent/fees", icon: <DollarSign className="h-5 w-5" /> },
    { label: "리포트", href: "/parent/reports", icon: <FileBarChart className="h-5 w-5" /> },
    { label: "공지", href: "/parent/notices", icon: <Megaphone className="h-5 w-5" /> },
  ],
};

function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  const items = MOBILE_NAV_ITEMS[role];

  const isActive = (href: string) => {
    if (items.indexOf(items.find((i) => i.href === href)!) === 0) {
      // First item (dashboard/home) — exact match
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white md:hidden">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              isActive(item.href)
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center",
                isActive(item.href) && "drop-shadow-sm"
              )}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export { MobileNav };
export default MobileNav;
