"use client";

import { useState } from "react";
import { Plus, Users, UserMinus, ChevronDown, Palette } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Student {
  id: string;
  name: string;
  age: string;
}

interface ClassGroup {
  id: string;
  name: string;
  color: string;
  students: Student[];
}

const initialClasses: ClassGroup[] = [
  {
    id: "1",
    name: "유치부 A",
    color: "#2563eb",
    students: [
      { id: "s1", name: "김민재", age: "7세" },
      { id: "s2", name: "최유진", age: "6세" },
      { id: "s3", name: "박서준", age: "7세" },
    ],
  },
  {
    id: "2",
    name: "초등저 B",
    color: "#059669",
    students: [
      { id: "s4", name: "이서준", age: "9세" },
      { id: "s5", name: "한소희", age: "8세" },
      { id: "s6", name: "정다인", age: "10세" },
    ],
  },
  {
    id: "3",
    name: "초등고 A",
    color: "#f59e0b",
    students: [
      { id: "s7", name: "박지호", age: "12세" },
      { id: "s8", name: "정우성", age: "13세" },
    ],
  },
  {
    id: "4",
    name: "선수반",
    color: "#dc2626",
    students: [
      { id: "s9", name: "최민수", age: "14세" },
      { id: "s10", name: "김도영", age: "15세" },
      { id: "s11", name: "이강인", age: "14세" },
      { id: "s12", name: "손흥민", age: "16세" },
    ],
  },
];

const unassignedStudents: Student[] = [
  { id: "s13", name: "신유나", age: "8세" },
  { id: "s14", name: "강지원", age: "7세" },
  { id: "s15", name: "윤서아", age: "10세" },
];

const colorOptions = ["#2563eb", "#059669", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

export default function ClassAssignmentPage() {
  const [classes, setClasses] = useState(initialClasses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newClassColor, setNewClassColor] = useState(colorOptions[0]);
  const [assignClassId, setAssignClassId] = useState<string | null>(null);
  const [assignStudentId, setAssignStudentId] = useState<string>("");

  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0) + unassignedStudents.length;

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const newClass: ClassGroup = {
      id: String(Date.now()),
      name: newClassName.trim(),
      color: newClassColor,
      students: [],
    };
    setClasses((prev) => [...prev, newClass]);
    setNewClassName("");
    setNewClassColor(colorOptions[0]);
    setShowAddModal(false);
  };

  const handleDeleteClass = (classId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setClasses((prev) => prev.filter((c) => c.id !== classId));
  };

  const handleUnassignStudent = (classId: string, studentId: string) => {
    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== classId) return c;
        return { ...c, students: c.students.filter((s) => s.id !== studentId) };
      })
    );
  };

  const handleAssignStudent = () => {
    if (!assignClassId || !assignStudentId) return;
    const studentToAssign = unassignedStudents.find((s) => s.id === assignStudentId);
    if (!studentToAssign) return;

    setClasses((prev) =>
      prev.map((c) => {
        if (c.id !== assignClassId) return c;
        return { ...c, students: [...c.students, studentToAssign] };
      })
    );
    setAssignClassId(null);
    setAssignStudentId("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">반 배정</h2>
          <p className="mt-1 text-sm text-gray-500">
            전체 원생 {totalStudents}명 · {classes.length}개 반
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          반 추가
        </button>
      </div>

      {/* Class Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="flex flex-col">
            {/* Class Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cls.color }}
                />
                <h3 className="text-base font-bold text-gray-900">{cls.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">
                  {cls.students.length}명
                </Badge>
              </div>
            </div>

            {/* Student List */}
            <div className="mt-3 flex-1 space-y-2">
              {cls.students.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-400">
                  배정된 원생이 없습니다
                </p>
              ) : (
                cls.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: cls.color }}
                      >
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-400">{student.age}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleUnassignStudent(cls.id, student.id)}
                      className="flex h-7 w-7 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="배정 해제"
                    >
                      <UserMinus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Assign Dropdown */}
            {unassignedStudents.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="flex items-center gap-2">
                  <select
                    value={assignClassId === cls.id ? assignStudentId : ""}
                    onChange={(e) => {
                      setAssignClassId(cls.id);
                      setAssignStudentId(e.target.value);
                      if (e.target.value) {
                        // Auto-assign on selection
                        const student = unassignedStudents.find((s) => s.id === e.target.value);
                        if (student) {
                          setClasses((prev) =>
                            prev.map((c) => {
                              if (c.id !== cls.id) return c;
                              return { ...c, students: [...c.students, student] };
                            })
                          );
                        }
                      }
                    }}
                    className="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="">+ 원생 배정</option>
                    {unassignedStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.age})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Class Actions */}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <button
                type="button"
                onClick={() => handleDeleteClass(cls.id)}
                className="w-full rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                반 삭제
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900">새 반 추가</h3>
            <p className="mt-1 text-sm text-gray-500">새로운 반을 생성합니다</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  반 이름
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="예: 유치부 C"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddClass();
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  색상
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewClassColor(color)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                        newClassColor === color
                          ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {newClassColor === color && (
                        <Palette className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleAddClass}
                disabled={!newClassName.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
                반 추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
