"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
  KeyRound,
  Mail,
  Monitor,
  Save,
  ShieldCheck,
  Smartphone,
  User,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const roleSettings = [
  {
    title: "관리자 설정",
    description: "권한, 시스템 설정, 감사 로그를 관리합니다.",
    href: "/admin/settings",
    badge: "Admin",
  },
  {
    title: "학부모 설정",
    description: "보호자 정보와 자녀 알림 수신 방식을 관리합니다.",
    href: "/parent/settings",
    badge: "Parent",
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: "attendance",
      label: "출석 알림",
      description: "출석, 지각, 결석 처리 결과를 받습니다.",
      enabled: true,
    },
    {
      id: "payment",
      label: "회비 알림",
      description: "납부 예정일과 미납 안내를 받습니다.",
      enabled: true,
    },
    {
      id: "training",
      label: "훈련 리포트",
      description: "훈련 평가와 성장 리포트 업데이트를 받습니다.",
      enabled: true,
    },
    {
      id: "notice",
      label: "공지사항",
      description: "클럽 공지, 일정 변경, 긴급 안내를 받습니다.",
      enabled: false,
    },
  ]);

  const togglePreference = (id: string) => {
    setPreferences((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">설정</h2>
          <p className="mt-1 text-sm text-gray-500">
            계정 정보, 알림 수신, 보안 옵션을 관리합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          저장
        </button>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          설정이 저장되었습니다.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <Card title="내 계정">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-base font-bold text-white">
                  Y
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Youth FC 사용자
                  </p>
                  <p className="text-xs text-gray-500">user@youthfc.com</p>
                </div>
              </div>

              <div className="grid gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-500">
                    이름
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900">
                    <User className="h-4 w-4 text-gray-400" />
                    Youth FC 사용자
                  </div>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-500">
                    이메일
                  </span>
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400" />
                    user@youthfc.com
                  </div>
                </label>
              </div>
            </div>
          </Card>

          <Card title="역할별 설정">
            <div className="space-y-3">
              {roleSettings.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.title}
                      </p>
                      <Badge variant="info" size="sm">
                        {item.badge}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                </Link>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="알림 설정" subtitle="서비스에서 받을 알림을 선택합니다.">
            <div className="space-y-3">
              {preferences.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={
                        item.enabled
                          ? "mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"
                          : "mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-400"
                      }
                    >
                      <Bell className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePreference(item.id)}
                    className={
                      item.enabled
                        ? "relative h-6 w-11 flex-shrink-0 rounded-full bg-blue-600 transition-colors"
                        : "relative h-6 w-11 flex-shrink-0 rounded-full bg-gray-300 transition-colors"
                    }
                    aria-pressed={item.enabled}
                    aria-label={`${item.label} ${item.enabled ? "끄기" : "켜기"}`}
                  >
                    <span
                      className={
                        item.enabled
                          ? "absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white shadow transition-transform"
                          : "absolute left-0.5 top-0.5 h-5 w-5 translate-x-0 rounded-full bg-white shadow transition-transform"
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="보안 및 접속">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <KeyRound className="h-4 w-4 text-blue-600" />
                  비밀번호
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  마지막 변경일: 2026-06-01
                </p>
                <button className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  변경하기
                </button>
              </div>
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  로그인 보호
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  새 기기 로그인 알림이 켜져 있습니다.
                </p>
                <button className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-700">
                  관리하기
                </button>
              </div>
            </div>
          </Card>

          <Card title="화면 환경">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                <Monitor className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    데스크톱
                  </p>
                  <p className="text-xs text-gray-500">기본 레이아웃 사용</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">모바일</p>
                  <p className="text-xs text-gray-500">하단 메뉴 자동 표시</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Youth FC Manager
                </p>
                <p className="text-xs text-gray-500">
                  설정 변경은 현재 기기와 계정에 적용됩니다.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
