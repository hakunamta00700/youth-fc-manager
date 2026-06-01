"use client";

import { useState } from "react";
import { Megaphone, Pin, Eye, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface Notice {
  id: string;
  title: string;
  isEmergency: boolean;
  isPinned: boolean;
  isRead: boolean;
  time: string;
  date: string;
}

const notices: Notice[] = [
  {
    id: "1",
    title: "우천으로 인한 휴원 안내",
    isEmergency: true,
    isPinned: true,
    isRead: false,
    time: "1시간 전",
    date: "2026-06-02",
  },
  {
    id: "2",
    title: "6월 대회 일정 공지",
    isEmergency: false,
    isPinned: true,
    isRead: false,
    time: "3시간 전",
    date: "2026-06-02",
  },
  {
    id: "3",
    title: "여름방학 특강 안내",
    isEmergency: false,
    isPinned: false,
    isRead: true,
    time: "1일 전",
    date: "2026-06-01",
  },
  {
    id: "4",
    title: "6월 회비 고지 안내",
    isEmergency: false,
    isPinned: false,
    isRead: false,
    time: "2일 전",
    date: "2026-05-31",
  },
  {
    id: "5",
    title: "5월 훈련 평가 보고서 안내",
    isEmergency: false,
    isPinned: false,
    isRead: true,
    time: "5일 전",
    date: "2026-05-28",
  },
  {
    id: "6",
    title: "단체복 추가 주문 안내",
    isEmergency: false,
    isPinned: false,
    isRead: true,
    time: "1주 전",
    date: "2026-05-25",
  },
];

export default function ParentNoticesPage() {
  // Sort: pinned first, then by date desc
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const unreadCount = notices.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항</h2>
          <p className="mt-1 text-sm text-gray-500">
            클럽의 중요 소식을 확인하세요
          </p>
        </div>
        {unreadCount > 0 && (
          <Badge variant="danger" size="sm">
            {unreadCount}개 미확인
          </Badge>
        )}
      </div>

      <Card>
        <div className="divide-y divide-gray-100">
          {sortedNotices.map((notice) => (
            <Link
              key={notice.id}
              href={`/parent/notices/${notice.id}`}
              className="flex items-start gap-4 px-1 py-4 transition-colors hover:bg-gray-50 -mx-1 rounded-lg"
            >
              {/* Icon */}
              <div
                className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                  notice.isEmergency
                    ? "bg-red-100 text-red-600"
                    : notice.isPinned
                      ? "bg-amber-100 text-amber-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {notice.isEmergency ? (
                  <Megaphone className="h-5 w-5" />
                ) : notice.isPinned ? (
                  <Pin className="h-5 w-5" />
                ) : (
                  <Megaphone className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {notice.isEmergency && (
                    <Badge variant="danger" size="sm">
                      긴급
                    </Badge>
                  )}
                  {notice.isPinned && !notice.isEmergency && (
                    <Badge variant="warning" size="sm">
                      필독
                    </Badge>
                  )}
                  <span
                    className={`text-sm truncate ${
                      !notice.isRead
                        ? "font-semibold text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    {notice.title}
                  </span>
                  {!notice.isRead && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                  )}
                </div>
                <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {notice.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {notice.isRead ? "확인" : "미확인"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
