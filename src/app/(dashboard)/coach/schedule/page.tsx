"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface ScheduleItem {
  id: string;
  className: string;
  time: string;
  location: string;
  day: string;
  dayIndex: number;
  color: string;
  frequency: string;
}

const CLASS_COLORS: Record<string, string> = {
  "유치부 A": "bg-blue-100 border-blue-300 text-blue-700",
  "유치부 B": "bg-green-100 border-green-300 text-green-700",
  "초등저 A": "bg-amber-100 border-amber-300 text-amber-700",
  "초등저 B": "bg-purple-100 border-purple-300 text-purple-700",
  "초등고 A": "bg-rose-100 border-rose-300 text-rose-700",
  "선수반": "bg-indigo-100 border-indigo-300 text-indigo-700",
};

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const scheduleData: ScheduleItem[] = [
  {
    id: "1",
    className: "유치부 A",
    time: "09:00-10:30",
    location: "A구장",
    day: "화",
    dayIndex: 1,
    color: "blue",
    frequency: "매주 화/목",
  },
  {
    id: "2",
    className: "유치부 A",
    time: "09:00-10:30",
    location: "A구장",
    day: "목",
    dayIndex: 3,
    color: "blue",
    frequency: "매주 화/목",
  },
  {
    id: "3",
    className: "유치부 B",
    time: "17:00-18:00",
    location: "B구장",
    day: "수",
    dayIndex: 2,
    color: "green",
    frequency: "매주 수",
  },
  {
    id: "4",
    className: "초등저 A",
    time: "11:00-12:30",
    location: "A구장",
    day: "토",
    dayIndex: 5,
    color: "amber",
    frequency: "매주 토",
  },
  {
    id: "5",
    className: "6월 대회",
    time: "09:00-17:00",
    location: "종합운동장",
    day: "토",
    dayIndex: 5,
    color: "rose",
    frequency: "2026-06-15",
  },
];

const monthlyEvents = [
  { date: "2026-06-02", text: "유치부 A 09:00", color: "blue" },
  { date: "2026-06-04", text: "유치부 A 09:00", color: "blue" },
  { date: "2026-06-05", text: "유치부 B 17:00", color: "green" },
  { date: "2026-06-07", text: "초등저 A 11:00", color: "amber" },
  { date: "2026-06-09", text: "유치부 A 09:00", color: "blue" },
  { date: "2026-06-11", text: "유치부 A 09:00", color: "blue" },
  { date: "2026-06-12", text: "유치부 B 17:00", color: "green" },
  { date: "2026-06-14", text: "초등저 A 11:00", color: "amber" },
  { date: "2026-06-15", text: "6월 대회 09:00-17:00", color: "rose" },
];

export default function CoachSchedulePage() {
  const [viewMode, setViewMode] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 2));

  const tabs = [
    { id: "weekly", label: "주간" },
    { id: "monthly", label: "월간" },
  ];

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      week.push(d);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const formatDateShort = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDaySchedule = (dayIndex: number, dayDate?: Date) => {
    if (viewMode === "weekly") {
      return scheduleData.filter((s) => s.dayIndex === dayIndex);
    }
    if (dayDate) {
      const dateStr = dayDate.toISOString().split("T")[0];
      return monthlyEvents
        .filter((e) => e.date === dateStr)
        .map((e) => ({
          id: e.date + e.text,
          className: e.text.split(" ")[0],
          time: e.text.includes("09:00") ? "09:00-10:30" : e.text.includes("17:00") ? "17:00-18:00" : e.text.includes("11:00") ? "11:00-12:30" : "09:00-17:00",
          location: "",
          day: DAYS[dayIndex],
          dayIndex,
          color: e.color,
          frequency: "",
        }));
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">개인 시간표</h2>
        <p className="mt-1 text-sm text-gray-500">
          내 수업 일정을 한눈에 확인하세요
        </p>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={viewMode}
        onChange={setViewMode}
      />

      {/* Weekly View */}
      {viewMode === "weekly" && (
        <div className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateWeek(-1)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              이전 주
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {weekDates[0].getMonth() + 1}월 {weekDates[0].getDate()}일 -{" "}
              {weekDates[6].getMonth() + 1}월 {weekDates[6].getDate()}일
            </span>
            <button
              onClick={() => navigateWeek(1)}
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              다음 주
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekly Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {weekDates.map((date, idx) => {
              const daySchedule = getDaySchedule(idx);
              return (
                <div
                  key={idx}
                  className={cn(
                    "min-h-[120px] rounded-lg border p-2",
                    isToday(date)
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-200 bg-white"
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      {DAYS[idx]}
                    </span>
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                        isToday(date)
                          ? "bg-blue-600 text-white"
                          : "text-gray-700"
                      )}
                    >
                      {date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {daySchedule.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          "rounded-md border px-2 py-1 text-xs",
                          CLASS_COLORS[item.className] ||
                            "bg-gray-100 border-gray-200 text-gray-700"
                        )}
                      >
                        <div className="font-medium truncate">
                          {item.className}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] opacity-75">
                          <Clock className="h-3 w-3" />
                          {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Class List */}
          <Card title="내 수업 일정">
            <div className="divide-y divide-gray-100">
              {scheduleData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-3 w-3 rounded-full",
                        item.color === "blue" && "bg-blue-500",
                        item.color === "green" && "bg-green-500",
                        item.color === "amber" && "bg-amber-500",
                        item.color === "purple" && "bg-purple-500",
                        item.color === "rose" && "bg-rose-500",
                        item.color === "indigo" && "bg-indigo-500"
                      )}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.className}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.frequency} · {item.time}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      item.frequency === "필참"
                        ? "danger"
                        : item.frequency === "매주 화/목" ||
                            item.frequency === "매주 수" ||
                            item.frequency === "매주 토"
                          ? "info"
                          : "default"
                    }
                  >
                    {item.frequency}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Monthly View */}
      {viewMode === "monthly" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
              이전 달
            </button>
            <span className="text-sm font-semibold text-gray-800">
              2026년 6월
            </span>
            <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
              다음 달
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Card>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 px-3 py-2 text-center text-xs font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {(() => {
                const firstDay = new Date(2026, 5, 1);
                const startOffset = (firstDay.getDay() + 6) % 7;
                const daysInMonth = 30;
                const cells: React.ReactNode[] = [];

                // Empty cells before first day
                for (let i = 0; i < startOffset; i++) {
                  cells.push(
                    <div key={`empty-${i}`} className="bg-white p-2 min-h-[80px]" />
                  );
                }

                for (let day = 1; day <= daysInMonth; day++) {
                  const dateStr = `2026-06-${String(day).padStart(2, "0")}`;
                  const dayEvents = monthlyEvents.filter(
                    (e) => e.date === dateStr
                  );
                  cells.push(
                    <div
                      key={day}
                      className="bg-white p-2 min-h-[80px]"
                    >
                      <span className="text-xs font-medium text-gray-700">
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.map((event, ei) => (
                          <div
                            key={ei}
                            className={cn(
                              "rounded px-1 py-0.5 text-[10px] truncate text-white",
                              event.color === "blue" && "bg-blue-500",
                              event.color === "green" && "bg-green-500",
                              event.color === "amber" && "bg-amber-500",
                              event.color === "rose" && "bg-rose-500"
                            )}
                          >
                            {event.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return cells;
              })()}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
