"use client";

import { useState } from "react";
import {
  Search,
  Users,
  CalendarCheck,
  Star,
  Eye,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
  age: string;
  class: string;
  photo?: string;
  attendanceRate: number;
  recentGrade: string;
  parentName: string;
  parentPhone: string;
  joinDate: string;
  notes?: string;
}

const studentsData: Student[] = [
  {
    id: "1",
    name: "김민재",
    age: "7세",
    class: "유치부 A",
    attendanceRate: 95,
    recentGrade: "B",
    parentName: "김수현",
    parentPhone: "010-1234-5678",
    joinDate: "2026-03-01",
  },
  {
    id: "2",
    name: "최유진",
    age: "8세",
    class: "유치부 A",
    attendanceRate: 92,
    recentGrade: "A",
    parentName: "최미영",
    parentPhone: "010-2345-6789",
    joinDate: "2026-01-15",
  },
  {
    id: "3",
    name: "박서준",
    age: "7세",
    class: "유치부 A",
    attendanceRate: 78,
    recentGrade: "B",
    parentName: "박지원",
    parentPhone: "010-3456-7890",
    joinDate: "2026-02-20",
  },
  {
    id: "4",
    name: "정예린",
    age: "6세",
    class: "유치부 A",
    attendanceRate: 88,
    recentGrade: "A",
    parentName: "정수진",
    parentPhone: "010-4567-8901",
    joinDate: "2026-03-10",
  },
  {
    id: "5",
    name: "홍지우",
    age: "7세",
    class: "유치부 A",
    attendanceRate: 62,
    recentGrade: "C",
    parentName: "홍민수",
    parentPhone: "010-5678-9012",
    joinDate: "2026-04-01",
  },
  {
    id: "6",
    name: "강민서",
    age: "8세",
    class: "유치부 A",
    attendanceRate: 90,
    recentGrade: "B",
    parentName: "강태영",
    parentPhone: "010-6789-0123",
    joinDate: "2026-01-05",
  },
  {
    id: "7",
    name: "윤아린",
    age: "6세",
    class: "유치부 A",
    attendanceRate: 85,
    recentGrade: "B",
    parentName: "윤소희",
    parentPhone: "010-7890-1234",
    joinDate: "2026-03-20",
  },
  {
    id: "8",
    name: "송지완",
    age: "7세",
    class: "유치부 A",
    attendanceRate: 94,
    recentGrade: "A",
    parentName: "송민호",
    parentPhone: "010-8901-2345",
    joinDate: "2026-02-01",
  },
];

export default function CoachStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(
    null
  );

  const filteredStudents = studentsData.filter(
    (s) =>
      s.name.includes(searchTerm) ||
      s.parentName.includes(searchTerm)
  );

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 bg-green-50";
    if (rate >= 75) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getGradeVariant = (grade: string) => {
    switch (grade) {
      case "A":
        return "success" as const;
      case "B":
        return "info" as const;
      case "C":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">원생 조회</h2>
        <p className="mt-1 text-sm text-gray-500">
          담당반 원생 기본정보를 확인하세요 (읽기전용)
        </p>
      </div>

      {/* Class/Student Select and Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            반
          </label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none">
            <option>유치부 A</option>
            <option>유치부 B</option>
            <option>초등저 A</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            검색
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="원생 또는 학부모명 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Student Grid */}
      {!selectedStudent ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filteredStudents.map((student) => (
            <button
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="group rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {student.name[0]}
              </div>
              <h4 className="mt-2 text-sm font-semibold text-gray-900">
                {student.name}
              </h4>
              <p className="text-xs text-gray-500">
                {student.age} · {student.class}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    getAttendanceColor(student.attendanceRate)
                  )}
                >
                  <CalendarCheck className="mr-0.5 inline h-3 w-3" />
                  {student.attendanceRate}%
                </span>
                <Badge variant={getGradeVariant(student.recentGrade)}>
                  {student.recentGrade}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Student Detail View */
        <div className="space-y-4">
          <button
            onClick={() => setSelectedStudent(null)}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            목록으로
          </button>

          <Card>
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
                {selectedStudent.name[0]}
              </div>
              <div className="mt-3 sm:mt-0 flex-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedStudent.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedStudent.age} · {selectedStudent.class}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium",
                      getAttendanceColor(selectedStudent.attendanceRate)
                    )}
                  >
                    출석률 {selectedStudent.attendanceRate}%
                  </span>
                  <Badge
                    variant={getGradeVariant(selectedStudent.recentGrade)}
                  >
                    최근 평가 {selectedStudent.recentGrade}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    등록일: {selectedStudent.joinDate}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Parent Info */}
          <Card title="학부모 정보">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">보호자</span>
                <span className="text-sm font-medium text-gray-900">
                  {selectedStudent.parentName}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">연락처</span>
                <a
                  href={`tel:${selectedStudent.parentPhone}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {selectedStudent.parentPhone}
                </a>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-500">총 훈련일</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {selectedStudent.attendanceRate}%
              </div>
              <div className="text-xs text-gray-500">출석률</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-bold text-amber-600">
                {selectedStudent.recentGrade}
              </div>
              <div className="text-xs text-gray-500">최근 평가</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
