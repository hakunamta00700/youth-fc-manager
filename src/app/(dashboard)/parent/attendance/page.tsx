"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const attendanceData: Record<string, "present" | "absent" | "late" | "none"> = {
  "2026-06-01": "none",
  "2026-06-02": "present",
  "2026-06-03": "none",
  "2026-06-04": "present",
  "2026-06-05": "none",
  "2026-06-06": "none",
  "2026-06-07": "none",
  "2026-06-08": "none",
  "2026-06-09": "present",
  "2026-06-10": "late",
  "2026-06-11": "present",
  "2026-06-12": "none",
  "2026-06-13": "none",
  "2026-06-14": "none",
  "2026-06-15": "none",
};

const statusColors: Record<string, string> = {
  present: "bg-green-500 text-white",
  absent: "bg-red-500 text-white",
  late: "bg-amber-400 text-white",
  none: "text-gray-400",
};

const statusLabels: Record<string, string> = {
  present: "출석",
  absent: "결석",
  late: "지각",
  none: "",
};

export default function ParentAttendancePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const navigateMonth = (delta: number) => {
    const newMonth = currentMonth + delta;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = (firstDayOfMonth.getDay() + 6) % 7; // Monday start

  const todayStr = today.toISOString().split("T")[0];

  const totalClasses = 20;
  const presentCount = 18;
  const lateCount = 1;
  const absentCount = 1;
  const attendanceRate = (presentCount / totalClasses) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">출석 현황</h2>
          <p className="mt-1 text-sm text-gray-500">
            김민재의 출석 기록을 확인하세요
          </p>
        </div>
        <Link
          href="/parent/attendance/request"
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          결석/조퇴 신청
        </Link>
      </div>

      {/* Today's Status */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-700">오늘 출석</p>
            <p className="mt-1 text-2xl font-bold text-green-800">정상 출석 중</p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-200">
            <Check className="h-7 w-7 text-green-700" />
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
          <div className="text-xl font-bold text-green-700">{presentCount}</div>
          <div className="mt-0.5 text-xs text-green-600">출석</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <div className="text-xl font-bold text-amber-700">{lateCount}</div>
          <div className="mt-0.5 text-xs text-amber-600">지각</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <div className="text-xl font-bold text-red-700">{absentCount}</div>
          <div className="mt-0.5 text-xs text-red-600">결석</div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-center">
          <div className="text-xl font-bold text-blue-700">{attendanceRate}%</div>
          <div className="mt-0.5 text-xs text-blue-600">출석률</div>
        </div>
      </div>

      {/* Monthly Calendar */}
      <Card title="월간 출석부">
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-gray-800">
            {currentYear}년 {currentMonth + 1}월
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = attendanceData[dateStr] || "none";
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const hasClass = status !== "none";

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  "relative flex flex-col items-center rounded-lg p-2 text-sm transition-colors",
                  isSelected && "ring-2 ring-blue-400",
                  isToday && !isSelected && "bg-blue-50",
                  "hover:bg-gray-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                    isToday && !status?.startsWith("bg")
                      ? "bg-blue-600 text-white"
                      : "text-gray-700",
                    status !== "none" && statusColors[status]
                  )}
                >
                  {day}
                </span>
                {hasClass && (
                  <span className="mt-0.5">
                    {status === "present" && (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                    {status === "absent" && (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    {status === "late" && (
                      <Clock className="h-3 w-3 text-amber-500" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-green-500" />
            <span className="text-xs text-gray-500">출석</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-amber-400" />
            <span className="text-xs text-gray-500">지각</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded bg-red-500" />
            <span className="text-xs text-gray-500">결석</span>
          </div>
        </div>
      </Card>

      {/* Recent Attendance History */}
      <Card title="최근 출석 기록">
        <div className="divide-y divide-gray-100">
          {[
            { date: "2026-06-11", content: "유치부 A 09:00-10:30", status: "present" as const },
            { date: "2026-06-10", content: "유치부 A 09:00-10:30", status: "late" as const },
            { date: "2026-06-09", content: "유치부 A 09:00-10:30", status: "present" as const },
            { date: "2026-06-04", content: "유치부 A 09:00-10:30", status: "present" as const },
            { date: "2026-06-02", content: "유치부 A 09:00-10:30", status: "present" as const },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{row.date}</p>
                <p className="text-xs text-gray-500">{row.content}</p>
              </div>
              <Badge
                variant={
                  row.status === "present"
                    ? "success"
                    : row.status === "late"
                      ? "warning"
                      : "danger"
                }
                size="sm"
              >
                {statusLabels[row.status]}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
