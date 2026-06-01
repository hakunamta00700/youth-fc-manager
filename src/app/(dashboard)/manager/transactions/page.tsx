"use client";

import { useState } from "react";
import {
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SearchInput } from "@/components/ui/SearchInput";

interface Transaction {
  id: string;
  date: string;
  studentName: string;
  amount: number;
  method: string;
  category: string;
  registrant: string;
  type: "income" | "expense";
}

const TRANSACTIONS: Transaction[] = [
  { id: "1", date: "2026-06-01", studentName: "김민재", amount: 350000, method: "계좌이체", category: "회비", registrant: "매니저", type: "income" },
  { id: "2", date: "2026-06-01", studentName: "최유진", amount: 350000, method: "계좌이체", category: "회비", registrant: "매니저", type: "income" },
  { id: "3", date: "2026-05-31", studentName: "정우성", amount: 350000, method: "현금", category: "회비", registrant: "대표", type: "income" },
  { id: "4", date: "2026-05-30", studentName: "한소희", amount: 350000, method: "카드", category: "회비", registrant: "매니저", type: "income" },
  { id: "5", date: "2026-06-02", studentName: "-", amount: 120000, method: "카드", category: "용품 구매", registrant: "매니저", type: "expense" },
  { id: "6", date: "2026-06-01", studentName: "-", amount: 250000, method: "계좌이체", category: "대회 참가비", registrant: "매니저", type: "expense" },
  { id: "7", date: "2026-05-28", studentName: "박지호", amount: 400000, method: "계좌이체", category: "회비", registrant: "매니저", type: "income" },
  { id: "8", date: "2026-05-25", studentName: "-", amount: 80000, method: "현금", category: "차량 유지", registrant: "매니저", type: "expense" },
];

const METHOD_OPTIONS = ["전체", "계좌이체", "현금", "카드"];
const CATEGORY_OPTIONS = ["전체", "회비", "용품 구매", "대회 참가비", "차량 유지", "시설 관리"];
const TYPE_OPTIONS = ["전체", "수입", "지출"];

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("전체");
  const [categoryFilter, setCategoryFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = TRANSACTIONS.filter((tx) => {
    if (typeFilter === "수입" && tx.type !== "income") return false;
    if (typeFilter === "지출" && tx.type !== "expense") return false;
    if (methodFilter !== "전체" && tx.method !== methodFilter) return false;
    if (categoryFilter !== "전체" && tx.category !== categoryFilter) return false;
    if (dateFrom && tx.date < dateFrom) return false;
    if (dateTo && tx.date > dateTo) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !tx.studentName.toLowerCase().includes(q) &&
        !tx.category.toLowerCase().includes(q) &&
        !tx.registrant.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  const totalIncome = filtered.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = filtered.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);

  const handleExport = (format: "xlsx" | "csv") => {
    alert(`${format.toUpperCase()} 내보내기: ${filtered.length}건의 거래 내역`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">거래 내역</h2>
          <p className="mt-1 text-sm text-gray-500">
            전체 수입/지출 내역을 조회하고 내보낼 수 있습니다
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("xlsx")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            XLSX
          </button>
          <button
            onClick={() => handleExport("csv")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <FileText className="h-4 w-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">총 수입</p>
            <p className="mt-1 text-2xl font-bold text-green-600">
              +₩{totalIncome.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">총 지출</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              -₩{totalExpense.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-500">순계</p>
            <p className={`mt-1 text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-red-600"}`}>
              ₩{(totalIncome - totalExpense).toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">기간</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">유형</label>
            <div className="flex gap-1">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    typeFilter === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">결제 방식</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {METHOD_OPTIONS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">카테고리</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <SearchInput
              placeholder="검색어 입력"
              value={searchQuery}
              onChange={setSearchQuery}
              className="w-full sm:w-48"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">날짜</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">원생</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">카테고리</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">금액</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">방식</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">등록자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-500">
                    조건에 맞는 거래 내역이 없습니다
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{tx.date}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                      {tx.studentName}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{tx.category}</td>
                    <td className={`whitespace-nowrap px-4 py-3 text-right text-sm font-medium ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}₩{tx.amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{tx.method}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">{tx.registrant}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p className="text-sm text-gray-500">
            전체 {TRANSACTIONS.length}건 중 {filtered.length}건 표시
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("xlsx")}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-3 w-3" />
              XLSX 내보내기
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-3 w-3" />
              CSV 내보내기
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
