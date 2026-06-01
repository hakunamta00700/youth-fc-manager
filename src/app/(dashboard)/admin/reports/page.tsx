"use client";

import { useState } from "react";
import { FileText, Eye, Send, Check, ChevronRight, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const steps = ["대상 선택", "항목 선택", "생성/미리보기", "발송"];

export default function ReportsPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetClass, setTargetClass] = useState("전체");
  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState("2025-05-31");
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeEval, setIncludeEval] = useState(true);
  const [includeComment, setIncludeComment] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerate = () => {
    setReportGenerated(true);
    setCurrentStep(2);
    alert("리포트가 생성되었습니다.");
  };

  const handlePreview = () => {
    if (!reportGenerated) {
      alert("먼저 리포트를 생성해주세요.");
      return;
    }
    alert("미리보기를 표시합니다.");
  };

  const handleSend = () => {
    alert("학부모에게 리포트가 일괄 발송되었습니다.");
    setCurrentStep(3);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {steps.map((step, idx) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              idx <= currentStep
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
          </div>
          <span
            className={`text-sm ${
              idx <= currentStep ? "font-medium text-gray-900" : "text-gray-400"
            }`}
          >
            {step}
          </span>
          {idx < steps.length - 1 && (
            <ChevronRight className="mx-1 h-4 w-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">리포트 생성/발송</h2>
        <p className="mt-1 text-sm text-gray-500">
          학부모용 훈련 리포트를 생성하고 발송합니다
        </p>
      </div>

      <Card>
        {renderStepIndicator()}

        <div className="space-y-6">
          {/* Step 0: Target Selection */}
          {currentStep === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  대상 반
                </label>
                <select
                  value={targetClass}
                  onChange={(e) => setTargetClass(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option>전체</option>
                  <option>유치부 A</option>
                  <option>초등저 B</option>
                  <option>초등고 A</option>
                  <option>선수반</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  리포트 기간
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <span className="text-gray-400">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Item Selection */}
          {currentStep === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                포함 항목 선택
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    includeAttendance
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeAttendance}
                    onChange={(e) => setIncludeAttendance(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">출석률</p>
                    <p className="text-xs text-gray-500">기간 내 출석 현황</p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    includeEval
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeEval}
                    onChange={(e) => setIncludeEval(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">훈련 평가</p>
                    <p className="text-xs text-gray-500">항목별 평점</p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                    includeComment
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={includeComment}
                    onChange={(e) => setIncludeComment(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">코치 코멘트</p>
                    <p className="text-xs text-gray-500">코치별 한줄 평가</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {currentStep === 2 && reportGenerated && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-blue-500" />
              <p className="mt-3 text-sm font-medium text-gray-900">
                리포트가 생성되었습니다
              </p>
              <p className="mt-1 text-xs text-gray-500">
                대상: {targetClass} · 기간: {startDate} ~ {endDate} · {targetClass === "전체" ? "38" : "15"}명 대상
              </p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge variant="info">출석률 포함</Badge>
                {includeEval && <Badge variant="info">훈련 평가 포함</Badge>}
                {includeComment && <Badge variant="info">코치 코멘트 포함</Badge>}
              </div>
            </div>
          )}

          {currentStep === 2 && !reportGenerated && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-300" />
              <p className="mt-3 text-sm text-gray-500">
                리포트를 생성하면 미리보기가 표시됩니다
              </p>
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <Check className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-3 text-sm font-medium text-green-800">
                리포트 발송이 완료되었습니다
              </p>
              <p className="mt-1 text-xs text-green-600">
                학부모 앱에서 확인 가능합니다
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>

            <div className="flex items-center gap-2">
              {currentStep === 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  리포트 생성
                </button>
              )}
              {currentStep === 2 && reportGenerated && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    미리보기
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    학부모 일괄 발송
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
