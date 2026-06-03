"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopbarProps {
  title: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
  notificationCount?: number;
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

function Topbar({
  title,
  onMenuClick,
  showSearch = false,
  notificationCount = 0,
  userName = "사용자",
  userRole = "Admin",
  userAvatar,
}: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notificationCount);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: "attendance",
      title: "출석 확인 필요",
      description: "유치부 A반 2명의 출석 상태가 아직 기록되지 않았습니다.",
      time: "방금 전",
      unread: unreadCount > 0,
    },
    {
      id: "payment",
      title: "회비 미납 알림",
      description: "6월 회비 미납 대상자에게 안내가 필요합니다.",
      time: "10분 전",
      unread: unreadCount > 1,
    },
    {
      id: "notice",
      title: "공지 예약 완료",
      description: "우천 취소 공지가 오늘 오후 3시에 발송됩니다.",
      time: "1시간 전",
      unread: unreadCount > 2,
    },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setUnreadCount(notificationCount);
  }, [notificationCount]);

  const getInitial = (name: string) => name.charAt(0);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 md:text-xl">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {showSearch && (
          <div className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="검색..."
                className="h-9 w-48 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 lg:w-64"
              />
            </div>
          </div>
        )}

        {showSearch && (
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 sm:hidden"
            aria-label="검색"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationOpen((open) => !open);
              setDropdownOpen(false);
            }}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700",
              notificationOpen && "bg-gray-100 text-gray-900"
            )}
            aria-label="알림"
            aria-expanded={notificationOpen}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-full mt-1 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">알림</p>
                  <p className="text-xs text-gray-500">
                    {unreadCount > 0
                      ? `읽지 않은 알림 ${unreadCount}개`
                      : "모든 알림을 확인했습니다"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUnreadCount(0)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  모두 읽음
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex gap-3 border-b border-gray-50 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
                        notification.unread
                          ? "bg-blue-50 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {notification.unread ? (
                        <CalendarClock className="h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-gray-500">
                        {notification.description}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  href="/settings"
                  className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
                  onClick={() => setNotificationOpen(false)}
                >
                  알림 설정으로 이동
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-100"
            aria-label="사용자 메뉴"
            aria-expanded={dropdownOpen}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {userAvatar || getInitial(userName)}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight text-gray-900">
                {userName}
              </p>
              <p className="text-xs leading-tight text-gray-500">{userRole}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-400 md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4" />
                설정
              </Link>
              <button
                type="button"
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                onClick={() => {
                  setDropdownOpen(false);
                  window.location.href = "/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {showSearch && searchOpen && (
        <div className="absolute left-0 right-0 top-16 border-b border-gray-200 bg-white p-3 sm:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="검색..."
              className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}

export { Topbar };
export default Topbar;
