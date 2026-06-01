"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Save, Bold, Italic, Underline, List, Image as ImageIcon, Clock, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function NoticeWritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("전체");
  const [reserveTime, setReserveTime] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [scheduledSend, setScheduledSend] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    alert("공지가 발송되었습니다.");
    router.push("/admin/notices");
  };

  const handleSaveDraft = () => {
    alert("임시저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">공지사항 작성</h2>
          <p className="mt-1 text-sm text-gray-500">
            학부모 및 코치에게 공지사항을 발송합니다
          </p>
        </div>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="공지사항 제목을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Options Row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                대상
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option>전체</option>
                <option>유치부 A</option>
                <option>초등저 B</option>
                <option>초등고 A</option>
                <option>선수반</option>
                <option>코치 전용</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                예약 발송
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScheduledSend(!scheduledSend)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    scheduledSend
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  {scheduledSend ? "예약 ON" : "예약 OFF"}
                </button>
              </div>
            </div>
            {scheduledSend && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  예약 시간
                </label>
                <input
                  type="datetime-local"
                  value={reserveTime}
                  onChange={(e) => setReserveTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
            <div className="flex items-end gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-700">긴급</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">상단 고정</span>
              </label>
            </div>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              내용 <span className="text-red-500">*</span>
            </label>
            <div className="rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
              {/* Toolbar */}
              <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50 px-3 py-2">
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <span className="mx-1 h-5 w-px bg-gray-300" />
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-200 transition-colors"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="공지사항 내용을 입력하세요..."
                className="w-full resize-none border-0 px-4 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Attachment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              첨부파일
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <ImageIcon className="h-4 w-4" />
              <span>파일을 첨부하려면 클릭하세요</span>
              <input type="file" className="hidden" multiple />
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
              발송
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Save className="h-4 w-4" />
              임시저장
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
