"use client";

import { useState } from "react";
import {
  DollarSign,
  Clock,
  Users,
  Send,
  Calculator,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

interface CoachSalary {
  id: string;
  name: string;
  classCount: number;
  totalHours: number;
  hourlyRate: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  status: "pending" | "completed" | "sent";
}

const COACH_DATA: CoachSalary[] = [
  { id: "c1", name: "박코치", classCount: 4, totalHours: 42, hourlyRate: 45000, baseSalary: 1890000, bonus: 200000, deduction: 50000, total: 2040000, status: "pending" },
  { id: "c2", name: "이코치", classCount: 3, totalHours: 36, hourlyRate: 40000, baseSalary: 1440000, bonus: 150000, deduction: 30000, total: 1560000, status: "completed" },
  { id: "c3", name: "최코치", classCount: 3, totalHours: 30, hourlyRate: 42000, baseSalary: 1260000, bonus: 100000, deduction: 20000, total: 1340000, status: "pending" },
  { id: "c4", name: "김코치", classCount: 2, totalHours: 24, hourlyRate: 38000, baseSalary: 912000, bonus: 50000, deduction: 0, total: 962000, status: "completed" },
];

const MONTHS = ["2026년 1월", "2026년 2월", "2026년 3월", "2026년 4월", "2026년 5월", "2026년 6월"];

export default function SalaryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026년 6월");
  const [coaches, setCoaches] = useState(COACH_DATA);

  const totalSalary = coaches.reduce((sum, c) => sum + c.total, 0);
  const totalHours = coaches.reduce((sum, c) => sum + c.totalHours, 0);

  const handleSendStatement = (coachId: string) => {
    const coach = coaches.find((c) => c.id === coachId);
    if (!coach) return;
    setCoaches((prev) =>
      prev.map((c) => (c.id === coachId ? { ...c, status: "sent" as const } : c))
    );
    alert(`${coach.name}님께 ${selectedMonth} 급여 명세서가 전송되었습니다.`);
  };

  const handleCalculateAll = () => {
    alert(`전체 코치 급여가 계산되었습니다. (총 ${totalSalary.toLocaleString()}원)`);
    setCoaches((prev) => prev.map((c) => ({ ...c, status: "completed" as const })));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">미정산</Badge>;
      case "completed":
        return <Badge variant="info">정산 완료</Badge>;
      case "sent":
        return <Badge variant="success">명세서 전송</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">급여 정산</h2>
          <p className="mt-1 text-sm text-gray-500">
            코치별 수업 시간을 계산하고 급여 명세서를 전송합니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {MONTHS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button
            onClick={handleCalculateAll}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Calculator className="h-4 w-4" />
            전체 정산
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="총 급여"
          value={`₩${totalSalary.toLocaleString()}`}
          subtitle={`${selectedMonth} 기준`}
          icon={<DollarSign className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="총 수업 시간"
          value={`${totalHours}시간`}
          subtitle={`코치 ${coaches.length}명`}
          icon={<Clock className="h-6 w-6" />}
          color="#059669"
        />
        <StatCard
          title="평균 시급"
          value={`₩${Math.round(totalSalary / totalHours).toLocaleString()}`}
          subtitle="전체 코치 평균"
          icon={<Users className="h-6 w-6" />}
          color="#f59e0b"
        />
      </div>

      {/* Coach salary list */}
      <Card title="코치별 급여明细" subtitle={`${selectedMonth} 정산 내역`}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">코치명</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">담당 수업</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">수업 시간</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">시급</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">기본 급여</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">수당</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">공제</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">총 지급액</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">상태</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {coaches.map((coach) => (
                <tr key={coach.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {coach.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">
                    {coach.classCount}개
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">
                    {coach.totalHours}시간
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600">
                    ₩{coach.hourlyRate.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">
                    ₩{coach.baseSalary.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-green-600">
                    +₩{coach.bonus.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-500">
                    -₩{coach.deduction.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-blue-600">
                    ₩{coach.total.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    {getStatusBadge(coach.status)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleSendStatement(coach.id)}
                        disabled={coach.status === "sent"}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send className="h-3 w-3" />
                        명세서
                      </button>
                      <button
                        onClick={() => alert(`${coach.name} 상세 급여 내역`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            총 {coaches.length}명 · 합계{" "}
            <span className="font-bold text-blue-600">₩{totalSalary.toLocaleString()}</span>
          </p>
          <button
            onClick={() => alert("일괄 명세서 전송")}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
            전체 명세서 전송
          </button>
        </div>
      </Card>

      {/* Attendance sync info */}
      <Card title="출석 연동 정보" subtitle="출석 데이터 기반 자동 계산">
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">이번 달 전체 출석률</p>
              <p className="text-xs text-gray-500">출석 데이터와 연동되어 자동 계산됩니다</p>
            </div>
            <span className="text-lg font-bold text-green-600">89%</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">수업 차감 내역</p>
              <p className="text-xs text-gray-500">휴강·대체 수업 반영</p>
            </div>
            <span className="text-sm font-medium text-gray-700">2건</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">특강 추가 수당</p>
              <p className="text-xs text-gray-500">6월 특강 3회</p>
            </div>
            <span className="text-sm font-medium text-green-600">+₩150,000</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
