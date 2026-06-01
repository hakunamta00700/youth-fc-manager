"use client";

import { useState } from "react";
import { CalendarCheck, X, AlertCircle, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

type RequestType = "absent" | "early_leave" | "late";
type RequestReason =
  | "sick"
  | "family"
  | "personal"
  | "school"
  | "weather"
  | "other";

interface AbsenceRequest {
  id: string;
  type: RequestType;
  reason: RequestReason;
  date: string;
  detail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const typeLabels: Record<RequestType, string> = {
  absent: "결석",
  early_leave: "조퇴",
  late: "지각",
};

const reasonLabels: Record<RequestReason, string> = {
  sick: "질병",
  family: "가족 행사",
  personal: "개인 사정",
  school: "학교 일정",
  weather: "기상 악화",
  other: "기타",
};

const statusConfig = {
  pending: { label: "대기중", variant: "warning" as const },
  approved: { label: "승인됨", variant: "success" as const },
  rejected: { label: "반려", variant: "danger" as const },
};

export default function ParentAttendanceRequestPage() {
  const [step, setStep] = useState<"form" | "history">("form");
  const [type, setType] = useState<RequestType>("absent");
  const [reason, setReason] = useState<RequestReason>("sick");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [detail, setDetail] = useState("");
  const [requests, setRequests] = useState<AbsenceRequest[]>([
    {
      id: "1",
      type: "absent",
      reason: "sick",
      date: "2026-05-23",
      detail: "감기로 인한 결석",
      status: "approved",
      createdAt: "2026-05-22",
    },
    {
      id: "2",
      type: "late",
      reason: "personal",
      date: "2026-05-10",
      detail: "병원 방문으로 지각",
      status: "pending",
      createdAt: "2026-05-09",
    },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const newRequest: AbsenceRequest = {
      id: String(Date.now()),
      type,
      reason,
      date,
      detail,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setRequests((prev) => [newRequest, ...prev]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setDetail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            결석·조퇴 신청
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            미리 신청하여 담당 코치에게 전달됩니다
          </p>
        </div>
        <Link
          href="/parent/attendance"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          ← 출석 현황
        </Link>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check className="h-5 w-5 flex-shrink-0" />
          신청이 제출되었습니다. 담당 코치가 확인 후 승인합니다.
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setStep("form")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            step === "form"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          새 신청
        </button>
        <button
          onClick={() => setStep("history")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            step === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          신청 내역
        </button>
      </div>

      {step === "form" ? (
        <Card title="신청 정보 입력">
          <div className="space-y-5">
            {/* Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                유형
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["absent", "결석"],
                    ["early_leave", "조퇴"],
                    ["late", "지각"],
                  ] as [RequestType, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setType(key)}
                    className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all ${
                      type === key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                날짜
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                사유
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {(
                  [
                    ["sick", "질병"],
                    ["family", "가족 행사"],
                    ["personal", "개인 사정"],
                    ["school", "학교 일정"],
                    ["weather", "기상 악화"],
                    ["other", "기타"],
                  ] as [RequestReason, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setReason(key)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      reason === key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                상세 사유 (선택)
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="자세한 사유를 입력해주세요..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              신청 제출
            </button>
          </div>
        </Card>
      ) : (
        <Card title="신청 내역">
          {requests.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              신청 내역이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => {
                const cfg = statusConfig[req.status];
                return (
                  <div key={req.id} className="flex items-start justify-between py-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                          req.status === "approved"
                            ? "bg-green-100 text-green-600"
                            : req.status === "rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {req.status === "approved" ? (
                          <Check className="h-4 w-4" />
                        ) : req.status === "rejected" ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {typeLabels[req.type]} - {reasonLabels[req.reason]}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {req.date}
                        </p>
                        {req.detail && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {req.detail}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge variant={cfg.variant} size="sm">
                      {cfg.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
