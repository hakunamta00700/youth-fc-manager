"use client";

import { useState } from "react";
import {
  Save,
  Upload,
  Plus,
  X,
  UserCheck,
  UserPlus,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const coachOptions = ["박코치", "이코치", "최코치", "김코치"];
const classOptions = ["유치부 A", "유치부 B", "초등저 A", "초등저 B"];

interface HandoverItem {
  id: string;
  category: string;
  title: string;
  content: string;
}

interface Attachment {
  id: string;
  name: string;
  size: string;
}

export default function CoachHandoverNewPage() {
  const [handoverPerson, setHandoverPerson] = useState("박코치");
  const [receiverPerson, setReceiverPerson] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([""]);
  const [items, setItems] = useState<HandoverItem[]>([
    { id: "1", category: "진행 상황", title: "훈련 진행 상황", content: "" },
    { id: "2", category: "특이사항", title: "", content: "" },
  ]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [memo, setMemo] = useState("");

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        category: "",
        title: "",
        content: "",
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof HandoverItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: `파일_${prev.length + 1}.pdf`,
        size: "0.5MB",
      },
    ]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">인수인계 노트 작성</h2>
        <p className="mt-1 text-sm text-gray-500">
          업무 인수인계 내용을 기록하세요
        </p>
      </div>

      {/* Basic Info */}
      <Card title="기본 정보">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              인계자
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
              <UserCheck className="h-4 w-4 text-blue-500" />
              {handoverPerson}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              인수자
            </label>
            <select
              value={receiverPerson}
              onChange={(e) => setReceiverPerson(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">선택하세요</option>
              {coachOptions
                .filter((c) => c !== handoverPerson)
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              시작일
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              종료일
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Classes */}
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-gray-500">
            담당반
          </label>
          <div className="flex flex-wrap gap-2">
            {classOptions.map((cls) => (
              <button
                key={cls}
                onClick={() =>
                  setSelectedClasses((prev) =>
                    prev.includes(cls)
                      ? prev.filter((c) => c !== cls)
                      : [...prev, cls]
                  )
                }
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                  selectedClasses.includes(cls)
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Handover Items */}
      <Card title="인수인계 항목">
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        구분
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateItem(item.id, "category", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">선택</option>
                        <option value="진행 상황">진행 상황</option>
                        <option value="특이사항">특이사항</option>
                        <option value="참고 사항">참고 사항</option>
                        <option value="미해결 업무">미해결 업무</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-500">
                        제목
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          updateItem(item.id, "title", e.target.value)
                        }
                        placeholder="항목 제목"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      내용
                    </label>
                    <textarea
                      value={item.content}
                      onChange={(e) =>
                        updateItem(item.id, "content", e.target.value)
                      }
                      rows={3}
                      placeholder="상세 내용을 입력하세요"
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-blue-300 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
            항목 추가
          </button>
        </div>
      </Card>

      {/* Attachments */}
      <Card title="파일 첨부">
        <div className="space-y-3">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-400">({file.size})</span>
              </div>
              <button
                onClick={() => removeAttachment(file.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addAttachment}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            파일 추가
          </button>
        </div>
      </Card>

      {/* Memo */}
      <Card title="추가 메모">
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="추가로 전달할 사항이 있으면 입력하세요..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
        />
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <button className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
          임시 저장
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
          <Save className="h-4 w-4" />
          제출
        </button>
      </div>
    </div>
  );
}
