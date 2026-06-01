"use client";

import { useState } from "react";
import {
  Undo2,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface RefundRequest {
  id: string;
  studentName: string;
  class: string;
  tuition: number;
  usedSessions: number;
  totalSessions: number;
  refundAmount: number;
  reason: string;
  status: "pending" | "approved" | "completed" | "rejected";
  requestDate: string;
}

const REFUND_DATA: RefundRequest[] = [
  { id: "r1", studentName: "정우성", class: "선수반", tuition: 500000, usedSessions: 6, totalSessions: 12, refundAmount: 250000, reason: "개인 사정으로 인한 수업 중단", status: "pending", requestDate: "2026-06-15" },
  { id: "r2", studentName: "한소희", class: "유치부 B", tuition: 300000, usedSessions: 4, totalSessions: 8, refundAmount: 150000, reason: "이사로 인한 수업 중단", status: "approved", requestDate: "2026-06-10" },
  { id: "r3", studentName: "강다니엘", class: "초등저 A", tuition: 350000, usedSessions: 8, totalSessions: 12, refundAmount: 116667, reason: "건강 문제", status: "completed", requestDate: "2026-05-28" },
];

const REFUND_REASONS = [
  "개인 사정",
  "이사",
  "건강 문제",
  "학원 변경",
  "수업 불만족",
  "기타",
];

export default function RefundPage() {
  const [refunds, setRefunds] = useState(REFUND_DATA);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New refund form
  const [newStudent, setNewStudent] = useState("");
  const [newTuition, setNewTuition] = useState(350000);
  const [newUsedSessions, setNewUsedSessions] = useState(0);
  const [newTotalSessions, setNewTotalSessions] = useState(12);
  const [newReason, setNewReason] = useState("");

  const calcRefund = () => {
    if (newTotalSessions === 0) return 0;
    const perSession = newTuition / newTotalSessions;
    const unused = newTotalSessions - newUsedSessions;
    return Math.round(perSession * unused);
  };

  const handleStatusChange = (id: string, newStatus: RefundRequest["status"]) => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (newStatus === "approved") {
      alert("승인되었습니다.");
    } else if (newStatus === "completed") {
      alert("환불이 완료 처리되었습니다.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="warning">승인 대기</Badge>;
      case "approved":
        return <Badge variant="info">승인 완료</Badge>;
      case "completed":
        return <Badge variant="success">환불 완료</Badge>;
      case "rejected":
        return <Badge variant="danger">반려</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">환불 처리</h2>
          <p className="mt-1 text-sm text-gray-500">
            환불 금액 자동 산출 및 승인 프로세스
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Calculator className="h-4 w-4" />
          새 환불 요청
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">승인 대기</p>
            <p className="mt-1 text-3xl font-bold text-yellow-600">
              {refunds.filter((r) => r.status === "pending").length}건
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">총 환불 예정액</p>
            <p className="mt-1 text-3xl font-bold text-blue-600">
              ₩{refunds.filter((r) => r.status === "pending" || r.status === "approved").reduce((s, r) => s + r.refundAmount, 0).toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">이번 달 완료</p>
            <p className="mt-1 text-3xl font-bold text-green-600">
              {refunds.filter((r) => r.status === "completed").length}건
            </p>
          </div>
        </Card>
      </div>

      {/* Refund list */}
      <Card title="환불 요청 목록">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">신청일</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">원생</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">반</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">회비</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">수업 차감</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">환불 금액</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">상태</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {refunds.map((refund) => (
                <tr key={refund.id} className="transition-colors hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{refund.requestDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{refund.studentName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{refund.class}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-900">₩{refund.tuition.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">
                    {refund.usedSessions}/{refund.totalSessions}회
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-bold text-blue-600">
                    ₩{refund.refundAmount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">{getStatusBadge(refund.status)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {refund.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange(refund.id, "approved")}
                            className="rounded-lg bg-green-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => handleStatusChange(refund.id, "rejected")}
                            className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                          >
                            반려
                          </button>
                        </>
                      )}
                      {refund.status === "approved" && (
                        <button
                          onClick={() => handleStatusChange(refund.id, "completed")}
                          className="rounded-lg bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-700"
                        >
                          완료 처리
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedRefund(refund);
                          setShowDetailModal(true);
                        }}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        상세
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="환불 상세 정보"
        size="md"
        footer={
          <button
            onClick={() => setShowDetailModal(false)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            닫기
          </button>
        }
      >
        {selectedRefund && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">원생</p>
                <p className="text-sm font-medium text-gray-900">{selectedRefund.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">반</p>
                <p className="text-sm font-medium text-gray-900">{selectedRefund.class}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">월 회비</p>
                <p className="text-sm font-medium text-gray-900">₩{selectedRefund.tuition.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">사용/전체 수업</p>
                <p className="text-sm font-medium text-gray-900">{selectedRefund.usedSessions} / {selectedRefund.totalSessions}회</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">미사용 수업</p>
                <p className="text-sm font-medium text-green-600">
                  {selectedRefund.totalSessions - selectedRefund.usedSessions}회
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">최종 환불 금액</p>
                <p className="text-lg font-bold text-blue-600">₩{selectedRefund.refundAmount.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">환불 사유</p>
              <p className="mt-1 text-sm text-gray-700">{selectedRefund.reason}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
              <Calculator className="mr-1 inline-block h-3 w-3" />
              산출 방식: (₩{selectedRefund.tuition.toLocaleString()} / {selectedRefund.totalSessions}회) × ({selectedRefund.totalSessions} - {selectedRefund.usedSessions})회 = ₩{selectedRefund.refundAmount.toLocaleString()}
            </div>
          </div>
        )}
      </Modal>

      {/* New refund modal */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="새 환불 요청"
        size="md"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                setShowNewModal(false);
                alert("환불 요청이 등록되었습니다.");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              요청 등록
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">원생 선택</label>
            <select
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">선택하세요</option>
              <option value="정우성">정우성</option>
              <option value="한소희">한소희</option>
              <option value="강다니엘">강다니엘</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">월 회비</label>
              <input
                type="number"
                value={newTuition}
                onChange={(e) => setNewTuition(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">전체 수업 횟수</label>
              <input
                type="number"
                value={newTotalSessions}
                onChange={(e) => setNewTotalSessions(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">사용한 수업</label>
              <input
                type="number"
                value={newUsedSessions}
                onChange={(e) => setNewUsedSessions(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">환불 예정 금액</label>
              <div className="flex h-10 items-center rounded-lg border border-blue-200 bg-blue-50 px-3 text-sm font-bold text-blue-700">
                ₩{calcRefund().toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">환불 사유</label>
            <div className="flex flex-wrap gap-2">
              {REFUND_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setNewReason(reason)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    newReason === reason
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
            {newReason === "기타" && (
              <input
                type="text"
                placeholder="사유 입력"
                className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
