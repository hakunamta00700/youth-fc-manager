"use client";

import { useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  age: string;
  photo?: string;
  status: "present" | "absent" | "late" | "unchecked";
}

const classOptions = ["유치부 A", "유치부 B", "초등저 A", "초등저 B"];

const initialStudents: Student[] = [
  { id: "1", name: "김민재", age: "7세", status: "present" },
  { id: "2", name: "최유진", age: "8세", status: "present" },
  { id: "3", name: "박서준", age: "7세", status: "present" },
  { id: "4", name: "정예린", age: "6세", status: "present" },
  { id: "5", name: "홍지우", age: "7세", status: "late" },
  { id: "6", name: "강민서", age: "8세", status: "present" },
  { id: "7", name: "윤아린", age: "6세", status: "present" },
  { id: "8", name: "송지완", age: "7세", status: "present" },
  { id: "9", name: "임재현", age: "8세", status: "present" },
  { id: "10", name: "배준서", age: "7세", status: "absent" },
  { id: "11", name: "오수빈", age: "6세", status: "present" },
  { id: "12", name: "신유준", age: "7세", status: "present" },
];

const statusConfig = {
  present: {
    label: "출석",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-300",
    next: "late" as const,
  },
  late: {
    label: "지각",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-300",
    next: "absent" as const,
  },
  absent: {
    label: "결석",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-300",
    next: "present" as const,
  },
  unchecked: {
    label: "미체크",
    icon: Clock,
    color: "bg-gray-100 text-gray-500 border-gray-200",
    next: "present" as const,
  },
};

export default function CoachAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("유치부 A");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [date] = useState(() => new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const currentStatus = s.status;
        const config = statusConfig[currentStatus];
        return { ...s, status: config.next };
      })
    );
  };

  const filteredStudents = students.filter((s) =>
    s.name.includes(searchTerm)
  );

  const presentCount = students.filter(
    (s) => s.status === "present"
  ).length;
  const lateCount = students.filter((s) => s.status === "late").length;
  const absentCount = students.filter(
    (s) => s.status === "absent"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">출석 체크</h2>
        <p className="mt-1 text-sm text-gray-500">
          원생 상태를 탭하여 변경하세요
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            반
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            날짜
          </label>
          <input
            type="date"
            defaultValue={date}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            시간
          </label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
            <option>09:00-10:30</option>
            <option>11:00-12:30</option>
            <option>17:00-18:00</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-center">
          <div className="text-xl font-bold text-green-700">
            {presentCount}
          </div>
          <div className="text-xs text-green-600">출석</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
          <div className="text-xl font-bold text-amber-700">{lateCount}</div>
          <div className="text-xs text-amber-600">지각</div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
          <div className="text-xl font-bold text-red-700">
            {absentCount}
          </div>
          <div className="text-xs text-red-600">결석</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="원생 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Student Cards */}
      <Card
        title={`${selectedClass}`}
        subtitle={`${students.length}명`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filteredStudents.map((student) => {
            const config = statusConfig[student.status];
            const StatusIcon = config.icon;
            return (
              <button
                key={student.id}
                onClick={() => toggleStatus(student.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all active:scale-95",
                  config.color,
                  "min-h-[100px]"
                )}
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-bold shadow-sm">
                  {student.name[0]}
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold">
                    {student.name}
                  </div>
                  <div className="text-xs opacity-75">{student.age}</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium">
                  <StatusIcon className="h-3.5 w-3.5" />
                  {config.label}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800">
            <Save className="h-4 w-4" />
            출석 저장
          </button>
        </div>
      </Card>
    </div>
  );
}
