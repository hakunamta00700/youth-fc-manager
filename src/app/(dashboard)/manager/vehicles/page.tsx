"use client";

import { useState } from "react";
import {
  Bus,
  Plus,
  MapPin,
  Users,
  Clock,
  Route,
  CalendarDays,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Modal } from "@/components/ui/Modal";

interface RouteData {
  id: string;
  name: string;
  driver: string;
  vehicle: string;
  stops: number;
  students: number;
  status: "active" | "paused";
  schedule: string;
}

interface DrivingRecord {
  id: string;
  date: string;
  route: string;
  driver: string;
  students: number;
  distance: string;
  status: "completed" | "cancelled" | "in_progress";
}

const ROUTE_DATA: RouteData[] = [
  { id: "rt1", name: "A 노선 (강남)", driver: "김기사", vehicle: "25가 1234", stops: 8, students: 12, status: "active", schedule: "월/수/금 07:30" },
  { id: "rt2", name: "B 노선 (서초)", driver: "이기사", vehicle: "25가 5678", stops: 6, students: 9, status: "active", schedule: "화/목 07:45" },
  { id: "rt3", name: "C 노선 (송파)", driver: "박기사", vehicle: "25가 9012", stops: 5, students: 7, status: "active", schedule: "월~금 08:00" },
  { id: "rt4", name: "D 노선 (잠실)", driver: "-", vehicle: "25가 3456", stops: 0, students: 0, status: "paused", schedule: "대기 중" },
];

const DRIVING_RECORDS: DrivingRecord[] = [
  { id: "d1", date: "2026-06-02", route: "A 노선 (강남)", driver: "김기사", students: 12, distance: "24km", status: "completed" },
  { id: "d2", date: "2026-06-02", route: "B 노선 (서초)", driver: "이기사", students: 9, distance: "18km", status: "completed" },
  { id: "d3", date: "2026-06-02", route: "C 노선 (송파)", driver: "박기사", students: 7, distance: "22km", status: "in_progress" },
  { id: "d4", date: "2026-06-01", route: "A 노선 (강남)", driver: "김기사", students: 11, distance: "24km", status: "completed" },
  { id: "d5", date: "2026-06-01", route: "B 노선 (서초)", driver: "이기사", students: 8, distance: "18km", status: "completed" },
];

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState("routes");
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showBoardingModal, setShowBoardingModal] = useState(false);

  const tabs = [
    { id: "routes", label: "노선 관리", icon: <Route className="h-4 w-4" /> },
    { id: "records", label: "운행 기록", icon: <Clock className="h-4 w-4" /> },
    { id: "boarding", label: "탑승 배정", icon: <Users className="h-4 w-4" /> },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">운행 중</Badge>;
      case "paused":
        return <Badge variant="warning">대기</Badge>;
      case "completed":
        return <Badge variant="success">완료</Badge>;
      case "cancelled":
        return <Badge variant="danger">취소</Badge>;
      case "in_progress":
        return <Badge variant="info">운행 중</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">차량 운행 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            노선 등록, 탑승 배정, 운행 기록 관리
          </p>
        </div>
        <button
          onClick={() => setShowAddRouteModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          새 노선 등록
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card>
          <div className="text-center">
            <p className="text-xs text-gray-500">전체 노선</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{ROUTE_DATA.length}개</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-gray-500">운행 중</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              {ROUTE_DATA.filter((r) => r.status === "active").length}개
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-gray-500">탑승 원생</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {ROUTE_DATA.reduce((s, r) => s + r.students, 0)}명
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-xs text-gray-500">금일 운행</p>
            <p className="mt-1 text-2xl font-bold text-purple-600">
              {DRIVING_RECORDS.filter((r) => r.date === "2026-06-02").length}건
            </p>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Routes tab */}
      {activeTab === "routes" && (
        <Card title="노선 목록">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">노선명</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">기사</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">차량</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">정류장</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">탑승 인원</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">운행 일정</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">상태</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {ROUTE_DATA.map((route) => (
                  <tr key={route.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      <MapPin className="mr-1 inline-block h-3.5 w-3.5 text-blue-500" />
                      {route.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{route.driver}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{route.vehicle}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">{route.stops}곳</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">{route.students}명</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{route.schedule}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">{getStatusBadge(route.status)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <button
                        onClick={() => setShowBoardingModal(true)}
                        className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        배정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Records tab */}
      {activeTab === "records" && (
        <Card title="운행 기록" subtitle="최근 운행 내역">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">날짜</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">노선</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">기사</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">탑승 인원</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">운행 거리</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {DRIVING_RECORDS.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{record.date}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">{record.route}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{record.driver}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center text-sm text-gray-600">{record.students}명</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{record.distance}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">{getStatusBadge(record.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Boarding tab */}
      {activeTab === "boarding" && (
        <Card title="탑승 배정" subtitle="노선별 원생 탑승 현황">
          <div className="space-y-4">
            {ROUTE_DATA.filter((r) => r.status === "active").map((route) => (
              <div key={route.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      <Bus className="mr-1 inline-block h-4 w-4 text-blue-500" />
                      {route.name}
                    </h4>
                    <p className="text-xs text-gray-500">{route.driver} · {route.vehicle}</p>
                  </div>
                  <Badge variant="info">{route.students}명 배정</Badge>
                </div>
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {["김민재", "이서준", "박지호", "최유진", "한소희"].slice(0, route.students).map((name) => (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                      >
                        <Users className="h-3 w-3" />
                        {name}
                      </span>
                    ))}
                    <button
                      onClick={() => setShowBoardingModal(true)}
                      className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-500 transition-colors hover:border-blue-400 hover:text-blue-600"
                    >
                      <Plus className="h-3 w-3" />
                      배정
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add route modal */}
      <Modal
        isOpen={showAddRouteModal}
        onClose={() => setShowAddRouteModal(false)}
        title="새 노선 등록"
        size="md"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddRouteModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                setShowAddRouteModal(false);
                alert("새 노선이 등록되었습니다.");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              등록
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">노선명</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="예: A 노선 (강남)" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">담당 기사</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="기사명" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">차량 번호</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="25가 1234" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">운행 요일/시간</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="월/수/금 07:30" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">경유 정류장</label>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                    {i}
                  </span>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder={`정류장 ${i}`}
                  />
                  <button className="text-gray-400 hover:text-red-500">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Boarding modal */}
      <Modal
        isOpen={showBoardingModal}
        onClose={() => setShowBoardingModal(false)}
        title="탑승 배정"
        size="md"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setShowBoardingModal(false)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={() => {
                setShowBoardingModal(false);
                alert("탑승 배정이 저장되었습니다.");
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">노선 선택</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              {ROUTE_DATA.filter((r) => r.status === "active").map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">원생 선택 (탑승 배정)</label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
              {["김민재", "이서준", "박지호", "최유진", "한소희", "강다니엘", "윤아", "정우성"].map((name) => (
                <label key={name} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  {name}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
