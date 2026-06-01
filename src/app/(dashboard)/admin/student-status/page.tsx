"use client";

import { useState } from "react";
import { Check, X, AlertTriangle, ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

const studentStatuses = [
  { id: "1", name: "김민재", currentStatus: "수강중", changeReason: "" },
  { id: "2", name: "정우성", currentStatus: "일시정지", changeReason: "" },
  { id: "3", name: "이민호", currentStatus: "수강중", changeReason: "타지 이사" },
  { id: "4", name: "최유진", currentStatus: "수강중", changeReason: "" },
  { id: "5", name: "박지호", currentStatus: "수강중", changeReason: "" },
  { id: "6", name: "한소희", currentStatus: "수강중", changeReason: "" },
];

const statusOptions: Record<string, string[]> = {
  수강중: ["일시정지", "퇴원"],
  일시정지: ["수강중", "퇴원"],
  퇴원: ["수강중"],
};

const statusColors: Record<string, "success" | "warning" | "danger" | "default"> = {
  수강중: "success",
  일시정지: "warning",
  퇴원: "danger",
};

export default function StudentStatusPage() {
  const [students, setStudents] = useState(
    studentStatuses.map((s) => ({ ...s, selected: false, newStatus: s.currentStatus }))
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  const toggleSelect = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    );
  };

  const toggleSelectAll = () => {
    const allSelected = students.every((s) => s.selected);
    setStudents((prev) => prev.map((s) => ({ ...s, selected: !allSelected })));
  };

  const updateNewStatus = (id: string, newStatus: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, newStatus } : s))
    );
  };

  const updateReason = (id: string, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, changeReason: reason } : s))
    );
  };

  const handleApply = () => {
    const selected = students.filter((s) => s.selected);
    if (selected.length === 0) {
      alert("변경할 원생을 선택해주세요.");
      return;
    }
    setSelectedCount(selected.length);
    setShowConfirm(true);
  };

  const confirmApply = () => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.selected) {
          return {
            ...s,
            currentStatus: s.newStatus,
            selected: false,
            changeReason: "",
          };
        }
        return s;
      })
    );
    setShowConfirm(false);
    alert(`${selectedCount}명의 상태가 변경되었습니다.`);
  };

  const allSelected = students.length > 0 && students.every((s) => s.selected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">원생 상태 관리</h2>
        <p className="mt-1 text-sm text-gray-500">
          원생의 수강 상태를 일괄 변경합니다
        </p>
      </div>

      <Card title="상태 변경 대상 선택">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3">이름</th>
                <th className="px-4 py-3">현재 상태</th>
                <th className="px-4 py-3">변경할 상태</th>
                <th className="px-4 py-3">변경 사유</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={student.selected}
                      onChange={() => toggleSelect(student.id)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusColors[student.currentStatus] || "default"}>
                      {student.currentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={student.newStatus}
                      onChange={(e) => updateNewStatus(student.id, e.target.value)}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      {(statusOptions[student.currentStatus] || []).map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {student.currentStatus === student.newStatus && (
                      <span className="ml-2 text-xs text-gray-400">(변경 없음)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={student.changeReason}
                      onChange={(e) => updateReason(student.id, e.target.value)}
                      placeholder="사유 입력"
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-sm text-gray-500">
            {students.filter((s) => s.selected).length}명 선택됨
          </p>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <ArrowLeftRight className="h-4 w-4" />
            선택 적용
          </button>
        </div>
      </Card>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="상태 변경 확인"
        size="sm"
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={confirmApply}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              확인
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              총 <strong>{selectedCount}명</strong>의 상태를 변경하시겠습니까?
            </p>
            <div className="mt-3 space-y-2">
              {students
                .filter((s) => s.selected)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2 text-sm"
                  >
                    <span className="font-medium text-gray-900">{s.name}</span>
                    <span className="text-gray-500">
                      {s.currentStatus} →{" "}
                      <span className="font-medium text-blue-600">{s.newStatus}</span>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
