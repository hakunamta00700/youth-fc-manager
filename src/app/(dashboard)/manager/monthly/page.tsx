"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

const MONTHLY_DATA = [
  { month: "1월", income: 17200000, expense: 520000, net: 16680000, overdue: 2100000 },
  { month: "2월", income: 17800000, expense: 480000, net: 17320000, overdue: 1800000 },
  { month: "3월", income: 18000000, expense: 610000, net: 17390000, overdue: 1500000 },
  { month: "4월", income: 18500000, expense: 380000, net: 18120000, overdue: 1200000 },
  { month: "5월", income: 18200000, expense: 550000, net: 17650000, overdue: 3250000 },
  { month: "6월", income: 18500000, expense: 450000, net: 18050000, overdue: 3250000 },
];

const INCOME_ITEMS = [
  { category: "회비 수입", amount: 16500000, ratio: 89 },
  { category: "체험비", amount: 1200000, ratio: 6.5 },
  { category: "특강 수입", amount: 800000, ratio: 4.3 },
  { category: "기타 수입", amount: 50000, ratio: 0.2 },
];

const EXPENSE_ITEMS = [
  { category: "코치 급여", amount: 3200000, ratio: 71 },
  { category: "시설 관리비", amount: 600000, ratio: 13.3 },
  { category: "차량 유지비", amount: 350000, ratio: 7.8 },
  { category: "용품 구매", amount: 250000, ratio: 5.6 },
  { category: "기타 지출", amount: 100000, ratio: 2.3 },
];

export default function MonthlyPage() {
  const [selectedMonth, setSelectedMonth] = useState("6월");
  const [tabView, setTabView] = useState("income");
  const current = MONTHLY_DATA.find((d) => d.month === selectedMonth) ?? MONTHLY_DATA[5];

  const tabs = [
    { id: "income", label: "수입 상세" },
    { id: "expense", label: "지출 상세" },
    { id: "trend", label: "6개월 추이" },
  ];

  const handleExport = (format: "pdf" | "xlsx") => {
    alert(`${format.toUpperCase()} 내보내기: ${selectedMonth} 결산 자료`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">월별 결산 상세</h2>
          <p className="mt-1 text-sm text-gray-500">
            항목별 수입/지출 현황을 한눈에 확인하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {MONTHLY_DATA.map((d) => (
              <option key={d.month} value={d.month}>
                2026년 {d.month}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport("xlsx")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            엑셀
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="이번 달 수입"
          value={`₩${(current.income / 10000).toLocaleString()}만`}
          subtitle={`${selectedMonth} 총 수입`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="#059669"
          trend="up"
          trendValue="전월 대비 +1.6%"
        />
        <StatCard
          title="이번 달 지출"
          value={`₩${(current.expense / 10000).toLocaleString()}만`}
          subtitle={`${selectedMonth} 총 지출`}
          icon={<TrendingDown className="h-6 w-6" />}
          color="#dc2626"
          trend="down"
          trendValue="전월 대비 -18.2%"
        />
        <StatCard
          title="순수익"
          value={`₩${(current.net / 10000).toLocaleString()}만`}
          subtitle={`${selectedMonth} 순수익`}
          icon={<DollarSign className="h-6 w-6" />}
          color="#2563eb"
        />
      </div>

      {/* Detail section */}
      <Card>
        <Tabs tabs={tabs} activeTab={tabView} onChange={setTabView} />

        <div className="mt-4">
          {tabView === "income" && (
            <div className="space-y-3">
              {INCOME_ITEMS.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    <div className="mt-1 h-2 w-48 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${item.ratio}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">
                      +₩{item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{item.ratio}%</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-semibold text-gray-900">합계</span>
                <span className="text-sm font-bold text-green-600">
                  +₩{(current.income).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {tabView === "expense" && (
            <div className="space-y-3">
              {EXPENSE_ITEMS.map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.category}</p>
                    <div className="mt-1 h-2 w-48 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${item.ratio}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-red-600">
                      -₩{item.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{item.ratio}%</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm font-semibold text-gray-900">합계</span>
                <span className="text-sm font-bold text-red-600">
                  -₩{(current.expense).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {tabView === "trend" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">월</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">수입</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">지출</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">순수익</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">미납</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {MONTHLY_DATA.map((d) => (
                      <tr
                        key={d.month}
                        className={`transition-colors hover:bg-gray-50 ${
                          d.month === selectedMonth ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                          {d.month}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-green-600">
                          ₩{(d.income / 10000).toLocaleString()}만
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-600">
                          ₩{(d.expense / 10000).toLocaleString()}만
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-blue-600">
                          ₩{(d.net / 10000).toLocaleString()}만
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-500">
                          ₩{(d.overdue / 10000).toLocaleString()}만
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => handleExport("pdf")}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  PDF 저장
                </button>
                <button
                  onClick={() => handleExport("xlsx")}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  엑셀 저장
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
