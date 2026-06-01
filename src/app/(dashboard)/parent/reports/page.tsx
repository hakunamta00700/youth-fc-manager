"use client";

import { useState } from "react";
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  User,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

interface EvaluationItem {
  label: string;
  score: number;
  level: string;
  color: string;
}

const evaluationData: EvaluationItem[] = [
  { label: "드리블", score: 75, level: "B", color: "#3b82f6" },
  { label: "패스", score: 70, level: "B", color: "#8b5cf6" },
  { label: "슈팅", score: 85, level: "A", color: "#10b981" },
  { label: "수비", score: 55, level: "C", color: "#f59e0b" },
  { label: "체력", score: 65, level: "B", color: "#06b6d4" },
  { label: "협력", score: 80, level: "A", color: "#ec4899" },
];

const monthlyScores = [
  { month: "1월", score: 65 },
  { month: "2월", score: 68 },
  { month: "3월", score: 72 },
  { month: "4월", score: 70 },
  { month: "5월", score: 76 },
  { month: "6월", score: 72 },
];

export default function ParentReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026년 5월");
  const [expandedComment, setExpandedComment] = useState(true);

  const avgScore =
    evaluationData.reduce((sum, item) => sum + item.score, 0) /
    evaluationData.length;

  const radarPoints = evaluationData.map(
    (item, i) => `${i === 0 ? "M" : "L"} ${150 + 120 * Math.cos((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (item.score / 100)} ${150 + 120 * Math.sin((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (item.score / 100)}`
  );
  const radarPath = radarPoints.join(" ") + " Z";

  const gridPoints = [20, 40, 60, 80, 100].map((pct) => {
    return evaluationData
      .map(
        (_, i) =>
          `${150 + 120 * Math.cos((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (pct / 100)} ${150 + 120 * Math.sin((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (pct / 100)}`
      )
      .join(" ");
  });

  const maxScore = Math.max(...monthlyScores.map((s) => s.score));
  const chartHeight = 180;
  const chartWidth = 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">성장 리포트</h2>
        <p className="mt-1 text-sm text-gray-500">
          김민재의 훈련 평가와 성장 추이를 확인하세요
        </p>
      </div>

      {/* Month Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">조회월</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option>2026년 6월</option>
          <option>2026년 5월</option>
          <option>2026년 4월</option>
          <option>2026년 3월</option>
        </select>
      </div>

      {/* Radar Chart & Monthly Trend */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Radar Chart Card */}
        <Card title="종합 평가" subtitle="6개 항목 평가">
          <div className="flex flex-col items-center">
            {/* SVG Radar Chart */}
            <svg
              viewBox="0 0 300 300"
              className="h-64 w-64"
            >
              {/* Grid */}
              {gridPoints.map((points, i) => (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
              {/* Axes */}
              {evaluationData.map((_, i) => {
                const x =
                  150 + 120 * Math.cos((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2);
                const y =
                  150 + 120 * Math.sin((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2);
                return (
                  <line
                    key={i}
                    x1={150}
                    y1={150}
                    x2={150 + x}
                    y2={150 + y}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                );
              })}
              {/* Data Polygon */}
              <path
                d={radarPath}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              {/* Labels */}
              {evaluationData.map((item, i) => {
                const x =
                  150 +
                  140 * Math.cos((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2);
                const y =
                  150 +
                  140 * Math.sin((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2);
                return (
                  <text
                    key={i}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-gray-600 text-[11px]"
                  >
                    {item.label}
                  </text>
                );
              })}
              {/* Score dots */}
              {evaluationData.map((item, i) => {
                const x =
                  150 + 120 * Math.cos((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (item.score / 100);
                const y =
                  150 + 120 * Math.sin((Math.PI * 2 * i) / evaluationData.length - Math.PI / 2) * (item.score / 100);
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill={item.color}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="fill-gray-800 text-[10px] font-bold"
                    >
                      {item.level}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-2 grid w-full grid-cols-3 gap-1">
              {evaluationData.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.label} {item.level}
                  </span>
                </div>
              ))}
            </div>

            {/* Average */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                종합 평균 {Math.round(avgScore)}점 / {Math.round(avgScore / 20)}등급
              </span>
            </div>
          </div>
        </Card>

        {/* Monthly Trend Card */}
        <Card title="월별 성장 추이" subtitle="6개월 추이">
          <div className="flex items-end justify-between gap-1" style={{ height: chartHeight + 40 }}>
            {monthlyScores.map((m, i) => {
              const barHeight = (m.score / maxScore) * (chartHeight - 20);
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-500">
                    {m.score}
                  </span>
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${barHeight}px`,
                      backgroundColor: m.score >= 75 ? "#10b981" : m.score >= 65 ? "#3b82f6" : "#f59e0b",
                    }}
                  />
                  <span className="text-[10px] text-gray-500">{m.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>전월 대비 4점 상승 (+5.9%)</span>
          </div>
        </Card>
      </div>

      {/* Attendance Rate */}
      <Card title="출석률">
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-green-400 bg-green-50">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">95%</div>
              <div className="text-[10px] text-green-600">출석률</div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">총 수업</span>
              <span className="font-medium text-gray-900">20회</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">출석</span>
              <span className="font-medium text-green-700">19회</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">결석</span>
              <span className="font-medium text-red-600">1회</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">지각</span>
              <span className="font-medium text-amber-600">0회</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Coach Comment */}
      <Card title="코치 코멘트">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            박
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">
                박코치 <span className="font-normal text-gray-400">· 담당 코치</span>
              </p>
              <button
                onClick={() => setExpandedComment(!expandedComment)}
                className="text-gray-400 hover:text-gray-600"
              >
                {expandedComment ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>
            {expandedComment && (
              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                김민재는 최근 드리블 실력이 많이 향상되었습니다. 특히 1:1 상황에서
                자신감을 가지고 플레이하는 모습이 인상적입니다. 수비 포지셔닝에 조금 더
                집중하면 좋겠습니다. 항상 열심히 참여해주고 있고, 팀원들과의 협력도
                좋습니다. 앞으로도 꾸준히 발전할 것으로 기대됩니다.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
