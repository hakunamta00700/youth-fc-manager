"use client";

import { useState } from "react";
import { CloudRain, Send, Eye, Calendar, Umbrella, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const weatherInfo = {
  status: "호우주의보",
  precipitation: "85%",
  temp: "22°C",
  area: "서울 전체",
};

const makeUpClasses = [
  { date: "2025-06-08 (일)", time: "14:00-15:30", className: "유치부 A", location: "실내 체육관" },
  { date: "2025-06-08 (일)", time: "16:00-17:30", className: "초등저 B", location: "실내 체육관" },
];

export default function WeatherCancelPage() {
  const [selectedClasses, setSelectedClasses] = useState(["유치부 A", "초등저 B", "초등고 A"]);
  const [weatherCriteria, setWeatherCriteria] = useState("호우주의보");
  const [template, setTemplate] = useState(
    "[긴급] 오늘 수업은 우천으로 인해 취소되었습니다. 보강 일정은 추후 공지드리겠습니다."
  );
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const toggleClass = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleSend = () => {
    if (selectedClasses.length === 0) {
      alert("대상 반을 선택해주세요.");
      return;
    }
    alert("공지 발송 완료 (Push + SMS)");
  };

  const handlePreview = () => {
    alert(`[미리보기]\n\n${template}\n\n대상: ${selectedClasses.join(", ")}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">우천/취소 공지 발송</h2>
        <p className="mt-1 text-sm text-gray-500">
          우천 등 돌발 상황 발생 시 학부모에게 긴급 공지를 발송합니다
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weather Info Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <CloudRain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-gray-900">현재 기상 상황</h3>
            <div className="mt-2">
              <Badge variant="danger" size="md">호우주의보</Badge>
            </div>
            <div className="mt-4 w-full space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">강수확률</span>
                <span className="font-medium text-gray-900">{weatherInfo.precipitation}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">기온</span>
                <span className="font-medium text-gray-900">{weatherInfo.temp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">대상 지역</span>
                <span className="font-medium text-gray-900">{weatherInfo.area}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <Card>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    우천 기준
                  </label>
                  <select
                    value={weatherCriteria}
                    onChange={(e) => setWeatherCriteria(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>호우주의보</option>
                    <option>강수확률 80% 이상</option>
                    <option>태풍 주의보</option>
                    <option>직접 입력</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    대상 반
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["유치부 A", "초등저 B", "초등고 A", "선수반"].map((cls) => (
                      <label
                        key={cls}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
                          selectedClasses.includes(cls)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedClasses.includes(cls)}
                          onChange={() => toggleClass(cls)}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        {cls}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Template Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-gray-700">
                    공지 템플릿
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                    className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {showTemplateEditor ? "간단히 보기" : "템플릿 편집"}
                  </button>
                </div>
                {showTemplateEditor ? (
                  <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                    {template}
                  </div>
                )}
              </div>

              {/* Send Buttons */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={handleSend}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <Send className="h-4 w-4" />
                  긴급 발송
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4" />
                  미리보기
                </button>
              </div>
            </div>
          </Card>

          {/* Make-up Class Schedule */}
          <Card title="보강 일정 연동">
            <div className="space-y-3">
              {makeUpClasses.map((cls, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cls.className}</p>
                      <p className="text-xs text-gray-500">{cls.date} · {cls.time}</p>
                    </div>
                  </div>
                  <Badge variant="info" size="sm">{cls.location}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
