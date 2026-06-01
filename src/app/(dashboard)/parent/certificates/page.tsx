"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Award,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

type CertificateType = "training" | "attendance" | "enrollment";

interface CertificateRequest {
  id: string;
  type: CertificateType;
  date: string;
  status: "pending" | "approved" | "completed" | "rejected";
  detail: string;
}

const typeInfo: Record<CertificateType, { label: string; icon: React.ReactNode; desc: string }> = {
  training: {
    label: "훈련 증명서",
    icon: <TrendingUp className="h-6 w-6" />,
    desc: "훈련 기간, 내용, 평가 등 포함",
  },
  attendance: {
    label: "출석 증명서",
    icon: <CalendarCheck className="h-6 w-6" />,
    desc: "기간별 출석 현황 증명",
  },
  enrollment: {
    label: "수강 증명서",
    icon: <Award className="h-6 w-6" />,
    desc: "수강 기간 및 과정 증명",
  },
};

const dummyRequests: CertificateRequest[] = [
  {
    id: "1",
    type: "attendance",
    date: "2026-05-20",
    status: "completed",
    detail: "2026년 1월 ~ 5월 출석 증명",
  },
  {
    id: "2",
    type: "enrollment",
    date: "2026-05-15",
    status: "approved",
    detail: "유치부 A 수강 증명",
  },
  {
    id: "3",
    type: "training",
    date: "2026-06-01",
    status: "pending",
    detail: "2026년 상반기 훈련 증명",
  },
];

export default function ParentCertificatesPage() {
  const [selectedType, setSelectedType] = useState<CertificateType | null>(null);
  const [detail, setDetail] = useState("");
  const [requests, setRequests] = useState<CertificateRequest[]>(dummyRequests);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    if (!selectedType) return;
    const newReq: CertificateRequest = {
      id: String(Date.now()),
      type: selectedType,
      date: new Date().toISOString().split("T")[0],
      status: "pending",
      detail: detail || `${typeInfo[selectedType].label} 신청`,
    };
    setRequests((prev) => [newReq, ...prev]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setSelectedType(null);
    setDetail("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">증명서 발급</h2>
        <p className="mt-1 text-sm text-gray-500">
          각종 증명서를 신청하고 발급받으세요
        </p>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          증명서 신청이 접수되었습니다. 승인 후 다운로드 가능합니다.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Request */}
        <Card title="새 증명서 신청">
          <div className="space-y-5">
            {/* Type selection */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                증명서 유형
              </label>
              <div className="space-y-2">
                {(
                  [
                    ["training", "훈련 증명서"],
                    ["attendance", "출석 증명서"],
                    ["enrollment", "수강 증명서"],
                  ] as [CertificateType, string][]
                ).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedType(key)}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                      selectedType === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        selectedType === key
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {typeInfo[key].icon}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          selectedType === key ? "text-blue-700" : "text-gray-900"
                        }`}
                      >
                        {label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {typeInfo[key].desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Detail */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                상세 내용 (선택)
              </label>
              <textarea
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                placeholder="증명서에 포함할 내용이나 기간을 입력하세요..."
                rows={2}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedType}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500"
            >
              신청하기
            </button>
          </div>
        </Card>

        {/* Request History */}
        <Card title="신청 내역" subtitle="최근 5건">
          {requests.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              신청 내역이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {requests.map((req) => {
                const info = typeInfo[req.type];
                const statusConfig = {
                  pending: { label: "대기중", variant: "warning" as const },
                  approved: { label: "승인됨", variant: "info" as const },
                  completed: { label: "발급완료", variant: "success" as const },
                  rejected: { label: "반려", variant: "danger" as const },
                };
                const cfg = statusConfig[req.status];

                return (
                  <div key={req.id} className="flex items-start justify-between py-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                          req.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : req.status === "approved"
                              ? "bg-blue-100 text-blue-600"
                              : req.status === "rejected"
                                ? "bg-red-100 text-red-600"
                                : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {req.status === "completed" ? (
                          <Download className="h-4 w-4" />
                        ) : req.status === "approved" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : req.status === "rejected" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            {info.label}
                          </p>
                          {req.status === "completed" && (
                            <button className="flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                              <Download className="h-3 w-3" />
                              PDF
                            </button>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {req.date} · {req.detail}
                        </p>
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
      </div>
    </div>
  );
}
