"use client";

import { useState } from "react";
import {
  Megaphone,
  Calendar,
  Download,
  ChevronLeft,
  Paperclip,
  Eye,
  CalendarPlus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { useParams } from "next/navigation";

interface NoticeAttachment {
  id: string;
  name: string;
  size: string;
}

// Dummy notice detail data
const noticeDetail = {
  id: "1",
  title: "우천으로 인한 휴원 안내",
  isEmergency: true,
  author: "운영팀",
  date: "2026-06-02",
  time: "10:30",
  views: 128,
  content: `안녕하세요, Youth FC 운영팀입니다.

오늘 예상치 못한 많은 비로 인해 훈련장 상태가 좋지 않아 부득이하게 오늘 훈련을 휴원하기로 결정하였습니다.

■ 휴원 대상: 전 반
■ 휴원 일시: 2026년 6월 2일 (화)
■ 보강 일정: 추후 공지 예정

갑작스러운 결정으로 불편을 드려 죄송합니다.
안전을 위한 결정이오니 학부모님들의 양해 부탁드립니다.

감사합니다.`,
  attachments: [
    { id: "a1", name: "우천휴원_공지문.pdf", size: "245KB" },
    { id: "a2", name: "보강일정_참고.docx", size: "128KB" },
  ] as NoticeAttachment[],
};

export default function ParentNoticeDetailPage() {
  const params = useParams();
  const notice = noticeDetail; // In real app, fetch by params.id
  const [showCalendarAdded, setShowCalendarAdded] = useState(false);

  const handleAddToCalendar = () => {
    setShowCalendarAdded(true);
    setTimeout(() => setShowCalendarAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/parent/notices"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
        공지사항 목록
      </Link>

      {/* Success toast */}
      {showCalendarAdded && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <CalendarPlus className="h-5 w-5 flex-shrink-0" />
          캘린더에 일정이 추가되었습니다.
        </div>
      )}

      <Card>
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {notice.isEmergency && (
              <Badge variant="danger">긴급</Badge>
            )}
            <span className="text-xs text-gray-400">
              {notice.date} · {notice.time}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{notice.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{notice.author}</span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              조회 {notice.views}
            </span>
          </div>
        </div>

        <hr className="my-5 border-gray-200" />

        {/* Content */}
        <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
          {notice.content}
        </div>

        {/* Attachments */}
        {notice.attachments.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Paperclip className="h-4 w-4" />
              첨부파일 ({notice.attachments.length})
            </p>
            <div className="space-y-2">
              {notice.attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg bg-white px-4 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-400">{file.size}</span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
                    <Download className="h-3.5 w-3.5" />
                    다운로드
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={handleAddToCalendar}
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <CalendarPlus className="h-4 w-4" />
            캘린더에 추가
          </button>
          <Link
            href="/parent/notices"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            목록으로
          </Link>
        </div>
      </Card>
    </div>
  );
}
