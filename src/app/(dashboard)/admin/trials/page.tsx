"use client";

import { useState } from "react";
import { Phone, CalendarCheck, ArrowRight, Check, UserPlus, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

interface TrialApplicant {
  id: string;
  name: string;
  age: string;
  classType: string;
  timeAgo: string;
  parentName: string;
  phone: string;
  status: "미확인" | "연락완료" | "체험완료" | "등록전환";
}

const trialData: TrialApplicant[] = [
  { id: "1", name: "김민준", age: "7세", classType: "유치부", timeAgo: "10분 전", parentName: "김미영", phone: "010-1111-2222", status: "미확인" },
  { id: "2", name: "이서연", age: "9세", classType: "초등저", timeAgo: "30분 전", parentName: "이철수", phone: "010-2222-3333", status: "미확인" },
  { id: "3", name: "박지호", age: "12세", classType: "초등고", timeAgo: "2시간 전", parentName: "박영희", phone: "010-3333-4444", status: "미확인" },
  { id: "4", name: "최은서", age: "8세", classType: "유치부", timeAgo: "1일 전", parentName: "최대표", phone: "010-4444-5555", status: "연락완료" },
  { id: "5", name: "정다인", age: "10세", classType: "초등저", timeAgo: "2일 전", parentName: "정민수", phone: "010-5555-6666", status: "연락완료" },
  { id: "6", name: "한지민", age: "7세", classType: "유치부", timeAgo: "3일 전", parentName: "한상현", phone: "010-6666-7777", status: "체험완료" },
];

const statusConfig = {
  미확인: { color: "warning" as const, bgColor: "border-yellow-400", headerBg: "bg-yellow-500" },
  연락완료: { color: "info" as const, bgColor: "border-blue-400", headerBg: "bg-blue-500" },
  체험완료: { color: "success" as const, bgColor: "border-green-400", headerBg: "bg-green-500" },
  등록전환: { color: "success" as const, bgColor: "border-purple-400", headerBg: "bg-purple-500" },
};

const nextStatus: Record<string, TrialApplicant["status"]> = {
  미확인: "연락완료",
  연락완료: "체험완료",
  체험완료: "등록전환",
  등록전환: "등록전환",
};

export default function TrialListPage() {
  const [applicants, setApplicants] = useState(trialData);
  const [selectedApplicant, setSelectedApplicant] = useState<TrialApplicant | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const grouped = {
    미확인: applicants.filter((a) => a.status === "미확인"),
    연락완료: applicants.filter((a) => a.status === "연락완료"),
    체험완료: applicants.filter((a) => a.status === "체험완료" || a.status === "등록전환"),
  };

  const updateStatus = (id: string) => {
    setApplicants((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = nextStatus[a.status];
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
    setShowDetail(false);
    setSelectedApplicant(null);
  };

  const openDetail = (applicant: TrialApplicant) => {
    setSelectedApplicant(applicant);
    setShowDetail(true);
  };

  const renderColumn = (
    title: string,
    items: TrialApplicant[],
    config: (typeof statusConfig)[keyof typeof statusConfig],
    icon: React.ReactNode
  ) => (
    <Card className={`border-t-4 ${config.bgColor}`}>
      <div className={`-mx-5 -mt-4 mb-4 rounded-t-xl px-5 py-3 ${config.headerBg}`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold">{title}</span>
          </div>
          <Badge variant="default" size="sm" className="bg-white/20 text-white border-0">
            {items.length}
          </Badge>
        </div>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-400">해당 상태의 신청이 없습니다</p>
        ) : (
          items.map((applicant) => (
            <div
              key={applicant.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 transition-colors hover:bg-gray-50"
              onClick={() => openDetail(applicant)}
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{applicant.name}</p>
                <p className="text-xs text-gray-500">
                  {applicant.age} · {applicant.classType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{applicant.timeAgo}</span>
                {applicant.status === "연락완료" && (
                  <Badge variant="info" size="sm">방문예정</Badge>
                )}
                {applicant.status === "체험완료" && (
                  <Badge variant="success" size="sm">체험완료</Badge>
                )}
                {applicant.status === "등록전환" && (
                  <Badge variant="success" size="sm">등록 전환</Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );

  const handleRegisterConversion = () => {
    if (selectedApplicant) {
      alert(`${selectedApplicant.name} 님이 등록 전환되었습니다. 원생 등록 페이지로 이동합니다.`);
      setShowDetail(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">체험수업 신청 목록</h2>
        <p className="mt-1 text-sm text-gray-500">
          체험수업 신청자를 확인하고 상태를 관리합니다
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {renderColumn("미확인", grouped.미확인, statusConfig.미확인, <Clock className="h-4 w-4" />)}
        {renderColumn("연락완료", grouped.연락완료, statusConfig.연락완료, <Phone className="h-4 w-4" />)}
        {renderColumn("체험완료", grouped.체험완료, statusConfig.체험완료, <CalendarCheck className="h-4 w-4" />)}
      </div>

      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={selectedApplicant?.name ? `${selectedApplicant.name} 님 상세` : "신청 상세"}
        size="sm"
        footer={
          selectedApplicant && (
            <div className="flex w-full gap-2">
              {selectedApplicant.status !== "등록전환" && (
                <button
                  type="button"
                  onClick={() => updateStatus(selectedApplicant.id)}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  {nextStatus[selectedApplicant.status] === "연락완료" && (
                    <span className="flex items-center justify-center gap-1">
                      <Check className="h-4 w-4" /> 연락 완료
                    </span>
                  )}
                  {nextStatus[selectedApplicant.status] === "체험완료" && (
                    <span className="flex items-center justify-center gap-1">
                      <CalendarCheck className="h-4 w-4" /> 체험 완료
                    </span>
                  )}
                  {nextStatus[selectedApplicant.status] === "등록전환" && (
                    <span className="flex items-center justify-center gap-1">
                      <ArrowRight className="h-4 w-4" /> 등록 전환
                    </span>
                  )}
                </button>
              )}
              {selectedApplicant.status === "체험완료" && (
                <button
                  type="button"
                  onClick={handleRegisterConversion}
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                  <span className="flex items-center justify-center gap-1">
                    <UserPlus className="h-4 w-4" /> 원생 등록
                  </span>
                </button>
              )}
            </div>
          )
        }
      >
        {selectedApplicant && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600">
                {selectedApplicant.name[0]}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedApplicant.name}</h4>
                <p className="text-sm text-gray-500">
                  {selectedApplicant.age} · {selectedApplicant.classType}
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">보호자</span>
                  <span className="font-medium text-gray-900">{selectedApplicant.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">연락처</span>
                  <span className="font-medium text-gray-900">{selectedApplicant.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">현재 상태</span>
                  <Badge
                    variant={
                      selectedApplicant.status === "미확인"
                        ? "warning"
                        : selectedApplicant.status === "연락완료"
                          ? "info"
                          : "success"
                    }
                    size="sm"
                  >
                    {selectedApplicant.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">신청 시간</span>
                  <span className="font-medium text-gray-900">{selectedApplicant.timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
