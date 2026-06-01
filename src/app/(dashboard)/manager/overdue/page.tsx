"use client";

import { useState } from "react";
import {
  Bell,
  Search,
  AlertTriangle,
  Send,
  Filter,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";

interface OverdueStudent {
  id: string;
  name: string;
  class: string;
  amount: number;
  dueDate: string;
  overdueDays: number;
  status: "overdue" | "late" | "unpaid";
  parentName: string;
  phone: string;
}

const OVERDUE_DATA: OverdueStudent[] = [
  { id: "1", name: "이서준", class: "초등저 B", amount: 350000, dueDate: "2026-06-01", overdueDays: 32, status: "overdue", parentName: "이영희", phone: "010-2345-6789" },
  { id: "2", name: "박지호", class: "초등고 A", amount: 400000, dueDate: "2026-05-15", overdueDays: 48, status: "overdue", parentName: "박민수", phone: "010-3456-7890" },
  { id: "3", name: "정우성", class: "선수반", amount: 500000, dueDate: "2026-05-01", overdueDays: 62, status: "overdue", parentName: "정대표", phone: "010-4567-8901" },
  { id: "4", name: "한소희", class: "유치부 B", amount: 300000, dueDate: "2026-06-10", overdueDays: 22, status: "late", parentName: "한미영", phone: "010-5678-9012" },
  { id: "5", name: "강다니엘", class: "초등저 A", amount: 350000, dueDate: "2026-06-15", overdueDays: 17, status: "late", parentName: "강철수", phone: "010-6789-0123" },
  { id: "6", name: "윤아", class: "초등고 B", amount: 400000, dueDate: "2026-06-20", overdueDays: 10, status: "unpaid", parentName: "윤석진", phone: "010-7890-1234" },
];

const CLASS_OPTIONS = ["전체 반", "유치부 A", "유치부 B", "초등저 A", "초등저 B", "초등고 A", "초등고 B", "선수반"];
const STATUS_OPTIONS = ["전체", "연체", "미납", "납부기한 임박"];

export default function OverduePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("전체 반");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [sortBy, setSortBy] = useState<"overdueDays" | "amount" | "name">("overdueDays");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = OVERDUE_DATA.filter((s) => {
    if (selectedClass !== "전체 반" && s.class !== selectedClass) return false;
    if (selectedStatus === "연체" && s.status !== "overdue") return false;
    if (selectedStatus === "미납" && s.status !== "unpaid") return false;
    if (selectedStatus === "납부기한 임박" && s.status !== "late") return false;
    if (searchQuery && !s.name.includes(searchQuery) && !s.parentName.includes(searchQuery)) return false;
    return true;
  }).sort((a, b) => {
    const order = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "overdueDays") return (a.overdueDays - b.overdueDays) * order;
    if (sortBy === "amount") return (a.amount - b.amount) * order;
    return a.name.localeCompare(b.name) * order;
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((s) => s.id)));
    }
  };

  const handleBulkSMS = () => {
    const selected = OVERDUE_DATA.filter((s) => selectedIds.has(s.id));
    alert(`문자 발송: ${selected.map((s) => s.parentName).join(", ")}님께 연체 안내 문자를 발송합니다.`);
  };

  const getStatusBadge = (status: string, days: number) => {
    if (status === "overdue") return <Badge variant="danger">연체 · {days}일</Badge>;
    if (status === "late") return <Badge variant="warning">기한임박 · {days}일</Badge>;
    return <Badge variant="default">미납</Badge>;
  };

  const overdueTotal = filtered.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">미납 회원 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            미납/연체 회원을 관리하고 안내 문자를 발송하세요
          </p>
        </div>
        <button
          onClick={handleBulkSMS}
          disabled={selectedIds.size === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          일괄 문자 발송 ({selectedIds.size})
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">전체 미납 회원</p>
            <p className="mt-1 text-3xl font-bold text-red-600">{OVERDUE_DATA.length}명</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">총 미납 금액</p>
            <p className="mt-1 text-3xl font-bold text-red-600">
              ₩{OVERDUE_DATA.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">연체 (30일 이상)</p>
            <p className="mt-1 text-3xl font-bold text-orange-600">
              {OVERDUE_DATA.filter((s) => s.overdueDays >= 30).length}명
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <div className="flex gap-1">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedStatus === s
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <SearchInput
            placeholder="이름 또는 보호자명 검색"
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  onClick={() => toggleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    이름
                    {sortBy === "name" && <ChevronDown className={`h-3 w-3 ${sortOrder === "desc" ? "" : "rotate-180"}`} />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">반</th>
                <th
                  className="cursor-pointer px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500"
                  onClick={() => toggleSort("amount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    미납액
                    {sortBy === "amount" && <ChevronDown className={`h-3 w-3 ${sortOrder === "desc" ? "" : "rotate-180"}`} />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">납부기한</th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                  onClick={() => toggleSort("overdueDays")}
                >
                  <div className="flex items-center gap-1">
                    연체기간
                    {sortBy === "overdueDays" && <ChevronDown className={`h-3 w-3 ${sortOrder === "desc" ? "" : "rotate-180"}`} />}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">보호자</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
                    조건에 맞는 미납 회원이 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((student) => (
                  <tr key={student.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(student.id)}
                        onChange={() => toggleSelect(student.id)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{student.class}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium text-red-600">
                      ₩{student.amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{student.dueDate}</td>
                    <td className="whitespace-nowrap px-4 py-3">{getStatusBadge(student.status, student.overdueDays)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                      {student.parentName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => alert(`개별 문자 발송: ${student.parentName} (${student.phone})`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <Bell className="h-3 w-3" />
                        문자
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            선택 {selectedIds.size}명 · 총 미납액{" "}
            <span className="font-medium text-red-600">
              ₩{filtered.filter((s) => selectedIds.has(s.id)).reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
            </span>
          </p>
          <button
            onClick={handleBulkSMS}
            disabled={selectedIds.size === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            선택 발송 ({selectedIds.size})
          </button>
        </div>
      </Card>
    </div>
  );
}
