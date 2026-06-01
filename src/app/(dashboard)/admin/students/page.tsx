"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Grid3X3, List, Eye, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";

const mockStudents = [
  { id: "1", name: "김민재", age: "7세", className: "유치부 A", parent: "김철수", phone: "010-1234-5678", status: "수강중", regDate: "2025-03-15", attendance: 95 },
  { id: "2", name: "이서준", age: "10세", className: "초등저 B", parent: "이영희", phone: "010-2345-6789", status: "수강중", regDate: "2025-01-10", attendance: 88 },
  { id: "3", name: "박지호", age: "13세", className: "초등고 A", parent: "박민수", phone: "010-3456-7890", status: "수강중", regDate: "2024-09-01", attendance: 62 },
  { id: "4", name: "최유진", age: "8세", className: "유치부 A", parent: "최미영", phone: "010-4567-8901", status: "수강중", regDate: "2025-02-20", attendance: 92 },
  { id: "5", name: "정우성", age: "15세", className: "선수반", parent: "정대표", phone: "010-5678-9012", status: "일시정지", regDate: "2024-06-15", attendance: 45 },
  { id: "6", name: "한소희", age: "9세", className: "초등저 B", parent: "한지민", phone: "010-6789-0123", status: "수강중", regDate: "2025-04-01", attendance: 78 },
];

const statusColors: Record<string, "success" | "warning" | "danger" | "info" | "default"> = {
  수강중: "success",
  일시정지: "warning",
  퇴원: "danger",
};

export default function StudentListPage() {
  const [searchValue, setSearchValue] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");

  const filteredStudents = mockStudents.filter((s) => {
    const matchesSearch =
      s.name.includes(searchValue) || s.phone.includes(searchValue);
    const matchesClass = classFilter === "all" || s.className === classFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesAge = ageFilter === "all" || s.age === ageFilter;
    return matchesSearch && matchesClass && matchesStatus && matchesAge;
  });

  const columns = [
    {
      key: "name",
      label: "이름",
      sortable: true,
      render: (row: (typeof mockStudents)[0]) => (
        <Link
          href={`/admin/students/${row.id}`}
          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {row.name}
        </Link>
      ),
    },
    { key: "age", label: "연령", sortable: true },
    {
      key: "className",
      label: "반",
      render: (row: (typeof mockStudents)[0]) => (
        <Badge variant="info">{row.className}</Badge>
      ),
    },
    { key: "parent", label: "보호자" },
    { key: "phone", label: "연락처" },
    {
      key: "status",
      label: "상태",
      render: (row: (typeof mockStudents)[0]) => (
        <Badge variant={statusColors[row.status] || "default"}>
          {row.status}
        </Badge>
      ),
    },
    { key: "regDate", label: "등록일", sortable: true },
    {
      key: "actions",
      label: "관리",
      render: (row: (typeof mockStudents)[0]) => (
        <Link
          href={`/admin/students/${row.id}`}
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Eye className="h-4 w-4" />
          <span>상세</span>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">원생 목록</h2>
          <p className="mt-1 text-sm text-gray-500">전체 원생을 조회하고 관리합니다</p>
        </div>
        <Link
          href="/admin/students/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          원생 등록
        </Link>
      </div>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              placeholder="이름/연락처 검색"
              value={searchValue}
              onChange={setSearchValue}
              className="w-full sm:w-64"
            />
            <FilterBar
              filters={[
                {
                  label: "반",
                  options: [
                    { label: "전체 반", value: "all" },
                    { label: "유치부 A", value: "유치부 A" },
                    { label: "초등저 B", value: "초등저 B" },
                    { label: "초등고 A", value: "초등고 A" },
                    { label: "선수반", value: "선수반" },
                  ],
                  value: classFilter,
                  onChange: setClassFilter,
                },
                {
                  label: "연령",
                  options: [
                    { label: "전체 연령", value: "all" },
                    { label: "6세", value: "6세" },
                    { label: "7세", value: "7세" },
                    { label: "8세", value: "8세" },
                    { label: "9세", value: "9세" },
                    { label: "10세", value: "10세" },
                  ],
                  value: ageFilter,
                  onChange: setAgeFilter,
                },
                {
                  label: "상태",
                  options: [
                    { label: "전체 상태", value: "all" },
                    { label: "수강중", value: "수강중" },
                    { label: "일시정지", value: "일시정지" },
                    { label: "퇴원", value: "퇴원" },
                  ],
                  value: statusFilter,
                  onChange: setStatusFilter,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-4 w-4" />
              리스트
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                viewMode === "card"
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid3X3 className="h-4 w-4" />
              카드
            </button>
          </div>
        </div>
      </Card>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={filteredStudents}
          page={1}
          pageSize={10}
          total={filteredStudents.length}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Link key={student.id} href={`/admin/students/${student.id}`}>
              <Card hoverable className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                    {student.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {student.age} · {student.className}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge
                        variant={statusColors[student.status] || "default"}
                        size="sm"
                      >
                        {student.status}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        보호자: {student.parent}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>출석률</span>
                        <span
                          className={
                            student.attendance >= 80
                              ? "text-green-600"
                              : student.attendance >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {student.attendance}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className={`h-1.5 rounded-full ${
                            student.attendance >= 80
                              ? "bg-green-500"
                              : student.attendance >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${student.attendance}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
