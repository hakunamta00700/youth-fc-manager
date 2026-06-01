"use client";

import {
  Users,
  CalendarCheck,
  Dumbbell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClipboardCheck,
  FileText,
  Camera,
  Calendar,
  Star,
  TrendingUp,
  MessageSquare,
  ClipboardList,
  Phone,
  Image,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

const quickActions = [
  {
    label: "출석 체크",
    href: "/coach/attendance",
    icon: <ClipboardCheck className="h-5 w-5" />,
    color: "#16a34a",
  },
  {
    label: "출석 알림",
    href: "/coach/attendance/alerts",
    icon: <Phone className="h-5 w-5" />,
    color: "#dc2626",
  },
  {
    label: "훈련 일지",
    href: "/coach/training/log",
    icon: <FileText className="h-5 w-5" />,
    color: "#2563eb",
  },
  {
    label: "훈련 평가",
    href: "/coach/training/evaluate",
    icon: <Star className="h-5 w-5" />,
    color: "#f59e0b",
  },
  {
    label: "성장 그래프",
    href: "/coach/training/growth",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "#06b6d4",
  },
  {
    label: "성장 리포트",
    href: "/coach/training/reports",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "#8b5cf6",
  },
  {
    label: "사진 촬영",
    href: "/coach/photos",
    icon: <Camera className="h-5 w-5" />,
    color: "#ec4899",
  },
  {
    label: "메시지",
    href: "/coach/messages",
    icon: <MessageSquare className="h-5 w-5" />,
    color: "#14b8a6",
  },
  {
    label: "내 시간표",
    href: "/coach/schedule",
    icon: <Calendar className="h-5 w-5" />,
    color: "#2563eb",
  },
  {
    label: "게시판",
    href: "/coach/board",
    icon: <ClipboardList className="h-5 w-5" />,
    color: "#f97316",
  },
  {
    label: "인수인계",
    href: "/coach/handover",
    icon: <Users className="h-5 w-5" />,
    color: "#06b6d4",
  },
  {
    label: "원생 조회",
    href: "/coach/students",
    icon: <Users className="h-5 w-5" />,
    color: "#6366f1",
  },
];

export default function CoachDashboardPage() {
  const stats = [
    {
      title: "내 반 원생",
      value: "12",
      icon: <Users className="h-6 w-6" />,
      color: "#2563eb",
    },
    {
      title: "출석률 (이번 달)",
      value: "92%",
      icon: <CalendarCheck className="h-6 w-6" />,
      color: "#059669",
      trend: "up" as const,
      trendValue: "3% 증가",
    },
    {
      title: "이번 달 훈련",
      value: "8회",
      icon: <Dumbbell className="h-6 w-6" />,
      color: "#06b6d4",
    },
    {
      title: "오늘 수업",
      value: "3회",
      icon: <Clock className="h-6 w-6" />,
      color: "#f59e0b",
    },
  ];

  const todayAttendance = {
    present: 10,
    absent: 1,
    late: 1,
    total: 12,
  };

  const upcomingSchedule = [
    {
      name: "유치부 A",
      time: "09:00-10:30",
      room: "A구장",
      status: "진행 전",
    },
    {
      name: "초등저 B",
      time: "11:00-12:30",
      room: "B구장",
      status: "진행 전",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">코치 홈</h2>
        <p className="mt-1 text-sm text-gray-500">
          오늘의 수업 일정과 훈련 현황을 확인하세요
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Today's class + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="오늘 수업" subtitle="유치부 A · 09:00-10:30 (12명)">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-green-500" />
                출석
              </span>
              <span className="text-sm font-medium text-gray-900">
                {todayAttendance.present}명
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <XCircle className="h-4 w-4 text-red-500" />
                결석
              </span>
              <span className="text-sm font-medium text-gray-900">
                {todayAttendance.absent}명
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                지각
              </span>
              <span className="text-sm font-medium text-gray-900">
                {todayAttendance.late}명
              </span>
            </div>
            <div className="pt-2 flex gap-2">
              <Link
                href="/coach/attendance"
                className="flex-1 text-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                출석 체크 바로가기
              </Link>
              <Link
                href="/coach/attendance/alerts"
                className="flex-1 text-center rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                알림 현황
              </Link>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <Card title="퀵 액션">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-gray-100 px-2 py-2.5 text-center text-[10px] font-medium text-gray-600 transition-all hover:border-gray-200 hover:bg-gray-50"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${action.color}18`,
                      color: action.color,
                    }}
                  >
                    {action.icon}
                  </span>
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>

          <Card title="다가오는 수업">
            <div className="space-y-2">
              {upcomingSchedule.map((cls) => (
                <div
                  key={cls.name}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cls.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {cls.time} · {cls.room}
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {cls.status}
                  </span>
                </div>
              ))}
              <Link
                href="/coach/schedule"
                className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700 pt-1"
              >
                전체 일정 보기 →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
