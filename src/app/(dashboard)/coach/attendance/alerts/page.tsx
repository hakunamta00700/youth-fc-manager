"use client";

import { useState } from "react";
import {
  Phone,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  studentName: string;
  parentName: string;
  type: "absence" | "lateness";
  date: string;
  status: "sent" | "pending" | "failed";
  read: boolean;
  phone: string;
}

const alertsData: Alert[] = [
  {
    id: "1",
    studentName: "홍지우",
    parentName: "홍민수",
    type: "absence",
    date: "2026-06-02",
    status: "sent",
    read: true,
    phone: "010-1234-5678",
  },
  {
    id: "2",
    studentName: "배준서",
    parentName: "배영호",
    type: "absence",
    date: "2026-06-02",
    status: "sent",
    read: false,
    phone: "010-2345-6789",
  },
  {
    id: "3",
    studentName: "김민재",
    parentName: "김수현",
    type: "lateness",
    date: "2026-06-01",
    status: "pending",
    read: false,
    phone: "010-3456-7890",
  },
  {
    id: "4",
    studentName: "박서준",
    parentName: "박지원",
    type: "absence",
    date: "2026-05-30",
    status: "failed",
    read: true,
    phone: "010-4567-8901",
  },
  {
    id: "5",
    studentName: "최유진",
    parentName: "최미영",
    type: "lateness",
    date: "2026-05-28",
    status: "sent",
    read: true,
    phone: "010-5678-9012",
  },
];

export default function CoachAttendanceAlertsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [alerts, setAlerts] = useState<Alert[]>(alertsData);

  const filteredAlerts =
    filter === "all"
      ? alerts
      : filter === "unread"
        ? alerts.filter((a) => !a.read)
        : alerts.filter((a) => a.status === filter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="success">발송 완료</Badge>;
      case "pending":
        return <Badge variant="warning">발송 대기</Badge>;
      case "failed":
        return <Badge variant="danger">발송 실패</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "absence":
        return "결석 알림";
      case "lateness":
        return "지각 알림";
      default:
        return type;
    }
  };

  const tabs = [
    { id: "all", label: "전체", count: alerts.length },
    { id: "unread", label: "미확인", count: alerts.filter((a) => !a.read).length },
    { id: "pending", label: "발송 대기", count: alerts.filter((a) => a.status === "pending").length },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">알림 현황</h2>
        <p className="mt-1 text-sm text-gray-500">
          학부모 알림 발송 내역을 확인하고 관리하세요
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
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

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded-xl border bg-white p-4 shadow-sm transition-colors",
              !alert.read ? "border-blue-200 bg-blue-50/50" : "border-gray-200"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!alert.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-gray-900">
                    {alert.studentName}
                  </span>
                  <Badge
                    variant={
                      alert.type === "absence" ? "danger" : "warning"
                    }
                  >
                    {getTypeLabel(alert.type)}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  학부모: {alert.parentName} · {alert.date}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {alert.phone}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(alert.status)}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3">
              {alert.status === "pending" && (
                <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700">
                  <Send className="h-3.5 w-3.5" />
                  재발송
                </button>
              )}
              {alert.status === "failed" && (
                <button className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  재시도
                </button>
              )}
              <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <MessageSquare className="h-3.5 w-3.5" />
                메시지
              </button>
              <a
                href={`tel:${alert.phone}`}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Phone className="h-3.5 w-3.5" />
                전화 연결
              </a>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
            <CheckCircle className="mx-auto h-8 w-8 text-green-400" />
            <p className="mt-2 text-sm text-gray-500">모든 알림이 확인되었습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}
