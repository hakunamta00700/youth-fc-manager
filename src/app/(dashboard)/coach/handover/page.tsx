"use client";

import { useState } from "react";
import {
  Send,
  Inbox,
  MessageSquare,
  CheckCircle,
  Clock,
  Eye,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface HandoverNote {
  id: string;
  title: string;
  from: string;
  to: string;
  date: string;
  classes: string[];
  status: "completed" | "pending" | "reviewed";
  commentCount: number;
  direction: "sent" | "received";
}

const handoverData: HandoverNote[] = [
  {
    id: "1",
    title: "6월 첫째주 인수인계",
    from: "박코치",
    to: "이코치",
    date: "2026-06-01",
    classes: ["유치부 A", "유치부 B"],
    status: "completed",
    commentCount: 2,
    direction: "sent",
  },
  {
    id: "2",
    title: "유치부 B 훈련 진행 상황",
    from: "이코치",
    to: "박코치",
    date: "2026-05-28",
    classes: ["유치부 B"],
    status: "pending",
    commentCount: 0,
    direction: "received",
  },
  {
    id: "3",
    title: "5월 말 인수인계",
    from: "최코치",
    to: "박코치",
    date: "2026-05-25",
    classes: ["초등저 A"],
    status: "reviewed",
    commentCount: 1,
    direction: "received",
  },
  {
    id: "4",
    title: "초등저 B 특이사항 전달",
    from: "박코치",
    to: "김코치",
    date: "2026-05-20",
    classes: ["초등저 B"],
    status: "completed",
    commentCount: 3,
    direction: "sent",
  },
  {
    id: "5",
    title: "주간 훈련 계획 인계",
    from: "박코치",
    to: "이코치",
    date: "2026-05-18",
    classes: ["유치부 A"],
    status: "reviewed",
    commentCount: 0,
    direction: "sent",
  },
];

const statusConfig = {
  completed: {
    label: "확인 완료",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50",
  },
  pending: {
    label: "미확인",
    icon: Clock,
    color: "text-amber-600 bg-amber-50",
  },
  reviewed: {
    label: "검토 중",
    icon: Eye,
    color: "text-blue-600 bg-blue-50",
  },
};

export default function CoachHandoverPage() {
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  const filteredData =
    filter === "all"
      ? handoverData
      : handoverData.filter((h) => h.direction === filter);

  const tabs = [
    { id: "all", label: "전체", count: handoverData.length },
    {
      id: "received",
      label: "받은 내역",
      count: handoverData.filter((h) => h.direction === "received").length,
    },
    {
      id: "sent",
      label: "보낸 내역",
      count: handoverData.filter((h) => h.direction === "sent").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">인수인계 목록</h2>
          <p className="mt-1 text-sm text-gray-500">
            인수인계 내역을 확인하고 관리하세요
          </p>
        </div>
        <a
          href="/coach/handover/new"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          새 노트
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as typeof filter)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {tab.label}
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                filter === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Handover List */}
      <div className="space-y-3">
        {filteredData.map((note) => {
          const status = statusConfig[note.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={note.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {note.direction === "received" ? (
                      <Inbox className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Send className="h-4 w-4 text-green-500" />
                    )}
                    <h4 className="text-sm font-semibold text-gray-900">
                      {note.title}
                    </h4>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span>
                      {note.direction === "sent"
                        ? `To: ${note.to}`
                        : `From: ${note.from}`}
                    </span>
                    <span>{note.date}</span>
                    <span>{note.classes.join(", ")}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                      status.color
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-300" />
                </div>
              </div>

              {/* Comments indicator */}
              {note.commentCount > 0 && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-600">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>댓글 {note.commentCount}개</span>
                </div>
              )}

              {/* Quick actions */}
              <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100">
                  <Eye className="h-3.5 w-3.5" />
                  상세 보기
                </button>
                {note.status === "pending" && note.direction === "received" && (
                  <button className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-colors hover:bg-green-100">
                    <CheckCircle className="h-3.5 w-3.5" />
                    확인 완료
                  </button>
                )}
                <button className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100">
                  <MessageSquare className="h-3.5 w-3.5" />
                  댓글
                </button>
              </div>
            </div>
          );
        })}

        {filteredData.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {filter === "sent"
                ? "보낸 인수인계 내역이 없습니다"
                : filter === "received"
                  ? "받은 인수인계 내역이 없습니다"
                  : "인수인계 내역이 없습니다"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
