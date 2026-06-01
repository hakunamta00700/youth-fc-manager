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
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

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
        <h2 className="text-2xl font-bold text-gray-900">코치 대시보드</h2>
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
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="퀵 액션">
            <div className="flex flex-col gap-2">
              <Link
                href="/coach/attendance"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <ClipboardCheck className="h-4 w-4" />
                </span>
                출석 체크
              </Link>
              <Link
                href="/coach/training"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <FileText className="h-4 w-4" />
                </span>
                훈련 기록
              </Link>
              <Link
                href="/coach/photos"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Camera className="h-4 w-4" />
                </span>
                사진 기록
              </Link>
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
