"use client";

import { useState } from "react";
import {
  Save,
  Globe,
  Lock,
  Users,
  Tag,
  Calendar,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const classOptions = ["유치부 A", "유치부 B", "초등저 A", "초등저 B"];
const trainingTypes = [
  "기초 드리블",
  "패스 연습",
  "슈팅",
  "전술 훈련",
  "체력 훈련",
  "미니 게임",
];
const difficultyLevels = ["입문", "초급", "중급", "고급"];
const intensityLevels = ["낮음", "중간", "높음"];

const students = [
  { id: "1", name: "김민재" },
  { id: "2", name: "최유진" },
  { id: "3", name: "박서준" },
  { id: "4", name: "정예린" },
  { id: "5", name: "홍지우" },
  { id: "6", name: "강민서" },
];

interface StudentEval {
  id: string;
  name: string;
  grade: string;
}

export default function CoachTrainingLogPage() {
  const [selectedClass, setSelectedClass] = useState("유치부 A");
  const [trainingType, setTrainingType] = useState("기초 드리블");
  const [difficulty, setDifficulty] = useState("중급");
  const [intensity, setIntensity] = useState("중간");
  const [duration, setDuration] = useState("90분");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [keywords, setKeywords] = useState("");
  const [studentEvals, setStudentEvals] = useState<StudentEval[]>(
    students.map((s) => ({ id: s.id, name: s.name, grade: "B" }))
  );

  const updateGrade = (studentId: string, grade: string) => {
    setStudentEvals((prev) =>
      prev.map((e) => (e.id === studentId ? { ...e, grade } : e))
    );
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">훈련 일지 작성</h2>
        <p className="mt-1 text-sm text-gray-500">
          오늘의 훈련 내용을 기록하세요
        </p>
      </div>

      {/* Auto-fill info */}
      <div className="flex flex-wrap gap-3">
        <div className="rounded-lg bg-blue-50 px-4 py-2.5 text-sm text-blue-700">
          <Calendar className="mr-1.5 inline h-4 w-4" />
          {today}
        </div>
        <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
          <Users className="mr-1.5 inline h-4 w-4" />
          {selectedClass}
        </div>
      </div>

      <Card title="훈련 기본 정보">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              반
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              {classOptions.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              훈련 종류
            </label>
            <select
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              {trainingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              난이도
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              {difficultyLevels.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              소요 시간
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Intensity */}
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-gray-500">
            강도
          </label>
          <div className="flex gap-2">
            {intensityLevels.map((level) => (
              <button
                key={level}
                onClick={() => setIntensity(level)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                  intensity === level
                    ? level === "낮음"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : level === "중간"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-red-300 bg-red-50 text-red-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Training Content */}
      <Card title="훈련 내용">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              키워드 메모
            </label>
            <div className="flex flex-wrap gap-2">
              {["드리블", "패스", "슈팅", "수비", "팀워크", "체력"].map(
                (kw) => (
                  <button
                    key={kw}
                    onClick={() => {
                      const current = keywords ? keywords.split(", ") : [];
                      if (current.includes(kw)) {
                        setKeywords(
                          current.filter((k) => k !== kw).join(", ")
                        );
                      } else {
                        setKeywords([...current, kw].join(", "));
                      }
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      keywords.includes(kw)
                        ? "border-blue-300 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    <Tag className="mr-1 inline h-3 w-3" />
                    {kw}
                  </button>
                )
              )}
            </div>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="직접 입력..."
              className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">
              상세 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="오늘의 훈련 내용을 상세히 기록하세요..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Individual Evaluation */}
      <Card title="개인 평가" subtitle="원생별 등급 선택">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {studentEvals.map((student) => (
            <div
              key={student.id}
              className="rounded-lg border border-gray-200 p-3 text-center"
            >
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                {student.name[0]}
              </div>
              <div className="text-sm font-medium text-gray-900">
                {student.name}
              </div>
              <select
                value={student.grade}
                onChange={(e) => updateGrade(student.id, e.target.value)}
                className="mt-2 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
              >
                <option value="A">A (우수)</option>
                <option value="B">B (보통)</option>
                <option value="C">C (미흡)</option>
              </select>
            </div>
          ))}
        </div>
      </Card>

      {/* Visibility & Save */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-500">
              공개범위
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setVisibility("all")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  visibility === "all"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Globe className="h-4 w-4" />
                전체 공개
              </button>
              <button
                onClick={() => setVisibility("staff")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  visibility === "staff"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Users className="h-4 w-4" />
                스태프만
              </button>
              <button
                onClick={() => setVisibility("private")}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors",
                  visibility === "private"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                )}
              >
                <Lock className="h-4 w-4" />
                나만 보기
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800">
              <Save className="h-4 w-4" />
              저장
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
