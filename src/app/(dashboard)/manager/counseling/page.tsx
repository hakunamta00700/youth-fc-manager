"use client";

import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Search,
  Phone,
  Mail,
  User,
  CalendarDays,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { SearchInput } from "@/components/ui/SearchInput";
import { Modal } from "@/components/ui/Modal";

interface CounselingRecord {
  id: string;
  date: string;
  studentName: string;
  type: "phone" | "visit" | "kakao" | "email";
  category: "fee" | "attendance" | "behavior" | "academic" | "consultation" | "other";
  content: string;
  counselor: string;
  summary: string;
}

const COUNSELING_DATA: CounselingRecord[] = [
  { id: "c1", date: "2026-06-02", studentName: "김민재", type: "phone", category: "fee", content: "6월 회비 미납 관련 안내 및 납부 요청 드렸습니다. 6월 10일까지 납부 예정.", counselor: "매니저", summary: "회비 납부 안내" },
  { id: "c2", date: "2026-06-01", studentName: "이서준", type: "visit", category: "attendance", content: "최근 출석률 저하에 대해 보호자와 면담 진행. 수업 시간 변경으로 해결 예정.", counselor: "박코치", summary: "출석률 저하 관련 면담" },
  { id: "c3", date: "2026-05-30", studentName: "박지호", type: "kakao", category: "behavior", content: "수업 중 주의력 부족에 대해 상담 진행. 가정에서의 학습 환경 점검 요청.", counselor: "최코치", summary: "수업 태도 상담" },
  { id: "c4", date: "2026-05-28", studentName: "정우성", type: "phone", category: "consultation", content: "선수반 진급 관련 상담. 훈련 강도 및 일정 조정 필요 사항 논의.", counselor: "매니저", summary: "진급 상담" },
  { id: "c5", date: "2026-05-25", studentName: "최유진", type: "email", category: "academic", content: "학습 진도 관련 이메일 상담. 추가 교재 추천 및 학습 계획 안내.", counselor: "이코치", summary: "학습 진도 상담" },
];

const CATEGORY_OPTIONS = ["전체", "회비", "출석", "행동", "학습", "상담", "기타"];
const TYPE_OPTIONS = [
  { value: "phone", label: "전화", icon: Phone },
  { value: "visit", label: "방문", icon: User },
  { value: "kakao", label: "카카오톡", icon: MessageSquare },
  { value: "email", label: "이메일", icon: Mail },
];

export default function CounselingPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [showAddModal, setShowAddModal] = useState(false);

  const tabs = [
    { id: "all", label: "전체", count: COUNSELING_DATA.length },
    { id: "fee", label: "회비", count: COUNSELING_DATA.filter((c) => c.category === "fee").length },
    { id: "attendance", label: "출석", count: COUNSELING_DATA.filter((c) => c.category === "attendance").length },
    { id: "consultation", label: "상담", count: COUNSELING_DATA.filter((c) => c.category === "consultation").length },
  ];

  const filtered = COUNSELING_DATA.filter((r) => {
    if (activeTab !== "all" && r.category !== activeTab) return false;
    if (categoryFilter !== "전체" && r.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !r.studentName.toLowerCase().includes(q) &&
        !r.summary.toLowerCase().includes(q) &&
        !r.content.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const getTypeBadge = (type: string) => {
    const t = TYPE_OPTIONS.find((o) => o.value === type);
    if (!t) return <Badge variant="default">{type}</Badge>;
    const Icon = t.icon;
    return (
      <Badge variant="info">
        <Icon className="mr-1 inline-block h-3 w-3" />
        {t.label}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
      fee: "success",
      attendance: "warning",
      behavior: "danger",
      academic: "info",
      consultation: "info",
      other: "default",
    };
    const labels: Record<string, string> = {
      fee: "회비",
      attendance: "출석",
      behavior: "행동",
      academic: "학습",
      consultation: "상담",
      other: "기타",
    };
    return <Badge variant={variants[category] ?? "default"}>{labels[category] ?? category}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">상담 기록 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            상담 유형별 등록 및 이력 조회/검색
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          상담 등록
        </button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            placeholder="원생명/내용 검색"
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Records */}
      <Card>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">
              상담 기록이 없습니다
            </div>
          ) : (
            filtered.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {record.studentName}
                      </span>
                      {getCategoryBadge(record.category)}
                      {getTypeBadge(record.type)}
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      {record.summary}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                      {record.content}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {record.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {record.counselor}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`상세 보기: ${record.summary}`)}
                    className="ml-2 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    상세
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Add modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="상담 등록"
        size="lg"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                setShowAddModal(false);
                alert("상담이 등록되었습니다.");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">원생 선택</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>김민재</option>
                <option>이서준</option>
                <option>박지호</option>
                <option>정우성</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">상담 유형</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>전화</option>
                <option>방문</option>
                <option>카카오톡</option>
                <option>이메일</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">카테고리</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                <option>회비</option>
                <option>출석</option>
                <option>행동</option>
                <option>학습</option>
                <option>상담</option>
                <option>기타</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">상담일</label>
              <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">제목</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="상담 제목" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">상담 내용</label>
              <textarea rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="상담 내용을 입력하세요" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
