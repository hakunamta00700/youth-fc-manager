"use client";

import { useState } from "react";
import { DollarSign, Wallet, AlertTriangle, TrendingUp, Users, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

interface FeeStudent {
  id: string;
  name: string;
  className: string;
  monthlyFee: number;
  paidMonths: number;
  totalMonths: number;
  outstanding: number;
  status: "완납" | "미납" | "부분납";
}

const feeData: FeeStudent[] = [
  { id: "s1", name: "김민재", className: "유치부 A", monthlyFee: 150000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s2", name: "최유진", className: "유치부 A", monthlyFee: 150000, paidMonths: 2, totalMonths: 3, outstanding: 150000, status: "부분납" },
  { id: "s3", name: "박서준", className: "유치부 A", monthlyFee: 150000, paidMonths: 0, totalMonths: 3, outstanding: 450000, status: "미납" },
  { id: "s4", name: "이서준", className: "초등저 B", monthlyFee: 200000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s5", name: "한소희", className: "초등저 B", monthlyFee: 200000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s6", name: "정다인", className: "초등저 B", monthlyFee: 200000, paidMonths: 1, totalMonths: 3, outstanding: 400000, status: "부분납" },
  { id: "s7", name: "박지호", className: "초등고 A", monthlyFee: 250000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s8", name: "정우성", className: "초등고 A", monthlyFee: 250000, paidMonths: 0, totalMonths: 3, outstanding: 750000, status: "미납" },
  { id: "s9", name: "최민수", className: "선수반", monthlyFee: 300000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s10", name: "김도영", className: "선수반", monthlyFee: 300000, paidMonths: 2, totalMonths: 3, outstanding: 300000, status: "부분납" },
  { id: "s11", name: "이강인", className: "선수반", monthlyFee: 300000, paidMonths: 3, totalMonths: 3, outstanding: 0, status: "완납" },
  { id: "s12", name: "손흥민", className: "선수반", monthlyFee: 300000, paidMonths: 0, totalMonths: 2, outstanding: 600000, status: "미납" },
];

const CLASS_OPTIONS = ["전체", "유치부 A", "초등저 B", "초등고 A", "선수반"];
const STATUS_OPTIONS = ["전체", "완납", "미납", "부분납"];

function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString()}`;
}

export default function FeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");

  const totalFee = feeData.reduce((sum, s) => sum + s.monthlyFee * s.totalMonths, 0);
  const totalCollected = feeData.reduce((sum, s) => sum + s.monthlyFee * s.paidMonths, 0);
  const totalOutstanding = feeData.reduce((sum, s) => sum + s.outstanding, 0);
  const collectionRate = totalFee > 0 ? Math.round((totalCollected / totalFee) * 100) : 0;

  const paidCount = feeData.filter((s) => s.status === "완납").length;
  const partialCount = feeData.filter((s) => s.status === "부분납").length;
  const unpaidCount = feeData.filter((s) => s.status === "미납").length;

  const filteredData = feeData.filter((s) => {
    if (classFilter !== "전체" && s.className !== classFilter) return false;
    if (statusFilter !== "전체" && s.status !== statusFilter) return false;
    if (searchQuery && !s.name.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">회비 현황</h2>
        <p className="mt-1 text-sm text-gray-500">
          월별 회비 납부 현황을 확인하고 관리합니다
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="총 회비"
          value={formatCurrency(totalFee)}
          icon={<DollarSign className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="납부 완료"
          value={formatCurrency(totalCollected)}
          subtitle={`${paidCount}명 완납`}
          icon={<Wallet className="h-6 w-6" />}
          color="#059669"
        />
        <StatCard
          title="미납 금액"
          value={formatCurrency(totalOutstanding)}
          subtitle={`${unpaidCount}명 미납 · ${partialCount}명 부분납`}
          icon={<AlertTriangle className="h-6 w-6" />}
          color="#ef4444"
        />
        <StatCard
          title="수금율"
          value={`${collectionRate}%`}
          trend={collectionRate >= 70 ? "up" : "down"}
          trendValue={collectionRate >= 70 ? "양호" : "관리 필요"}
          icon={<TrendingUp className="h-6 w-6" />}
          color="#8b5cf6"
        />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="원생 이름 검색..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {CLASS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "전체" ? "전체 반" : opt}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "전체" ? "전체 상태" : opt}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>검색 결과: {filteredData.length}명</span>
          </div>
        </div>
      </Card>

      {/* Fee Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">반</th>
                <th className="px-4 py-3">월 회비</th>
                <th className="px-4 py-3">납부 현황</th>
                <th className="px-4 py-3">미납 금액</th>
                <th className="px-4 py-3">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    검색 조건에 맞는 결과가 없습니다
                  </td>
                </tr>
              ) : (
                filteredData.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                          {student.name[0]}
                        </div>
                        <span className="font-medium text-gray-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{student.className}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatCurrency(student.monthlyFee)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 rounded-full bg-gray-100">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{
                              width: `${(student.paidMonths / student.totalMonths) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {student.paidMonths}/{student.totalMonths}개월
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {student.outstanding > 0 ? (
                        <span className="font-medium text-red-600">
                          {formatCurrency(student.outstanding)}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          student.status === "완납"
                            ? "success"
                            : student.status === "부분납"
                              ? "warning"
                              : "danger"
                        }
                        size="sm"
                      >
                        {student.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Status Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">완납</p>
            <p className="text-xl font-bold text-green-700">{paidCount}명</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">부분납</p>
            <p className="text-xl font-bold text-yellow-700">{partialCount}명</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">미납</p>
            <p className="text-xl font-bold text-red-700">{unpaidCount}명</p>
          </div>
        </div>
      </div>
    </div>
  );
}
