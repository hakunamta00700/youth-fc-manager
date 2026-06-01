"use client";

import { useState } from "react";
import { Shield, Settings, History, Save, UserCog, ClipboardList, Eye, DollarSign, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";

interface SelectSetting {
  label: string;
  type: "select";
  value: string;
  options: string[];
}

interface ToggleSetting {
  label: string;
  type: "toggle";
  value: boolean;
}

type SystemSetting = SelectSetting | ToggleSetting;

const auditLogs = [
  { action: "원생 정보 수정", user: "김대표", target: "김민재", time: "2025-06-02 14:32", detail: "연락처 변경" },
  { action: "회비 내역 입력", user: "김대표", target: "이서준", time: "2025-06-02 11:15", detail: "6월 회비 납부 처리" },
  { action: "원생 상태 변경", user: "김대표", target: "정우성", time: "2025-06-01 09:45", detail: "수강중 → 일시정지" },
  { action: "코치 정보 수정", user: "김대표", target: "박코치", time: "2025-05-30 16:20", detail: "담당반 변경" },
  { action: "출석 데이터 수정", user: "김대표", target: "최유진", time: "2025-05-29 10:00", detail: "결석 → 출석 정정" },
];

const rolePermissions = [
  {
    role: "대표 (Admin)",
    badge: "danger" as const,
    permissions: ["모든 권한"],
    note: "전체 기능 접근 가능",
  },
  {
    role: "매니저 (Manager)",
    badge: "info" as const,
    permissions: ["원생 관리", "회비 관리", "통계 조회"],
    note: "급여 제외",
  },
  {
    role: "코치 (Coach)",
    badge: "success" as const,
    permissions: ["출석 체크", "훈련 기록", "원생 조회"],
    note: "회비 제외",
  },
  {
    role: "학부모 (Parent)",
    badge: "default" as const,
    permissions: ["내 자녀 조회", "회비 납부", "리포트 조회"],
    note: "수정 불가",
  },
];

const initialSystemSettings: SystemSetting[] = [
  { label: "출석률 기준 (자동 알림)", type: "select", value: "60% 미만", options: ["50% 미만", "60% 미만", "70% 미만"] },
  { label: "미납 자동 알림", type: "toggle", value: true },
  { label: "훈련 평가 공개", type: "toggle", value: true },
  { label: "자동 리포트 발송일", type: "select", value: "매월 1일", options: ["매월 1일", "매월 15일", "매월 마지막일"] },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("permissions");
  const [settings, setSettings] = useState<SystemSetting[]>(initialSystemSettings);

  const tabs = [
    { id: "permissions", label: "권한설정", icon: <Shield className="h-4 w-4" /> },
    { id: "system", label: "시스템설정", icon: <Settings className="h-4 w-4" /> },
    { id: "audit", label: "감사로그", icon: <History className="h-4 w-4" /> },
  ];

  const toggleSetting = (idx: number) => {
    setSettings((prev) =>
      prev.map((s, i) => {
        if (i !== idx || s.type !== "toggle") return s;
        return { ...s, value: !s.value };
      })
    );
  };

  const updateSetting = (idx: number, value: string) => {
    setSettings((prev) =>
      prev.map((s, i) => {
        if (i !== idx || s.type !== "select") return s;
        return { ...s, value };
      })
    );
  };

  const handleSave = () => {
    alert("설정이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">권한/설정</h2>
          <p className="mt-1 text-sm text-gray-500">
            시스템 권한 및 설정을 관리합니다
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          저장
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* 권한설정 Tab */}
      {activeTab === "permissions" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {rolePermissions.map((role) => (
            <Card key={role.role}>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">{role.role}</h3>
                <Badge variant={role.badge} size="sm">{role.note}</Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm) => (
                  <Badge key={perm} variant="info" size="sm">
                    {perm}
                  </Badge>
                ))}
                {role.permissions.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Lock className="h-3 w-3" />
                    <span>설정 가능</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 시스템설정 Tab */}
      {activeTab === "system" && (
        <Card>
          <div className="divide-y divide-gray-100">
            {settings.map((setting, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-2 py-4"
              >
                <span className="text-sm font-medium text-gray-900">
                  {setting.label}
                </span>
                {setting.type === "toggle" ? (
                  <button
                    type="button"
                    onClick={() => toggleSetting(idx)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      setting.value ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        setting.value ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                ) : (
                  <select
                    value={setting.value}
                    onChange={(e) => updateSetting(idx, e.target.value)}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {setting.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 감사로그 Tab */}
      {activeTab === "audit" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                  <th className="px-4 py-3">작업</th>
                  <th className="px-4 py-3">수행자</th>
                  <th className="px-4 py-3">대상</th>
                  <th className="px-4 py-3">시간</th>
                  <th className="px-4 py-3">상세</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{log.user}</td>
                    <td className="px-4 py-3 text-gray-600">{log.target}</td>
                    <td className="px-4 py-3 text-gray-500">{log.time}</td>
                    <td className="px-4 py-3 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
