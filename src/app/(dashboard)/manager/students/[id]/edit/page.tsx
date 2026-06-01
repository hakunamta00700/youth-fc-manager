"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CalendarDays,
  School,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CLASS_OPTIONS = ["유치부 A", "유치부 B", "초등저 A", "초등저 B", "초등고 A", "초등고 B", "선수반"];
const STATUS_OPTIONS = [
  { value: "active", label: "수강중" },
  { value: "paused", label: "일시정지" },
  { value: "dropped", label: "퇴원" },
];

interface StudentForm {
  name: string;
  age: string;
  birthday: string;
  class: string;
  parentName: string;
  relation: string;
  phone: string;
  address: string;
  status: string;
  memo: string;
}

export default function StudentEditPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  // In a real app, fetch student data by ID
  const [form, setForm] = useState<StudentForm>({
    name: "김민재",
    age: "7세",
    birthday: "2019-03-15",
    class: "유치부 A",
    parentName: "김철수",
    relation: "부",
    phone: "010-1234-5678",
    address: "서울시 강남구 역삼동",
    status: "active",
    memo: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateField = <K extends keyof StudentForm>(
    key: K,
    value: StudentForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("원생 정보가 수정되었습니다.");
    router.push("/manager/students");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">원생 정보 수정</h2>
            <p className="mt-1 text-sm text-gray-500">
              ID: {studentId} · 개별 필드를 수정할 수 있습니다
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "저장 중..." : "저장"}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white"
                style={{ backgroundColor: "#2563eb" }}
              >
                {form.name.charAt(0)}
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">{form.name}</h3>
              <p className="text-sm text-gray-500">
                {form.age} · {form.class}
              </p>
              <div className="mt-3">
                <Badge
                  variant={
                    form.status === "active"
                      ? "success"
                      : form.status === "paused"
                        ? "warning"
                        : "danger"
                  }
                >
                  {STATUS_OPTIONS.find((s) => s.value === form.status)?.label}
                </Badge>
              </div>
            </div>
            <hr className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">출석률</span>
                <span className="font-medium text-green-600">95%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">납부 상태</span>
                <Badge variant="success">완납</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">등록일</span>
                <span className="text-gray-900">2025-03-15</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <Card title="기본 정보">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <User className="mr-1 inline-block h-3.5 w-3.5" />
                  이름
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Age */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">연령</label>
                <input
                  type="text"
                  value={form.age}
                  onChange={(e) => updateField("age", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Birthday */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                  생년월일
                </label>
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => updateField("birthday", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Class */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <School className="mr-1 inline-block h-3.5 w-3.5" />
                  반 배정
                </label>
                <select
                  value={form.class}
                  onChange={(e) => updateField("class", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {CLASS_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Parent name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">보호자 이름</label>
                <input
                  type="text"
                  value={form.parentName}
                  onChange={(e) => updateField("parentName", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Relation */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">관계</label>
                <select
                  value={form.relation}
                  onChange={(e) => updateField("relation", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="부">부</option>
                  <option value="모">모</option>
                  <option value="조부모">조부모</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <Phone className="mr-1 inline-block h-3.5 w-3.5" />
                  연락처
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  <MapPin className="mr-1 inline-block h-3.5 w-3.5" />
                  주소
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">상태</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Memo */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">메모</label>
                <textarea
                  value={form.memo}
                  onChange={(e) => updateField("memo", e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="특이사항이나 메모를 입력하세요"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
