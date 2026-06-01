"use client";

import { useState } from "react";
import {
  UserX,
  AlertTriangle,
  Send,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface Student {
  id: string;
  name: string;
  class: string;
  status: string;
  overdueAmount: number;
  refundAmount: number;
}

const STUDENT_LIST: Student[] = [
  { id: "s1", name: "정우성", class: "선수반", status: "일시정지", overdueAmount: 500000, refundAmount: 0 },
  { id: "s2", name: "윤아", class: "초등고 B", status: "수강중", overdueAmount: 0, refundAmount: 150000 },
  { id: "s3", name: "강다니엘", class: "초등저 A", status: "수강중", overdueAmount: 350000, refundAmount: 0 },
];

const LEAVE_REASONS = [
  "학원 이전",
  "학습 부진",
  "경제적 사유",
  "시간 부족",
  "타 학원 등록",
  "건강 문제",
  "기타",
];

export default function DropoutPage() {
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [leaveDate, setLeaveDate] = useState("2026-06-30");
  const [leaveReason, setLeaveReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const currentStudent = STUDENT_LIST.find((s) => s.id === selectedStudent);

  const handleDropout = () => {
    if (!currentStudent) return;
    setShowConfirmModal(true);
  };

  const confirmDropout = () => {
    setConfirmed(true);
    setShowConfirmModal(false);
    alert(`퇴원 처리 완료: ${currentStudent?.name}님`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">퇴원 처리</h2>
        <p className="mt-1 text-sm text-gray-500">
          원생 퇴원 처리, 사유 입력 및 미납/환불 확인 후 퇴원을 확정합니다
        </p>
      </div>

      {confirmed ? (
        <Card>
          <div className="flex flex-col items-center py-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900">퇴원 처리 완료</h3>
            <p className="mt-1 text-sm text-gray-500">
              {currentStudent?.name}님의 퇴원 처리가 완료되었습니다.
            </p>
            <button
              onClick={() => setConfirmed(false)}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              새 퇴원 처리
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dropout form */}
          <div className="lg:col-span-2">
            <Card title="퇴원 정보 입력">
              <div className="space-y-4">
                {/* Student select */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    원생 선택
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">원생을 선택하세요</option>
                    {STUDENT_LIST.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · {s.class} · {s.status}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Leave date */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    퇴원일
                  </label>
                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Leave reason */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    퇴원 사유
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LEAVE_REASONS.map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setLeaveReason(reason)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                          leaveReason === reason
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                  {leaveReason === "기타" && (
                    <input
                      type="text"
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="사유를 직접 입력하세요"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  )}
                </div>

                {/* Notification */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="notification"
                    checked={sendNotification}
                    onChange={(e) => setSendNotification(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="notification" className="text-sm text-gray-700">
                    자동 알림 발송 (SMS + Push)
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleDropout}
                  disabled={!selectedStudent || !leaveReason}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <UserX className="h-4 w-4" />
                  퇴원 처리
                </button>
              </div>
            </Card>
          </div>

          {/* Summary sidebar */}
          <div className="lg:col-span-1">
            {currentStudent ? (
              <Card title="미납/환불 확인">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">원생</span>
                    <span className="text-sm font-medium text-gray-900">
                      {currentStudent.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">반</span>
                    <Badge variant="info">{currentStudent.class}</Badge>
                  </div>
                  <hr />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">미납액</span>
                    <span className={`text-sm font-bold ${
                      currentStudent.overdueAmount > 0 ? "text-red-600" : "text-green-600"
                    }`}>
                      {currentStudent.overdueAmount > 0
                        ? `₩${currentStudent.overdueAmount.toLocaleString()}`
                        : "없음"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">환불 예정액</span>
                    <span className={`text-sm font-bold ${
                      currentStudent.refundAmount > 0 ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {currentStudent.refundAmount > 0
                        ? `₩${currentStudent.refundAmount.toLocaleString()}`
                        : "없음"}
                    </span>
                  </div>
                  {(currentStudent.overdueAmount > 0 || currentStudent.refundAmount > 0) && (
                    <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
                      <AlertTriangle className="mr-1 inline-block h-3 w-3" />
                      {currentStudent.overdueAmount > 0 && "미납 금액이 있습니다. "}
                      {currentStudent.refundAmount > 0 && "환불 금액을 확인하세요."}
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <Card>
                <div className="flex flex-col items-center py-8 text-center text-gray-400">
                  <Search className="h-10 w-10" />
                  <p className="mt-2 text-sm">원생을 선택하면</p>
                  <p className="text-sm">미납/환불 정보가 표시됩니다</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="퇴원 처리 확인"
        size="sm"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={confirmDropout}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              퇴원 확정
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            <strong>{currentStudent?.name}</strong>님을 퇴원 처리하시겠습니까?
          </p>
          <div className="rounded-lg bg-gray-50 p-3 text-sm">
            <p>퇴원일: {leaveDate}</p>
            <p>
              사유: {leaveReason === "기타" ? customReason : leaveReason}
            </p>
            {sendNotification && (
              <p className="mt-1 text-blue-600">SMS + Push 알림이 발송됩니다</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
