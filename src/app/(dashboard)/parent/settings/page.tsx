"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Bell,
  BellRing,
  MessageCircle,
  MailCheck,
  Save,
  ChevronLeft,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface ParentInfo {
  name: string;
  relation: string;
  email: string;
  phone: string;
}

interface NotificationSetting {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
  channel: "app" | "email" | "sms";
}

export default function ParentSettingsPage() {
  const [info] = useState<ParentInfo>({
    name: "김철수",
    relation: "부",
    email: "chulsoo@example.com",
    phone: "010-1234-5678",
  });

  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "attendance",
      label: "출석 알림",
      icon: <Bell className="h-4 w-4" />,
      enabled: true,
      channel: "app",
    },
    {
      id: "fee",
      label: "회비 알림",
      icon: <BellRing className="h-4 w-4" />,
      enabled: true,
      channel: "app",
    },
    {
      id: "report",
      label: "리포트 알림",
      icon: <MessageCircle className="h-4 w-4" />,
      enabled: true,
      channel: "app",
    },
    {
      id: "notice",
      label: "공지사항 알림",
      icon: <Mail className="h-4 w-4" />,
      enabled: true,
      channel: "app",
    },
    {
      id: "email_receipt",
      label: "이메일 수신",
      icon: <MailCheck className="h-4 w-4" />,
      enabled: false,
      channel: "email",
    },
    {
      id: "sms_alert",
      label: "SMS 긴급 알림",
      icon: <Phone className="h-4 w-4" />,
      enabled: true,
      channel: "sms",
    },
  ]);

  const [saved, setSaved] = useState(false);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">내 정보 / 설정</h2>
        <p className="mt-1 text-sm text-gray-500">
          개인정보 및 알림 채널을 관리하세요
        </p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Save className="h-5 w-5 flex-shrink-0" />
          설정이 저장되었습니다.
        </div>
      )}

      {/* Parent Info */}
      <Card title="보호자 정보">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              이름
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{info.name}</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              관계
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{info.relation}</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              이메일
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{info.email}</span>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              연락처
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-900">{info.phone}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            정보 수정
          </button>
        </div>
      </Card>

      {/* Children Info Summary */}
      <Card title="내 자녀 정보">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
            김
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-gray-900">김민재</p>
            <p className="text-sm text-gray-500">
              7세 (2019년생) · 유치부 A · 등록일 2025-03-15
            </p>
          </div>
          <Link
            href="/parent/attendance"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            상세보기 →
          </Link>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card title="알림 설정">
        <div className="space-y-3">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    setting.enabled
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {setting.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {setting.label}
                  </p>
                  <p className="text-xs text-gray-400">
                    {setting.channel === "app"
                      ? "앱 푸시"
                      : setting.channel === "email"
                        ? "이메일"
                        : "SMS"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting(setting.id)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  setting.enabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                    setting.enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </Card>

      {/* App Info */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-center text-xs text-gray-400">
        <p>Youth FC Manager v1.0.0</p>
        <p className="mt-0.5">문의: support@youthfc.com</p>
      </div>
    </div>
  );
}
