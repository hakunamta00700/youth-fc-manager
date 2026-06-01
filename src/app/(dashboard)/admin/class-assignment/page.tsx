"use client";

import { useState } from "react";
import { GripVertical, ArrowLeft, ArrowRight, Save, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const classData = [
  {
    id: "유치부 A",
    coach: "박코치",
    students: [
      { id: "1", name: "김민재", age: "7세" },
      { id: "2", name: "최유진", age: "8세" },
      { id: "3", name: "박서준", age: "7세" },
      { id: "4", name: "정예린", age: "6세" },
      { id: "5", name: "홍지우", age: "7세" },
      { id: "6", name: "강민서", age: "8세" },
    ],
  },
  {
    id: "초등저 B",
    coach: "이코치",
    students: [
      { id: "7", name: "이서준", age: "10세" },
      { id: "8", name: "한소희", age: "9세" },
      { id: "9", name: "김지호", age: "10세" },
    ],
  },
  {
    id: "초등고 A",
    coach: "최코치",
    students: [
      { id: "10", name: "박지호", age: "13세" },
      { id: "11", name: "최민준", age: "12세" },
    ],
  },
  {
    id: "선수반",
    coach: "박코치",
    students: [
      { id: "12", name: "정우성", age: "15세" },
    ],
  },
];

const unassignedStudents = [
  { id: "13", name: "신입생A", age: "7세" },
  { id: "14", name: "신입생B", age: "10세" },
];

export default function ClassAssignmentPage() {
  const [activeClass, setActiveClass] = useState(classData[0].id);
  const [classes, setClasses] = useState(classData);

  const currentClass = classes.find((c) => c.id === activeClass) || classes[0];

  const moveStudent = (studentId: string, direction: "prev" | "next") => {
    const classIdx = classes.findIndex((c) => c.id === activeClass);
    if (classIdx === -1) return;

    const targetIdx = direction === "prev" ? classIdx - 1 : classIdx + 1;
    if (targetIdx < 0 || targetIdx >= classes.length) return;

    const newClasses = classes.map((cls) => ({
      ...cls,
      students: [...cls.students],
    }));

    const studentIdx = newClasses[classIdx].students.findIndex(
      (s) => s.id === studentId
    );
    if (studentIdx === -1) return;

    const [moved] = newClasses[classIdx].students.splice(studentIdx, 1);
    newClasses[targetIdx].students.push(moved);
    setClasses(newClasses);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">반 배정 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            반별 원생을 확인하고 이동시킬 수 있습니다
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert("변경사항이 저장되었습니다")}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Save className="h-4 w-4" />
          변경사항 저장
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <div className="space-y-1">
            {classes.map((cls) => (
              <button
                key={cls.id}
                type="button"
                onClick={() => setActiveClass(cls.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  activeClass === cls.id
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {cls.id}
                </span>
                <Badge variant="info" size="sm">
                  {cls.students.length}
                </Badge>
              </button>
            ))}
          </div>
          <hr className="my-3 border-gray-100" />
          <div className="px-3">
            <p className="text-xs font-medium text-gray-400 mb-2">미배정</p>
            {unassignedStudents.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-1.5 text-sm text-gray-600"
              >
                <span>{s.name}</span>
                <span className="text-xs text-gray-400">{s.age}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Main content */}
        <Card className="lg:col-span-3" title={`${currentClass.id} (담당: ${currentClass.coach})`}>
          <div className="space-y-2">
            {currentClass.students.map((student, idx) => (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-gray-300" />
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{student.name}</p>
                    <p className="text-xs text-gray-400">{student.age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveStudent(student.id, "prev")}
                    disabled={classes.findIndex((c) => c.id === activeClass) === 0}
                    className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="이전 반으로 이동"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStudent(student.id, "next")}
                    disabled={
                      classes.findIndex((c) => c.id === activeClass) ===
                      classes.length - 1
                    }
                    className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="다음 반으로 이동"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {currentClass.students.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-400">
                이 반에 배정된 원생이 없습니다
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
