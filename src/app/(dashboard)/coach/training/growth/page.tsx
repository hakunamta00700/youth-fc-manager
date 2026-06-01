"use client";

import { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

const studentOptions = ["김민재", "최유진", "박서준", "정예린"];

const radarData = [
  { category: "드리블", 현재: 4, 평균: 3.2, fullMark: 5 },
  { category: "패스", 현재: 3, 평균: 3.5, fullMark: 5 },
  { category: "슈팅", current: 4, average: 3.0, fullMark: 5 },
  { category: "수비", 현재: 2, 평균: 2.8, fullMark: 5 },
  { category: "체력", 현재: 3, 평균: 3.1, fullMark: 5 },
  { category: "태도", 현재: 5, 평균: 3.8, fullMark: 5 },
];

const radarDataTyped = radarData.map((d) => ({
  category: d.category,
  현재: d.현재,
  평균: d.평균 || d.average,
  fullMark: d.fullMark,
}));

const timelineData = [
  { month: "1월", 드리블: 2, 패스: 2, 슈팅: 3, 체력: 2 },
  { month: "2월", 드리블: 2, 패스: 3, 슈팅: 3, 체력: 2 },
  { month: "3월", 드리블: 3, 패스: 3, 슈팅: 3, 체력: 3 },
  { month: "4월", 드리블: 3, 패스: 3, 슈팅: 4, 체력: 3 },
  { month: "5월", 드리블: 4, 패스: 3, 슈팅: 4, 체력: 3 },
  { month: "6월", 드리블: 4, 패스: 3, 슈팅: 4, 체력: 3 },
];

const physicalData = [
  { name: "50m 달리기", value: 9.5, average: 10.2, unit: "초" },
  { name: "제자리멀리뛰기", value: 120, average: 110, unit: "cm" },
  { name: "윗몸일으키기", value: 15, average: 12, unit: "회" },
  { name: "유연성", value: 8, average: 6.5, unit: "cm" },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function CoachTrainingGrowthPage() {
  const [selectedStudent, setSelectedStudent] = useState("김민재");
  const [chartView, setChartView] = useState("radar");

  const tabs = [
    { id: "radar", label: "레이더 차트" },
    { id: "timeline", label: "시계열" },
    { id: "physical", label: "체력 측정" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">성장 그래프 조회</h2>
        <p className="mt-1 text-sm text-gray-500">
          원생별 성장 추이를 한눈에 확인하세요
        </p>
      </div>

      {/* Student Select */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            원생
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            {studentOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={chartView} onChange={setChartView} />

      {/* Radar Chart */}
      {chartView === "radar" && (
        <Card title="훈련 능력 레이더">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="75%"
                data={radarDataTyped}
              >
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 5]}
                  tick={{ fontSize: 10 }}
                />
                <Radar
                  name={selectedStudent}
                  dataKey="현재"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="반 평균"
                  dataKey="평균"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.15}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-blue-500" />
              {selectedStudent}
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-green-500" />
              반 평균
            </span>
          </div>
        </Card>
      )}

      {/* Timeline Chart */}
      {chartView === "timeline" && (
        <Card title="월별 능력 변화">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis domain={[0, 5]} fontSize={12} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="드리블"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="패스"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="슈팅"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="체력"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Physical Measurements */}
      {chartView === "physical" && (
        <Card title="체력 측정 비교">
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={physicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name={selectedStudent}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="average"
                  name="반 평균"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {physicalData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-2.5 text-sm"
              >
                <span className="text-gray-600">{item.name}</span>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-blue-700">
                    {item.value}{item.unit}
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    평균 {item.average}{item.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
