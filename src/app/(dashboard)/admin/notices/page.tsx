"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Megaphone, Send, MoreVertical, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const notices = [
  {
    id: "1",
    title: "우천으로 인한 휴원 안내",
    isUrgent: true,
    isPinned: true,
    readCount: 32,
    totalCount: 38,
    date: "2025-06-02",
    readRate: 84,
  },
  {
    id: "2",
    title: "6월 대회 일정 공지",
    isUrgent: false,
    isPinned: true,
    readCount: 35,
    totalCount: 38,
    date: "2025-05-28",
    readRate: 92,
  },
  {
    id: "3",
    title: "여름방학 특강 안내",
    isUrgent: false,
    isPinned: false,
    readCount: 29,
    totalCount: 38,
    date: "2025-05-25",
    readRate: 76,
  },
  {
    id: "4",
    title: "6월 회비 고지 안내",
    isUrgent: false,
    isPinned: false,
    readCount: 38,
    totalCount: 38,
    date: "2025-05-20",
    readRate: 100,
  },
  {
    id: "5",
    title: "5월 수업 사진 공유 안내",
    isUrgent: false,
    isPinned: false,
    readCount: 33,
    totalCount: 38,
    date: "2025-05-15",
    readRate: 87,
  },
];

export default function NoticeListPage() {
  const unreadCount = (notice: (typeof notices)[0]) =>
    notice.totalCount - notice.readCount;

  const getReadRateColor = (rate: number) => {
    if (rate >= 90) return "bg-green-500";
    if (rate >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항 목록</h2>
          <p className="mt-1 text-sm text-gray-500">
            발송된 공지사항과 읽음 현황을 확인합니다
          </p>
        </div>
        <Link
          href="/admin/notices/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          작성
        </Link>
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex flex-shrink-0 items-center gap-2">
                  {notice.isUrgent && (
                    <Badge variant="danger" size="sm">
                      긴급
                    </Badge>
                  )}
                  {notice.isPinned && (
                    <Badge variant="warning" size="sm">
                      필독
                    </Badge>
                  )}
                </div>
                <div className="min-w-0">
                  <Link
                    href="#"
                    className="font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block"
                  >
                    {notice.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">{notice.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Read rate */}
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${getReadRateColor(
                      notice.readRate
                    )}`}
                  />
                  <span className="text-sm text-gray-500">
                    {notice.readCount}/{notice.totalCount}
                  </span>
                </div>

                {/* Unread count */}
                {unreadCount(notice) > 0 && (
                  <span className="text-xs text-red-500 font-medium">
                    미확인 {unreadCount(notice)}명
                  </span>
                )}

                {/* Resend button */}
                <button
                  type="button"
                  onClick={() =>
                    alert(`"${notice.title}" 공지를 재전송합니다.`)
                  }
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <Send className="h-3 w-3" />
                  재전송
                </button>

                {/* View details */}
                <button
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
