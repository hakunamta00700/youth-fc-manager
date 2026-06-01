"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { SearchInput } from "@/components/ui/SearchInput";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
  age: string;
  class: string;
  parentName: string;
  phone: string;
  status: "active" | "paused" | "dropped";
  payment: "paid" | "unpaid" | "overdue";
}

const STUDENT_DATA: Student[] = [
  { id: "s1", name: "김민재", age: "7세", class: "유치부 A", parentName: "김철수", phone: "010-1234-5678", status: "active", payment: "paid" },
  { id: "s2", name: "이서준", age: "10세", class: "초등저 B", parentName: "이영희", phone: "010-2345-6789", status: "active", payment: "unpaid" },
  { id: "s3", name: "박지호", age: "13세", class: "초등고 A", parentName: "박민수", phone: "010-3456-7890", status: "active", payment: "overdue" },
  { id: "s4", name: "정우성", age: "14세", class: "선수반", parentName: "정대표", phone: "010-4567-8901", status: "paused", payment: "unpaid" },
  { id: "s5", name: "최유진", age: "8세", class: "초등저 A", parentName: "최미선", phone: "010-5678-9012", status: "active", payment: "paid" },
  { id: "s6", name: "한소희", age: "6세", class: "유치부 B", parentName: "한미영", phone: "010-6789-0123", status: "active", payment: "paid" },
  { id: "s7", name: "강다니엘", age: "9세", class: "초등저 A", parentName: "강철수", phone: "010-7890-1234", status: "active", payment: "unpaid" },
  { id: "s8", name: "윤아", age: "12세", class: "초등고 B", parentName: "윤석진", phone: "010-8901-2345", status: "dropped", payment: "paid" },
];

const CLASS_OPTIONS = ["전체 반", "유치부 A", "유치부 B", "초등저 A", "초등저 B", "초등고 A", "초등고 B", "선수반"];
const STATUS_OPTIONS = ["전체", "수강중", "일시정지", "퇴원"];

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("전체 반");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Student[]>([]);
  const pageSize = 10;

  const filtered = useMemo(() => {
    return STUDENT_DATA.filter((s) => {
      if (classFilter !== "전체 반" && s.class !== classFilter) return false;
      if (statusFilter === "수강중" && s.status !== "active") return false;
      if (statusFilter === "일시정지" && s.status !== "paused") return false;
      if (statusFilter === "퇴원" && s.status !== "dropped") return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.parentName.toLowerCase().includes(q) &&
          !s.phone.includes(q)
        )
          return false;
      }
      return true;
    }).sort((a, b) => {
      const order = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return a.name.localeCompare(b.name) * order;
      if (sortField === "age") return a.age.localeCompare(b.age) * order;
      if (sortField === "class") return a.class.localeCompare(b.class) * order;
      return 0;
    });
  }, [searchQuery, classFilter, statusFilter, sortField, sortDir]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(key);
      setSortDir("asc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">수강중</Badge>;
      case "paused":
        return <Badge variant="warning">일시정지</Badge>;
      case "dropped":
        return <Badge variant="danger">퇴원</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getPaymentBadge = (payment: string) => {
    switch (payment) {
      case "paid":
        return <Badge variant="success">완납</Badge>;
      case "unpaid":
        return <Badge variant="warning">미납</Badge>;
      case "overdue":
        return <Badge variant="danger">연체</Badge>;
      default:
        return <Badge variant="default">{payment}</Badge>;
    }
  };

  const columns = [
    {
      key: "name",
      label: "이름",
      sortable: true,
      render: (s: Student) => (
        <span className="font-medium text-gray-900">{s.name}</span>
      ),
    },
    {
      key: "age",
      label: "연령",
      sortable: true,
    },
    {
      key: "class",
      label: "반",
      sortable: true,
      render: (s: Student) => (
        <Badge variant="info">{s.class}</Badge>
      ),
    },
    {
      key: "parentName",
      label: "보호자",
    },
    {
      key: "phone",
      label: "연락처",
    },
    {
      key: "status",
      label: "상태",
      render: (s: Student) => getStatusBadge(s.status),
    },
    {
      key: "payment",
      label: "납부",
      render: (s: Student) => getPaymentBadge(s.payment),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">원생 목록</h2>
          <p className="mt-1 text-sm text-gray-500">
            전체 원생 정보를 조회하고 관리합니다
          </p>
        </div>
        <Link
          href="/manager/register-convert"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          신규 등록
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            placeholder="이름/보호자/연락처 검색"
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />
          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Selected actions */}
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <span className="font-medium">{selectedRows.length}명</span> 선택됨
          <button
            onClick={() => alert(`일괄 문자 발송: ${selectedRows.map((r) => r.name).join(", ")}`)}
            className="ml-auto rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700"
          >
            문자 발송
          </button>
          <button
            onClick={() => setSelectedRows([])}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginated}
        onSort={handleSort}
        sortField={sortField}
        sortDir={sortDir}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onSelect={setSelectedRows}
        selectedRows={selectedRows}
      />
    </div>
  );
}
