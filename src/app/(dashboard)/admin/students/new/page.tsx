"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

const steps = ["기본정보", "추가정보", "반배정", "특이사항"];

export default function StudentRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "남",
    parentName: "",
    parentPhone: "",
    address: "",
    photo: null as File | null,
    school: "",
    grade: "",
    emergencyContact: "",
    bloodType: "A",
    className: "유치부 A",
    notes: "",
    allergies: "",
    medications: "",
  });

  const updateField = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() !== "" && formData.birthDate !== "" && formData.parentName.trim() !== "" && formData.parentPhone.trim() !== "";
      case 1:
        return true;
      case 2:
        return formData.className !== "";
      case 3:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Simulate submission
    alert("원생이 등록되었습니다.");
    router.push("/admin/students");
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
            <ArrowRight className="mx-1 h-4 w-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="원생 이름"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                생년월일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option>남</option>
                <option>여</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                보호자 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) => updateField("parentName", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="보호자 이름"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                보호자 연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => updateField("parentPhone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="주소 입력"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학교</label>
              <input
                type="text"
                value={formData.school}
                onChange={(e) => updateField("school", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="학교명"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">학년</label>
              <select
                value={formData.grade}
                onChange={(e) => updateField("grade", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">선택</option>
                <option>유치부</option>
                <option>1학년</option>
                <option>2학년</option>
                <option>3학년</option>
                <option>4학년</option>
                <option>5학년</option>
                <option>6학년</option>
                <option>중등</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비상연락처</label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => updateField("emergencyContact", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="비상연락처"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">혈액형</label>
              <select
                value={formData.bloodType}
                onChange={(e) => updateField("bloodType", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option>A</option>
                <option>B</option>
                <option>O</option>
                <option>AB</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                프로필 사진
              </label>
              <div className="flex items-center gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <span>파일 선택</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        updateField("photo", e.target.files[0]);
                      }
                    }}
                  />
                </label>
                {formData.photo && (
                  <span className="text-sm text-gray-500">{formData.photo.name}</span>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              반 선택 <span className="text-red-500">*</span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              {["유치부 A", "초등저 B", "초등고 A", "선수반"].map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => updateField("className", cls)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    formData.className === cls
                      ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{cls}</h4>
                  <p className="mt-1 text-xs text-gray-500">
                    {cls === "유치부 A"
                      ? "6-7세"
                      : cls === "초등저 B"
                        ? "8-10세"
                        : cls === "초등고 A"
                          ? "11-13세"
                          : "14-16세 (선수 육성)"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                특이사항 (질환/알레르기 등)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="특이사항을 입력하세요 (예: 천식 있음, 격한 운동 시 주의)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                알레르기 정보
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="알레르기 정보 (해당 시)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                복용 중인 약물
              </label>
              <textarea
                value={formData.medications}
                onChange={(e) => updateField("medications", e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="복용 중인 약물 정보 (해당 시)"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/students"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">원생 등록</h2>
          <p className="mt-1 text-sm text-gray-500">
            단계별 정보를 입력하여 새 원생을 등록합니다
          </p>
        </div>
      </div>

      <Card>
        {renderStepIndicator()}
        {renderStepContent()}

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" />
            이전
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              등록 완료
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}
