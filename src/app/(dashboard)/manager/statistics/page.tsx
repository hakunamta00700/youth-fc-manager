"use client";

import { useState } from "react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Download,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

const REPORT_LIST = [
  { id: "r1", title: "6월 리포트", date: "2026-07-01", attendance: 84, payment: 68, achievement: 82 },
  { id: "r2", title: "5월 리포트", date: "2026-06-01", attendance: 82, payment: 72, achievement: 78 },
  { id: "r3", title: "4월 리포트", date: "2026-05-01", attendance: 79, payment: 75, achievement: 80 },
  { id: "r4", title: "3월 리포트", date: "2026-04-01", attendance: 86, payment: 70, achievement: 85 },
];

const PERIOD_OPTIONS = ["1개월", "3개월", "6개월", "1년"];
const ITEM_OPTIONS = ["출석률", "완납률", "목표 달성률", "수입/지출", "신규 등록"];

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6개월");
  const [selectedItem, setSelectedItem] = useState("출석률");
  const [selectedReport, setSelectedReport] = useState(REPORT_LIST[0]);

  const currentReport = selectedReport ?? REPORT_LIST[0];

  const handleExport = (format: "pdf" | "ppt") => {
    alert(`${format.toUpperCase()} 내보내기: ${currentReport.title}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">통계 리포트</h2>
          <p className="mt-1 text-sm text-gray-500">
            기간과 항목을 선택하여 리포트를 확인하고 내보낼 수 있습니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("pdf")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport("ppt")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            PPT
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">기간</span>
          <div className="flex gap-1">
            {PERIOD_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  selectedPeriod === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">항목</span>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {ITEM_OPTIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report list */}
        <div className="lg:col-span-1">
          <Card title="생성된 리포트">
            <div className="space-y-2">
              {REPORT_LIST.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition-colors ${
                    selectedReport?.id === report.id
                      ? "bg-blue-50 text-blue-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      <FileText className="mr-1.5 inline-block h-3.5 w-3.5" />
                      {report.title}
                    </span>
                    <span className="text-xs text-gray-400">{report.date}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Report detail */}
        <div className="lg:col-span-2">
          <Card title={`리포트 상세 (${currentReport.title})`} subtitle={`생성일: ${currentReport.date}`}>
            <div className="space-y-6">
              {/* Summary stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-gray-100 bg-white p-4 text-center">
                  <p className="text-sm text-gray-500">전체 출석률</p>
                  <p className="mt-1 text-3xl font-bold text-blue-600">{currentReport.attendance}%</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${currentReport.attendance}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 text-center">
                  <p className="text-sm text-gray-500">완납률</p>
                  <p className="mt-1 text-3xl font-bold text-green-600">{currentReport.payment}%</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${currentReport.payment}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-gray-100 bg-white p-4 text-center">
                  <p className="text-sm text-gray-500">목표 대비 달성률</p>
                  <p className="mt-1 text-3xl font-bold text-purple-600">{currentReport.achievement}%</p>
                  <div className="mt-2 h-2 rounded-full bg-gray-100">
                    <div
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${currentReport.achievement}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-8">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <BarChart3 className="h-12 w-12" />
                  <p className="mt-2 text-sm font-medium">차트 영역</p>
                  <p className="text-xs">
                    {selectedItem} · {selectedPeriod} 추이 그래프
                  </p>
                </div>
              </div>

              {/* Detailed metrics */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700">세부 지표</h4>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "전체 원생", value: "48명" },
                    { label: "신규 등록", value: "3명" },
                    { label: "퇴원", value: "1명" },
                    { label: "미납액", value: "₩3,250,000" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg border border-gray-100 px-3 py-2.5 text-center">
                      <p className="text-xs text-gray-500">{m.label}</p>
                      <p className="mt-0.5 text-sm font-semibold text-gray-900">{m.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                <button
                  onClick={() => handleExport("pdf")}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  PDF 다운로드
                </button>
                <button
                  onClick={() => handleExport("ppt")}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  PPT 다운로드
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
