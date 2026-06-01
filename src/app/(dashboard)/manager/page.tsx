"use client";

import {
  Users,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  CreditCard,
  Receipt,
  FileText,
  Banknote,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ManagerDashboardPage() {
  const stats = [
    {
      title: "전체 원생",
      value: "48",
      icon: <Users className="h-6 w-6" />,
      color: "#2563eb",
    },
    {
      title: "오늘 출석률",
      value: "89%",
      icon: <CalendarCheck className="h-6 w-6" />,
      color: "#059669",
    },
    {
      title: "이번 달 수납",
      value: "₩18,500,000",
      icon: <DollarSign className="h-6 w-6" />,
      color: "#f59e0b",
    },
    {
      title: "미납",
      value: "₩3,250,000",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "#ef4444",
    },
  ];

  const todaySchedule = [
    { name: "유치부 A", time: "09:00-10:30", coach: "박코치", count: 12 },
    { name: "초등저 B", time: "11:00-12:30", coach: "이코치", count: 15 },
    { name: "초등고 A", time: "14:00-16:00", coach: "최코치", count: 18 },
    { name: "선수반", time: "16:30-19:00", coach: "박코치", count: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">매니저 대시보드</h2>
        <p className="mt-1 text-sm text-gray-500">
          클럽 재정 및 현황을 관리합니다
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Schedule + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="오늘 수업 일정" subtitle="2025년 6월 2일 (월)">
          <div className="space-y-3">
            {todaySchedule.map((cls) => (
              <div
                key={cls.name}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {cls.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {cls.coach} · {cls.count}명
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {cls.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="퀵 액션">
            <div className="flex flex-col gap-2">
              <Link
                href="/manager/ledger"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <CreditCard className="h-4 w-4" />
                </span>
                회비 입력
              </Link>
              <Link
                href="/manager/transactions"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                  <Banknote className="h-4 w-4" />
                </span>
                지출 입력
              </Link>
              <Link
                href="/manager/stats"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <FileText className="h-4 w-4" />
                </span>
                리포트 조회
              </Link>
              <Link
                href="/manager/overdue"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                미납 관리
              </Link>
            </div>
          </Card>

          <Card title="월별 수납 요약" subtitle="6월">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">목표 금액</span>
                <span className="text-sm font-medium text-gray-900">
                  ₩20,000,000
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">수납 완료</span>
                <span className="text-sm font-medium text-green-600">
                  ₩18,500,000
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">미납</span>
                <span className="text-sm font-medium text-red-600">
                  ₩3,250,000
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: "68%" }}
                />
              </div>
              <p className="text-right text-xs text-gray-400">달성률 68%</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
