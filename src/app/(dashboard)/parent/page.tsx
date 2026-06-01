"use client";

import {
  User,
  CalendarCheck,
  Star,
  DollarSign,
  Bell,
  CreditCard,
  Megaphone,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function ParentDashboardPage() {
  const childInfo = {
    name: "김민재",
    class: "유치부 A",
    attendanceRate: "95%",
    trainingScore: "4.2",
    feeStatus: "완납",
  };

  const notifications = [
    {
      type: "emergency",
      text: "우천으로 인한 휴원 안내",
      time: "1시간 전",
      badge: "긴급",
      badgeColor: "bg-red-100 text-red-700",
    },
    {
      type: "update",
      text: "김민재 훈련 평가 업데이트",
      time: "1일 전",
      icon: <User className="h-4 w-4 text-blue-500" />,
    },
    {
      type: "fee",
      text: "6월 회비 납부 안내",
      time: "3일 전",
      icon: <CreditCard className="h-4 w-4 text-amber-500" />,
    },
  ];

  const upcomingEvents = [
    { date: "06.15 (토)", event: "6월 대회", type: "event" },
    { date: "매주 화/목", event: "유치부 A 수업 09:00-10:30", type: "class" },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">학부모 대시보드</h2>
        <p className="mt-1 text-sm text-gray-500">
          자녀의 클럽 활동을 확인하세요
        </p>
      </div>

      {/* Child info cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="내 자녀"
          value={childInfo.name}
          subtitle={childInfo.class}
          icon={<User className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="출석률"
          value={childInfo.attendanceRate}
          icon={<CalendarCheck className="h-6 w-6" />}
          color="#059669"
        />
        <StatCard
          title="훈련 평가"
          value={childInfo.trainingScore}
          icon={<Star className="h-6 w-6" />}
          color="#06b6d4"
        />
        <StatCard
          title="회비 상태"
          value={childInfo.feeStatus}
          icon={<DollarSign className="h-6 w-6" />}
          color="#10b981"
        />
      </div>

      {/* Notifications + Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="알림" subtitle="최근 소식">
          <div className="space-y-1">
            {notifications.map((notif, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  {"badge" in notif ? (
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${notif.badgeColor}`}
                    >
                      {notif.badge}
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                      {notif.icon}
                    </span>
                  )}
                  <span className="text-sm text-gray-700">{notif.text}</span>
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {notif.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="퀵 메뉴">
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/parent/attendance"
                className="flex flex-col items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <CalendarCheck className="h-5 w-5 text-green-600" />
                <span>출석 현황</span>
              </Link>
              <Link
                href="/parent/fees"
                className="flex flex-col items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <DollarSign className="h-5 w-5 text-amber-600" />
                <span>회비 납부</span>
              </Link>
              <Link
                href="/parent/reports"
                className="flex flex-col items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Star className="h-5 w-5 text-purple-600" />
                <span>리포트</span>
              </Link>
              <Link
                href="/parent/notices"
                className="flex flex-col items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                <Megaphone className="h-5 w-5 text-blue-600" />
                <span>공지사항</span>
              </Link>
            </div>
          </Card>

          <Card title="다가오는 일정">
            <div className="space-y-2">
              {upcomingEvents.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                >
                  <span
                    className={`flex-shrink-0 rounded-lg px-2 py-1 text-xs font-medium ${
                      evt.type === "event"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {evt.date}
                  </span>
                  <span className="text-sm text-gray-700">{evt.event}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
