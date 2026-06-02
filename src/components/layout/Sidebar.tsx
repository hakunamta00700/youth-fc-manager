"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  DollarSign,
  Megaphone,
  FileText,
  GraduationCap,
  ClipboardList,
  Settings,
  BarChart3,
  Receipt,
  AlertTriangle,
  ListChecks,
  Wallet,
  ChartBar,
  User,
  Image,
  Truck,
  Calendar,
  ClipboardCheck,
  Dumbbell,
  Camera,
  FileSpreadsheet,
  MessageSquare,
  Home,
  CalendarCheck,
  FileBarChart,
  Images,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  LogOut,
  ChevronDown,
} from "lucide-react";

type UserRole = "admin" | "manager" | "coach" | "parent";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  label?: string;
  items: NavItem[];
}

interface SidebarProps {
  role: UserRole;
  clubName?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

const NAV_GROUPS: Record<UserRole, NavGroup[]> = {
  admin: [
    {
      items: [{ label: "대시보드", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> }],
    },
    {
      label: "원생 관리",
      items: [
        { label: "원생 목록", href: "/admin/students", icon: <UserCheck className="h-5 w-5" /> },
        { label: "반 배정", href: "/admin/classes", icon: <Users className="h-5 w-5" /> },
      ],
    },
    {
      label: "회비",
      items: [{ label: "회비 현황", href: "/admin/fees", icon: <DollarSign className="h-5 w-5" /> }],
    },
    {
      label: "소통/공지",
      items: [
        { label: "공지사항", href: "/admin/notices", icon: <Megaphone className="h-5 w-5" /> },
      ],
    },
    {
      label: "리포트",
      items: [{ label: "리포트 생성", href: "/admin/reports", icon: <FileText className="h-5 w-5" /> }],
    },
    {
      label: "코치 관리",
      items: [{ label: "코치 목록", href: "/admin/coaches", icon: <GraduationCap className="h-5 w-5" /> }],
    },
    {
      label: "체험/모집",
      items: [{ label: "체험 신청", href: "/admin/trials", icon: <ClipboardList className="h-5 w-5" /> }],
    },
    {
      label: "시스템",
      items: [{ label: "설정", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> }],
    },
  ],
  manager: [
    {
      items: [{ label: "대시보드", href: "/manager", icon: <BarChart3 className="h-5 w-5" /> }],
    },
    {
      label: "회비",
      items: [
        { label: "월별 결산", href: "/manager/monthly", icon: <Receipt className="h-5 w-5" /> },
        { label: "미납 관리", href: "/manager/overdue", icon: <AlertTriangle className="h-5 w-5" /> },
        { label: "거래 내역", href: "/manager/transactions", icon: <ListChecks className="h-5 w-5" /> },
        { label: "급여 관리", href: "/manager/salary", icon: <Wallet className="h-5 w-5" /> },
      ],
    },
    {
      label: "통계",
      items: [{ label: "통계 조회", href: "/manager/statistics", icon: <ChartBar className="h-5 w-5" /> }],
    },
    {
      label: "원생",
      items: [{ label: "원생 목록", href: "/manager/students", icon: <User className="h-5 w-5" /> }],
    },
    {
      label: "부가",
      items: [
        { label: "앨범", href: "/manager/albums", icon: <Image className="h-5 w-5" /> },
        { label: "차량 관리", href: "/manager/vehicles", icon: <Truck className="h-5 w-5" /> },
      ],
    },
  ],
  coach: [
    {
      items: [
        { label: "내 일정", href: "/coach", icon: <Calendar className="h-5 w-5" /> },
        { label: "출석 체크", href: "/coach/attendance", icon: <ClipboardCheck className="h-5 w-5" /> },
        { label: "훈련 기록", href: "/coach/training", icon: <Dumbbell className="h-5 w-5" /> },
        { label: "사진 기록", href: "/coach/photos", icon: <Camera className="h-5 w-5" /> },
        { label: "인수인계", href: "/coach/handover", icon: <FileSpreadsheet className="h-5 w-5" /> },
        { label: "메시지", href: "/coach/messages", icon: <MessageSquare className="h-5 w-5" /> },
        { label: "게시판", href: "/coach/board", icon: <ClipboardList className="h-5 w-5" /> },
      ],
    },
  ],
  parent: [
    {
      items: [
        { label: "홈", href: "/parent", icon: <Home className="h-5 w-5" /> },
        { label: "출석 현황", href: "/parent/attendance", icon: <CalendarCheck className="h-5 w-5" /> },
        { label: "회비 납부", href: "/parent/fees", icon: <DollarSign className="h-5 w-5" /> },
        { label: "리포트", href: "/parent/reports", icon: <FileBarChart className="h-5 w-5" /> },
        { label: "갤러리", href: "/parent/gallery", icon: <Images className="h-5 w-5" /> },
        { label: "공지사항", href: "/parent/notices", icon: <Megaphone className="h-5 w-5" /> },
        { label: "메시지", href: "/parent/messages", icon: <MessageCircle className="h-5 w-5" /> },
      ],
    },
  ],
};

function Sidebar({
  role,
  clubName = "Youth FC",
  userName = "사용자",
  userEmail = "user@youthfc.com",
  userAvatar,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(NAV_GROUPS[role].map((_, i) => String(i)))
  );

  const navGroups = NAV_GROUPS[role];

  const toggleGroup = (index: number) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      const key = String(index);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const isActive = (href: string) => {
    if (href === "/admin" || href === "/manager" || href === "/coach" || href === "/parent") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getInitial = (name: string) => name.charAt(0);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-slate-900 text-white transition-all duration-300",
        "md:relative md:translate-x-0",
        collapsed ? "w-16" : "w-64",
        "-translate-x-full md:translate-x-0"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-slate-700/50 px-4",
          collapsed ? "justify-center py-4" : "gap-3 py-4"
        )}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">{clubName}</span>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700 md:flex"
        aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-1">
            {group.label && !collapsed && (
              <button
                onClick={() => toggleGroup(groupIndex)}
                className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-300"
              >
                <span>{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform",
                    expandedGroups.has(String(groupIndex)) && "rotate-180"
                  )}
                />
              </button>
            )}
            {(collapsed || expandedGroups.has(String(groupIndex))) &&
              group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-blue-600/20 text-blue-300"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              ))}
          </div>
        ))}
      </nav>

      {/* User info & logout */}
      <div
        className={cn(
          "border-t border-slate-700/50 p-4",
          collapsed && "flex flex-col items-center px-2"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "flex-col"
          )}
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-semibold text-white">
            {userAvatar || getInitial(userName)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {userName}
              </p>
              <p className="truncate text-xs text-slate-400">{userEmail}</p>
            </div>
          )}
        </div>
        <button
          className={cn(
            "mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400",
            collapsed && "justify-center px-2"
          )}
          onClick={() => {
            // Logout logic
            window.location.href = "/login";
          }}
          title={collapsed ? "로그아웃" : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
}

export { Sidebar, type SidebarProps, type UserRole };
export default Sidebar;
