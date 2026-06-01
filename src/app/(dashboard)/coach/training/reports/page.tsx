"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  ChevronRight,
  Calendar,
  User,
  Star,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  studentName: string;
  month: string;
  year: number;
  score: number;
  grade: string;
  comment: string;
  coachName: string;
  date: string;
  read: boolean;
}

const reportsData: Report[] = [
  {
    id: "1",
    studentName: "김민재",
    month: "5월",
    year: 2026,
    score: 3.8,
    grade: "B+",
    comment: "전반적으로 꾸준한 성장을 보이고 있습니다. 드리블 능력이 특히 향상되었으며, 수비 포지셔닝에 대한 추가 지도가 필요합니다.",
    coachName: "박코치",
    date: "2026-05-31",
    read: true,
  },
  {
    id: "2",
    studentName: "최유진",
    month: "5월",
    year: 2026,
    score: 4.5,
    grade: "A",
    comment: "탁월한 훈련 태도와 리더십을 보여주고 있습니다. 패스와 드리블 모두 높은 수준이며, 팀 내에서 롤모델 역할을 잘 수행하고 있습니다.",
    coachName: "박코치",
    date: "2026-05-31",
    read: false,
  },
  {
    id: "3",
    studentName: "박서준",
    month: "5월",
    year: 2026,
    score: 3.2,
    grade: "B",
    comment: "체력 향상이 필요합니다. 슈팅 정확도는 좋아지고 있으나 지구력 훈련에 더 집중해야 합니다.",
    coachName: "박코치",
    date: "2026-05-31",
    read: true,
  },
  {
    id: "4",
    studentName: "정예린",
    month: "5월",
    year: 2026,
    score: 4.2,
    grade: "A-",
    comment: "태도가 매우 좋고 항상 최선을 다합니다. 기본기가 탄탄하며 앞으로의 성장이 기대됩니다.",
    coachName: "박코치",
    date: "2026-05-31",
    read: false,
  },
  {
    id: "5",
    studentName: "김민재",
    month: "4월",
    year: 2026,
    score: 3.5,
    grade: "B",
    comment: "기본기 훈련에 충실히 임하고 있습니다. 패스 정확도 향상이 필요합니다.",
    coachName: "박코치",
    date: "2026-04-30",
    read: true,
  },
];

const monthOptions = ["2026년 5월", "2026년 4월", "2026년 3월"];

export default function CoachTrainingReportsPage() {
  const [selectedMonth, setSelectedMonth] = useState("2026년 5월");
  const [reports] = useState<Report[]>(reportsData);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = reports.filter(
    (r) => `${r.year}년 ${r.month}` === selectedMonth
  );

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return "text-green-600";
    if (score >= 3.0) return "text-blue-600";
    if (score >= 2.0) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">성장 리포트</h2>
        <p className="mt-1 text-sm text-gray-500">
          월별 원생 리포트를 확인하세요
        </p>
      </div>

      {/* Month Select */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            월 선택
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="space-y-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className={cn(
              "rounded-xl border bg-white p-4 shadow-sm transition-all",
              selectedReport?.id === report.id
                ? "border-blue-300 ring-2 ring-blue-100"
                : "border-gray-200",
              !report.read && "border-l-4 border-l-blue-500"
            )}
            onClick={() => setSelectedReport(report)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {report.studentName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {report.studentName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {report.month} {report.year} · {report.coachName}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="mt-3 flex items-center gap-3">
                  <span
                    className={cn(
                      "text-lg font-bold",
                      getScoreColor(report.score)
                    )}
                  >
                    {report.score}
                  </span>
                  <Badge
                    variant={
                      report.score >= 4.0
                        ? "success"
                        : report.score >= 3.0
                          ? "info"
                          : "warning"
                    }
                  >
                    {report.grade}
                  </Badge>
                </div>

                {/* Comment Preview */}
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                  {report.comment}
                </p>
              </div>
            </div>

            {/* Actions */}
            {selectedReport?.id === report.id && (
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                  <Eye className="h-3.5 w-3.5" />
                  상세 보기
                </button>
                <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <Download className="h-3.5 w-3.5" />
                  PDF 저장
                </button>
              </div>
            )}
          </div>
        ))}

        {filteredReports.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              해당 월의 리포트가 없습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
