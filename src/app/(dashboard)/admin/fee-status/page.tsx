"use client";

import { useState } from "react";
import { DollarSign, AlertTriangle, TrendingUp, ArrowUpCircle, Wallet } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

const feeStats = {
  monthlyIncome: 18500000,
  unpaid: 3250000,
  goalRate: 68,
  monthlyGrowth: "+12%",
};

const monthlyData = [
  { month: "1월", income: 120, color: "#2563eb" },
  { month: "2월", income: 140, color: "#2563eb" },
  { month: "3월", income: 130, color: "#2563eb" },
  { month: "4월", income: 160, color: "#2563eb" },
  { month: "5월", income: 150, color: "#2563eb" },
  { month: "6월", income: 110, color: "#f59e0b" },
];

const classUnpaid = [
  { className: "초등고 A", amount: 1200000 },
  { className: "선수반", amount: 900000 },
  { className: "초등저 B", amount: 650000 },
  { className: "유치부 A", amount: 500000 },
];

const studentFees = [
  { id: "1", name: "김민재", className: "유치부 A", fee: 150000, status: "완납" as const, dueDate: "2025-06-10", paidDate: "2025-06-01" },
  { id: "2", name: "이서준", className: "초등저 B", fee: 180000, status: "완납" as const, dueDate: "2025-06-10", paidDate: "2025-06-03" },
  { id: "3", name: "박지호", className: "초등고 A", fee: 200000, status: "미납" as const, dueDate: "2025-06-10", paidDate: "-" },
  { id: "4", name: "최유진", className: "유치부 A", fee: 150000, status: "완납" as const, dueDate: "2025-06-10", paidDate: "2025-05-30" },
  { id: "5", name: "정우성", className: "선수반", fee: 250000, status: "미납" as const, dueDate: "2025-06-10", paidDate: "-" },
  { id: "6", name: "한소희", className: "초등저 B", fee: 180000, status: "완납" as const, dueDate: "2025-06-10", paidDate: "2025-06-02" },
];

export default function FeeStatusPage() {
  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  const maxIncome = Math.max(...monthlyData.map((d) => d.income));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">회비 현황</h2>
        <p className="mt-1 text-sm text-gray-500">전체 회비 납부 현황을 확인합니다</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="이번 달 수입"
          value={formatCurrency(feeStats.monthlyIncome)}
          icon={<Wallet className="h-6 w-6" />}
          color="#059669"
        />
        <StatCard
          title="미납 금액"
          value={formatCurrency(feeStats.unpaid)}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="#ef4444"
        />
        <StatCard
          title="목표 달성률"
          value={`${feeStats.goalRate}%`}
          icon={<ArrowUpCircle className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="전월 대비"
          value={feeStats.monthlyGrowth}
          icon={<TrendingUp className="h-6 w-6" />}
          color="#f59e0b"
          trend="up"
          trendValue="증가"
        />
      </div>

      {/* Goal Progress Bar */}
      <Card title="목표 달성 현황">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">월 목표: {formatCurrency(27000000)}</span>
            <span className="font-medium text-blue-600">{feeStats.goalRate}% 달성</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-100">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all"
              style={{ width: `${feeStats.goalRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            잔여 목표: {formatCurrency(27000000 - feeStats.monthlyIncome)} · 목표일까지 20일 남음
          </p>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Chart */}
        <Card className="lg:col-span-2" title="월별 수입 추이">
          <div className="flex items-end gap-3 px-2" style={{ height: 180 }}>
            {monthlyData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(d.income / maxIncome) * 160}px`,
                    backgroundColor: d.color,
                    minHeight: "20px",
                  }}
                />
                <span className="text-xs text-gray-500">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Class Unpaid Summary */}
        <Card title="반별 미납">
          <div className="space-y-2">
            {classUnpaid.map((cls) => (
              <div
                key={cls.className}
                className="flex items-center justify-between border-b border-gray-50 py-2 last:border-0"
              >
                <span className="font-medium text-gray-900">{cls.className}</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(cls.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Fee Status Table */}
      <Card title="학생별 납부 현황">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">반</th>
                <th className="px-4 py-3">회비</th>
                <th className="px-4 py-3">상태</th>
                <th className="px-4 py-3">납부 기한</th>
                <th className="px-4 py-3">납부일</th>
              </tr>
            </thead>
            <tbody>
              {studentFees.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{student.name}</td>
                  <td className="px-4 py-3 text-gray-600">{student.className}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatCurrency(student.fee)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={student.status === "완납" ? "success" : "danger"}
                      size="sm"
                    >
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{student.dueDate}</td>
                  <td className="px-4 py-3 text-gray-600">{student.paidDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
