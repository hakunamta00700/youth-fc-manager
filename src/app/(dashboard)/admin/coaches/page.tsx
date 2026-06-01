"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Phone, Mail, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const coaches = [
  {
    id: "1",
    name: "박코치",
    initial: "박",
    color: "#2563eb",
    classes: ["유치부 A", "선수반"],
    status: "재직" as const,
    startDate: "2020-03-01",
    phone: "010-1111-2222",
    email: "park@youthfc.com",
    specialties: ["드리블", "슈팅"],
  },
  {
    id: "2",
    name: "이코치",
    initial: "이",
    color: "#059669",
    classes: ["초등저 B"],
    status: "재직" as const,
    startDate: "2021-06-15",
    phone: "010-2222-3333",
    email: "lee@youthfc.com",
    specialties: ["패스", "전술"],
  },
  {
    id: "3",
    name: "최코치",
    initial: "최",
    color: "#f59e0b",
    classes: ["초등고 A"],
    status: "재직" as const,
    startDate: "2022-09-01",
    phone: "010-3333-4444",
    email: "choi@youthfc.com",
    specialties: ["골키퍼", "수비"],
  },
  {
    id: "4",
    name: "김코치",
    initial: "김",
    color: "#dc2626",
    classes: ["유치부 B"],
    status: "퇴사" as const,
    startDate: "~2026-04",
    phone: "010-4444-5555",
    email: "kim@youthfc.com",
    specialties: ["체력", "훈련"],
  },
];

export default function CoachListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">코치 목록</h2>
          <p className="mt-1 text-sm text-gray-500">
            등록된 코치를 확인하고 관리합니다
          </p>
        </div>
        <Link
          href="/admin/coaches/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          코치 등록
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {coaches.map((coach) => (
          <Card key={coach.id} hoverable className="text-center">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: coach.color }}
            >
              {coach.initial}
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900">{coach.name}</h3>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {coach.classes.map((cls) => (
                <Badge key={cls} variant="info" size="sm">
                  {cls}
                </Badge>
              ))}
            </div>
            <div className="mt-3">
              <Badge
                variant={coach.status === "재직" ? "success" : "danger"}
                size="sm"
              >
                {coach.status}
              </Badge>
            </div>
            <hr className="my-3 border-gray-100" />
            <div className="space-y-1.5 text-left text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>입사: {coach.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>{coach.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" />
                <span className="truncate">{coach.email}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
