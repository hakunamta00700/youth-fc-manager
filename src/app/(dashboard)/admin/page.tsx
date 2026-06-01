"use client";

import {
  Users,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  UserPlus,
  FileText,
  Megaphone,
  ClipboardList,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "전체 원생",
      value: "48",
      icon: <Users className="h-6 w-6" />,
      color: "#2563eb",
      trend: "up" as const,
      trendValue: "3명 증가",
    },
    {
      title: "오늘 출석률",
      value: "89%",
      icon: <CalendarCheck className="h-6 w-6" />,
      color: "#059669",
      trend: "down" as const,
      trendValue: "2% 감소",
    },
    {
      title: "회비 목표 달성률",
      value: "68%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "#f59e0b",
      trend: "up" as const,
      trendValue: "5% 증가",
    },
    {
      title: "미납 총액",
      value: "₩3,250,000",
      icon: <AlertTriangle className="h-6 w-6" />,
      color: "#ef4444",
      trend: "neutral" as const,
      trendValue: "전월 동일",
    },
  ];

  const quickActions = [
    {
      label: "신규 원생 등록",
      href: "/admin/students/register",
      icon: <UserPlus className="h-4 w-4 text-blue-600" />,
      color: "text-blue-600",
    },
    {
      label: "출석 체크",
      href: "/coach/attendance",
      icon: <CalendarCheck className="h-4 w-4 text-green-600" />,
      color: "text-green-600",
    },
    {
      label: "공지사항 작성",
      href: "/admin/notices/write",
      icon: <Megaphone className="h-4 w-4 text-amber-600" />,
      color: "text-amber-600",
    },
    {
      label: "리포트 생성",
      href: "/admin/reports",
      icon: <FileText className="h-4 w-4 text-purple-600" />,
      color: "text-purple-600",
    },
  ];

  const recentActivity = [
    { action: "신규 원생 등록", detail: "최민준 (유치부 A)", time: "10분 전" },
    { action: "회비 납부", detail: "김지원 학부모 · 6월 회비", time: "30분 전" },
    { action: "출석 체크 완료", detail: "초등저 B반 · 15명 중 14명 출석", time: "1시간 전" },
    { action: "공지사항 발행", detail: "6월 일정 안내", time: "2시간 전" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">운영 대시보드</h2>
        <p className="mt-1 text-sm text-gray-500">
          클럽 전체 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="빠른 작업" subtitle="자주 사용하는 기능">
          <div className="flex flex-col gap-2">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  {action.icon}
                </span>
                {action.label}
              </Link>
            ))}
          </div>
        </Card>

        <Card title="최근 활동" subtitle="최근 24시간 내 활동">
          <div className="space-y-1">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start justify-between rounded-lg px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500">{activity.detail}</p>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Class overview */}
      <Card title="반별 현황">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="px-3 py-3">반 이름</th>
                <th className="px-3 py-3">담당 코치</th>
                <th className="px-3 py-3">원생 수</th>
                <th className="px-3 py-3">출석률</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "유치부 A", coach: "박코치", students: 12, rate: "92%" },
                { name: "초등저 B", coach: "이코치", students: 15, rate: "85%" },
                { name: "초등고 A", coach: "최코치", students: 18, rate: "88%" },
                { name: "선수반", coach: "박코치", students: 10, rate: "95%" },
              ].map((row) => (
                <tr key={row.name} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium text-gray-900">
                    {row.name}
                  </td>
                  <td className="px-3 py-3 text-gray-600">{row.coach}</td>
                  <td className="px-3 py-3 text-gray-600">{row.students}명</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      {row.rate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
