"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Filter,
  Download,
  Award,
  School,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type EventType = "class" | "competition" | "holiday" | "event";
type FilterType = EventType | "all";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: EventType;
  color: string;
}

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

const events: CalendarEvent[] = [
  {
    id: "1",
    title: "유치부 A 정규 수업",
    date: "2026-06-02",
    time: "09:00-10:30",
    location: "A구장",
    type: "class",
    color: "blue",
  },
  {
    id: "2",
    title: "유치부 A 정규 수업",
    date: "2026-06-04",
    time: "09:00-10:30",
    location: "A구장",
    type: "class",
    color: "blue",
  },
  {
    id: "3",
    title: "6월 대회",
    date: "2026-06-15",
    time: "09:00-17:00",
    location: "종합운동장",
    type: "competition",
    color: "rose",
  },
  {
    id: "4",
    title: "여름방학 특강",
    date: "2026-07-20",
    time: "09:00-12:00",
    location: "실내훈련장",
    type: "event",
    color: "green",
  },
  {
    id: "5",
    title: "휴원 (현충일)",
    date: "2026-06-06",
    time: "종일",
    location: "",
    type: "holiday",
    color: "gray",
  },
];

const typeColors: Record<EventType, string> = {
  class: "bg-blue-100 border-blue-300 text-blue-700",
  competition: "bg-rose-100 border-rose-300 text-rose-700",
  holiday: "bg-gray-100 border-gray-300 text-gray-600",
  event: "bg-green-100 border-green-300 text-green-700",
};

const typeLabels: Record<EventType, string> = {
  class: "수업",
  competition: "대회",
  holiday: "휴원",
  event: "행사",
};

export default function ParentCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const navigateMonth = (delta: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = (firstDay.getDay() + 6) % 7;

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => {
      if (typeFilter !== "all" && e.type !== typeFilter) return false;
      return e.date === dateStr;
    });
  };

  const filteredEvents = events.filter(
    (e) => typeFilter === "all" || e.type === typeFilter
  );

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "전체" },
    { id: "class", label: "수업" },
    { id: "competition", label: "대회" },
    { id: "holiday", label: "휴원" },
    { id: "event", label: "행사" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">통합 캘린더</h2>
          <p className="mt-1 text-sm text-gray-500">
            수업, 대회, 휴원 일정을 한눈에
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
          <Download className="h-4 w-4" />
          내보내기
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              typeFilter === f.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <Card>
        {/* Month Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
            이전 달
          </button>
          <span className="text-base font-semibold text-gray-800">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            다음 달
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {DAYS.map((day) => (
            <div
              key={day}
              className="bg-gray-50 px-2 py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white p-1 min-h-[80px]" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isToday =
              day === new Date().getDate() &&
              month === new Date().getMonth() &&
              year === new Date().getFullYear();

            return (
              <div
                key={day}
                className={`bg-white p-1 min-h-[80px] ${
                  isToday ? "bg-blue-50" : ""
                }`}
              >
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday ? "bg-blue-600 text-white" : "text-gray-700"
                  }`}
                >
                  {day}
                </span>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`w-full rounded px-1 py-0.5 text-[10px] text-left truncate text-white ${
                        evt.color === "blue"
                          ? "bg-blue-500"
                          : evt.color === "rose"
                            ? "bg-rose-500"
                            : evt.color === "green"
                              ? "bg-green-500"
                              : "bg-gray-400"
                      }`}
                    >
                      {evt.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Event Detail Panel */}
      {selectedEvent && (
        <Card title="일정 상세">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className={`rounded-lg px-2 py-1 text-xs font-medium ${
                  typeColors[selectedEvent.type]
                }`}
              >
                {typeLabels[selectedEvent.type]}
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {selectedEvent.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">날짜</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">시간</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.time}
                  </p>
                </div>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">장소</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                캘린더에 추가
              </button>
              {selectedEvent.type === "competition" && (
                <button
                  onClick={() => {
                    window.location.href = `/parent/competitions/${selectedEvent.id}`;
                  }}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700"
                >
                  상세 보기
                </button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Event List */}
      <Card title="전체 일정" subtitle={`${filteredEvents.length}개`}>
        <div className="divide-y divide-gray-100">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-center gap-3 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-1 -mx-1"
              onClick={() => setSelectedEvent(evt)}
            >
              <div
                className={`h-3 w-3 flex-shrink-0 rounded-full ${
                  evt.color === "blue"
                    ? "bg-blue-500"
                    : evt.color === "rose"
                      ? "bg-rose-500"
                      : evt.color === "green"
                        ? "bg-green-500"
                        : "bg-gray-400"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {evt.title}
                </p>
                <p className="text-xs text-gray-500">
                  {evt.date} · {evt.time}
                  {evt.location && ` · ${evt.location}`}
                </p>
              </div>
              <Badge
                variant={
                  evt.type === "class"
                    ? "info"
                    : evt.type === "competition"
                      ? "danger"
                      : evt.type === "holiday"
                        ? "default"
                        : "success"
                }
                size="sm"
              >
                {typeLabels[evt.type]}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
