"use client";

import { useState } from "react";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";

interface FeeRecord {
  month: string;
  amount: number;
  paidDate: string;
  status: "paid" | "pending" | "overdue";
}

const feeHistory: FeeRecord[] = [
  { month: "2026년 6월", amount: 350000, paidDate: "-", status: "pending" },
  { month: "2026년 5월", amount: 350000, paidDate: "2026-05-02", status: "paid" },
  { month: "2026년 4월", amount: 350000, paidDate: "2026-04-01", status: "paid" },
  { month: "2026년 3월", amount: 350000, paidDate: "2026-03-03", status: "paid" },
];

export default function ParentFeesPage() {
  const [showRequestSent, setShowRequestSent] = useState(false);
  const nextPayment = "2026-06-15";
  const currentFee = 350000;
  const accountInfo = "농협 123-4567-89 (예금주: 유소년FC)";

  const handleConfirmRequest = () => {
    setShowRequestSent(true);
    setTimeout(() => setShowRequestSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">회비 관리</h2>
        <p className="mt-1 text-sm text-gray-500">
          회비 납부 상태와 내역을 확인하세요
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="이번 달 회비"
          value={`${currentFee.toLocaleString()}원`}
          subtitle="2026년 6월"
          icon={<DollarSign className="h-6 w-6" />}
          color="#2563eb"
        />
        <StatCard
          title="납부 상태"
          value="미납"
          subtitle="납부 전"
          icon={<Clock className="h-6 w-6" />}
          color="#f59e0b"
        />
        <StatCard
          title="납부 마감일"
          value={nextPayment}
          subtitle="D-7"
          icon={<AlertCircle className="h-6 w-6" />}
          color="#ef4444"
        />
        <StatCard
          title="납부율"
          value="75%"
          subtitle="3/4개월 완납"
          icon={<CheckCircle className="h-6 w-6" />}
          color="#10b981"
        />
      </div>

      {/* Success toast */}
      {showRequestSent && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          입금 확인 요청이 전송되었습니다.
        </div>
      )}

      {/* Payment Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="납부 안내" subtitle="계좌 정보">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">이번 달 회비</span>
              <span className="text-lg font-bold text-gray-900">
                {currentFee.toLocaleString()}원
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">납부 상태</span>
              <Badge variant="warning">미납</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-600">납부 마감일</span>
              <span className="text-sm font-medium text-gray-900">
                {nextPayment}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">계좌번호</p>
              <p className="mt-1 text-sm font-medium text-gray-900">
                {accountInfo}
              </p>
            </div>
            <button
              onClick={handleConfirmRequest}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              입금 완료 확인 요청
            </button>
          </div>
        </Card>

        <Card title="납부 이력" subtitle="최근 4개월">
          <div className="divide-y divide-gray-100">
            {feeHistory.map((fee, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {fee.month}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {fee.amount.toLocaleString()}원
                    {fee.paidDate !== "-" && ` · ${fee.paidDate}`}
                  </p>
                </div>
                <Badge
                  variant={
                    fee.status === "paid"
                      ? "success"
                      : fee.status === "pending"
                        ? "warning"
                        : "danger"
                  }
                  size="sm"
                >
                  {fee.status === "paid"
                    ? "완납"
                    : fee.status === "pending"
                      ? "미납"
                      : "연체"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
