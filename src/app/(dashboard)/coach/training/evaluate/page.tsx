"use client";

import { useState } from "react";
import { Star, Save, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const classOptions = ["유치부 A", "유치부 B", "초등저 A", "초등저 B"];

interface StudentRating {
  id: string;
  name: string;
  dribble: number;
  pass: number;
  shoot: number;
  defense: number;
  attitude: number;
}

const initialStudents: StudentRating[] = [
  { id: "1", name: "김민재", dribble: 3, pass: 4, shoot: 4, defense: 2, attitude: 4 },
  { id: "2", name: "최유진", dribble: 5, pass: 4, shoot: 5, defense: 3, attitude: 5 },
  { id: "3", name: "박서준", dribble: 3, pass: 3, shoot: 4, defense: 3, attitude: 3 },
  { id: "4", name: "정예린", dribble: 4, pass: 4, shoot: 3, defense: 4, attitude: 5 },
  { id: "5", name: "홍지우", dribble: 2, pass: 3, shoot: 2, defense: 2, attitude: 3 },
  { id: "6", name: "강민서", dribble: 4, pass: 3, shoot: 4, defense: 4, attitude: 4 },
];

const ratingLabels = ["미흡", "부족", "보통", "좋음", "탁월"];
const ratingItems = [
  { key: "dribble", label: "드리블" },
  { key: "pass", label: "패스" },
  { key: "shoot", label: "슈팅" },
  { key: "defense", label: "수비" },
  { key: "attitude", label: "태도" },
];

export default function CoachTrainingEvaluatePage() {
  const [selectedClass, setSelectedClass] = useState("유치부 A");
  const [students, setStudents] = useState<StudentRating[]>(initialStudents);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const updateRating = (
    studentId: string,
    field: keyof Omit<StudentRating, "id" | "name">,
    value: number
  ) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, [field]: value } : s
      )
    );
  };

  const getAverage = (student: StudentRating) => {
    return (
      (student.dribble +
        student.pass +
        student.shoot +
        student.defense +
        student.attitude) /
      5
    ).toFixed(1);
  };

  const getGradeFromAvg = (avg: number) => {
    if (avg >= 4.5) return { label: "A+", color: "text-green-600 bg-green-50" };
    if (avg >= 4.0) return { label: "A", color: "text-green-600 bg-green-50" };
    if (avg >= 3.5) return { label: "B+", color: "text-blue-600 bg-blue-50" };
    if (avg >= 3.0) return { label: "B", color: "text-blue-600 bg-blue-50" };
    if (avg >= 2.5) return { label: "C+", color: "text-amber-600 bg-amber-50" };
    return { label: "C", color: "text-red-600 bg-red-50" };
  };

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform active:scale-125"
          aria-label={`${star}점`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            )}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">훈련 평가 입력</h2>
        <p className="mt-1 text-sm text-gray-500">
          항목별로 1~5점을 선택하세요
        </p>
      </div>

      {/* Class Select */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">반</label>
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
        <div className="flex-1 min-w-[140px]">
          <label className="mb-1 block text-xs font-medium text-gray-500">훈련 일자</label>
          <input
            type="date"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Student Evaluation Cards */}
      <div className="space-y-3">
        {students.map((student) => {
          const avg = parseFloat(getAverage(student));
          const grade = getGradeFromAvg(avg);
          const isExpanded = expandedStudent === student.id;

          return (
            <Card key={student.id}>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setExpandedStudent(
                    isExpanded ? null : student.id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {student.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {student.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-xs font-medium",
                          grade.color
                        )}
                      >
                        {grade.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        평균 {avg}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-gray-400 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                  {ratingItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {item.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <StarRating
                          value={
                            student[item.key as keyof StudentRating] as number
                          }
                          onChange={(v) =>
                            updateRating(
                              student.id,
                              item.key as keyof Omit<
                                StudentRating,
                                "id" | "name"
                              >,
                              v
                            )
                          }
                        />
                        <span className="w-5 text-center text-xs font-medium text-gray-500">
                          {
                            ratingLabels[
                              (student[item.key as keyof StudentRating] as number) - 1
                            ]
                          }
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Comment */}
                  <div className="pt-2">
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      코멘트
                    </label>
                    <textarea
                      rows={2}
                      placeholder="평가 코멘트를 입력하세요..."
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800">
          <Save className="h-4 w-4" />
          평가 저장
        </button>
      </div>
    </div>
  );
}
