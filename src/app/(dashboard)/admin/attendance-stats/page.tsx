"use client";

import { useState } from "react";
import { Calendar, AlertTriangle, TrendingUp, TrendingDown, Users, BarChart3, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const classAttendance = [
  { className: "유치부 A", rate: 92, color: "bg-green-500", studentCount: 12 },
  { className: "초등저 B", rate: 85, color: "bg-green-500", studentCount: 15 },
  { className: "초등고 A", rate: 73, color: "bg-yellow-500", studentCount: 18 },
  { className: "선수반", rate: 88, color: "bg-green-500", studentCount: 10 },
];

const lowAttendanceStudents = [
  { id: "1", name: "박지호", className: "초등고 A", rate: 62, trend: "down" as const },
  { id: "2", name: "정우성", className: "선수반", rate: 45, trend: "down" as const },
  { id: "3", name: "한소희", className: "초등저 B", rate: 58, trend: "up" as const },
];

const monthlyStats = [
  { month: "1월", rate: 88 },
  { month: "2월", rate: 91 },
  { month: "3월", rate: 85 },
  { month: "4월", rate: 89 },
  { month: "5월", rate: 82 },
  { month: "6월", rate: 78 },
];

export default function AttendanceStatsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026년 5월");
  const [selectedClass, setSelectedClass] = useState("all");

  const maxRate = Math.max(...monthlyStats.map((m) => m.rate));
  const overallRate = Math.round(
    classAttendance.reduce((sum, c) => sum + c.rate, 0) / classAttendance.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">출석 통계</h2>
        <p className="mt-1 text-sm text-gray-500">
          월별 출석률과 저조 원생을 확인합니다
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="전체 출석률"
          value={`${overallRate}%`}
          icon={<Users className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="이번 달 출석률"
          value="78%"
          trend="down"
          trendValue="4% 감소"
          icon={<Calendar className="h-6 w-6" />}
          color="#f59e0b"
        />
        <StatCard
          title="60% 미만 원생"
          value="3명"
          icon={<AlertTriangle className="h-6 w-6" />}
          color="#ef4444"
        />
        <StatCard
          title="평균 결석률"
          value="15%"
          trend="up"
          trendValue="2% 증가"
          icon={<BarChart3 className="h-6 w-6" />}
          color="#8b5cf6"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option>2026년 5월</option>
          <option>2026년 4월</option>
          <option>2026년 3월</option>
          <option>2026년 2월</option>
          <option>2026년 1월</option>
        </select>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">전체 반</option>
          <option>유치부 A</option>
          <option>초등저 B</option>
          <option>초등고 A</option>
          <option>선수반</option>
        </select>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <AlertTriangle className="h-4 w-4" />
          60% 미만 원생
          <Badge variant="danger" size="sm">3</Badge>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Attendance Chart */}
        <Card className="lg:col-span-2" title="반별 출석률">
          <div className="space-y-4">
            {classAttendance.map((cls) => {
              const barColor =
                cls.rate >= 80
                  ? "bg-green-500"
                  : cls.rate >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500";
              return (
                <div key={cls.className}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{cls.className}</span>
                      <span className="text-xs text-gray-400">({cls.studentCount}명)</span>
                    </div>
                    <span
                      className={`font-semibold ${
                        cls.rate >= 80
                          ? "text-green-600"
                          : cls.rate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {cls.rate}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-100">
                    <div
                      className={`h-2.5 rounded-full ${barColor} transition-all`}
                      style={{ width: `${cls.rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Low Attendance Students */}
        <Card
          title="출석률 60% 미만"
          className="border-red-200"
        >
          <div className="space-y-3">
            {lowAttendanceStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50/30 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.name}</p>
                  <p className="text-xs text-gray-500">
                    {student.className} · {student.rate}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`flex items-center text-xs font-medium ${
                      student.trend === "down" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {student.trend === "down" ? (
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    ) : (
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                    )}
                    {student.trend === "down" ? "하락" : "상승"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      alert(`${student.name} 학부모에게 출석 알림을 전송합니다.`)
                    }
                    className="flex h-7 w-7 items-center justify-center rounded text-blue-500 hover:bg-blue-100 transition-colors"
                    title="알림 전송"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card title="월별 출석률 추이">
        <div className="flex items-end gap-3 px-2" style={{ height: 180 }}>
          {monthlyStats.map((m) => (
            <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-gray-500">{m.rate}%</span>
              <div
                className="w-full rounded-t-md bg-blue-500 transition-all"
                style={{
                  height: `${(m.rate / maxRate) * 140}px`,
                  minHeight: "20px",
                }}
              />
              <span className="text-xs text-gray-500">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Detail Table */}
      <Card title="출석률 상세 현황">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">반</th>
                <th className="px-4 py-3">출석률</th>
                <th className="px-4 py-3">출석/전체</th>
                <th className="px-4 py-3">추세</th>
                <th className="px-4 py-3">알림</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "1", name: "김민재", className: "유치부 A", rate: 95, present: 19, total: 20, trend: "up" as const },
                { id: "2", name: "이서준", className: "초등저 B", rate: 88, present: 15, total: 17, trend: "up" as const },
                { id: "3", name: "박지호", className: "초등고 A", rate: 62, present: 13, total: 21, trend: "down" as const },
                { id: "4", name: "최유진", className: "유치부 A", rate: 92, present: 18, total: 20, trend: "up" as const },
                { id: "5", name: "정우성", className: "선수반", rate: 45, present: 9, total: 20, trend: "down" as const },
                { id: "6", name: "한소희", className: "초등저 B", rate: 78, present: 14, total: 18, trend: "up" as const },
              ].map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-gray-600">{student.className}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-medium ${
                        student.rate >= 80
                          ? "text-green-600"
                          : student.rate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                      }`}
                    >
                      {student.rate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {student.present}/{student.total}
                  </td>
                  <td className="px-4 py-3">
                    {student.trend === "up" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" /> 상승
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600">
                        <TrendingDown className="h-3 w-3" /> 하락
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {student.rate < 80 && (
                      <button
                        type="button"
                        onClick={() =>
                          alert(`${student.name} 학부모에게 알림을 전송합니다.`)
                        }
                        className="inline-flex items-center gap-1 rounded text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Send className="h-3 w-3" /> 전달
                      </button>
                    )}
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
