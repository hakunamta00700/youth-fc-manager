"use client";

import { useState } from "react";
import {
  Camera,
  Users,
  User,
  Upload,
  Tag,
  Image,
  Check,
  X,
  Grid3X3,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface Photo {
  id: string;
  url: string;
  mode: "group" | "individual";
  studentTags: string[];
  parentTags: string[];
  timestamp: string;
  uploaded: boolean;
}

const classOptions = ["유치부 A", "유치부 B", "초등저 A", "초등저 B"];

const students = [
  { id: "1", name: "김민재", parent: "김수현" },
  { id: "2", name: "최유진", parent: "최미영" },
  { id: "3", name: "박서준", parent: "박지원" },
  { id: "4", name: "정예린", parent: "정수진" },
  { id: "5", name: "홍지우", parent: "홍민수" },
  { id: "6", name: "강민서", parent: "강태영" },
];

const samplePhotos: Photo[] = [
  {
    id: "1",
    url: "",
    mode: "group",
    studentTags: ["김민재", "최유진", "박서준"],
    parentTags: ["김수현", "최미영", "박지원"],
    timestamp: "2026-06-02 09:30",
    uploaded: true,
  },
  {
    id: "2",
    url: "",
    mode: "individual",
    studentTags: ["김민재"],
    parentTags: ["김수현"],
    timestamp: "2026-06-02 09:45",
    uploaded: true,
  },
  {
    id: "3",
    url: "",
    mode: "individual",
    studentTags: ["최유진"],
    parentTags: ["최미영"],
    timestamp: "2026-06-02 10:00",
    uploaded: true,
  },
];

export default function CoachPhotosPage() {
  const [mode, setMode] = useState<"group" | "individual">("group");
  const [selectedClass, setSelectedClass] = useState("유치부 A");
  const [taggedStudents, setTaggedStudents] = useState<string[]>([]);
  const [photos] = useState<Photo[]>(samplePhotos);

  const toggleStudentTag = (studentName: string) => {
    setTaggedStudents((prev) =>
      prev.includes(studentName)
        ? prev.filter((s) => s !== studentName)
        : [...prev, studentName]
    );
  };

  const selectAll = () => {
    if (taggedStudents.length === students.length) {
      setTaggedStudents([]);
    } else {
      setTaggedStudents(students.map((s) => s.name));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">사진 촬영 / 공유</h2>
        <p className="mt-1 text-sm text-gray-500">
          훈련 사진을 촬영하고 학부모와 공유하세요
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("group")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
            mode === "group"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-600"
          )}
        >
          <Users className="h-5 w-5" />
          단체 모드
        </button>
        <button
          onClick={() => setMode("individual")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
            mode === "individual"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-200 bg-white text-gray-600"
          )}
        >
          <User className="h-5 w-5" />
          개인 모드
        </button>
      </div>

      {/* Camera Visual */}
      <div className="overflow-hidden rounded-xl bg-gray-900">
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center">
            <Camera className="mx-auto h-16 w-16 text-gray-400" />
            <p className="mt-3 text-sm font-medium text-gray-400">
              카메라 준비됨
            </p>
            <button className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-700">
              <Camera className="h-5 w-5" />
              촬영하기
            </button>
          </div>
        </div>
      </div>

      {/* Student Tagging */}
      <Card
        title={
          mode === "group" ? "단체 사진 태그" : "개인 사진 태그"
        }
        subtitle="학부모에게 공유할 원생을 선택하세요"
      >
        <div className="space-y-3">
          {mode === "group" && (
            <button
              onClick={selectAll}
              className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-blue-600"
            >
              <Check className="h-4 w-4" />
              {taggedStudents.length === students.length
                ? "전체 해제"
                : "전체 선택"}
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {students.map((student) => {
              const isTagged = taggedStudents.includes(student.name);
              return (
                <button
                  key={student.id}
                  onClick={() => toggleStudentTag(student.name)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
                    isTagged
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                      isTagged
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {student.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium">{student.name}</div>
                    <div className="text-[10px] text-gray-400 truncate">
                      {student.parent}
                    </div>
                  </div>
                  {isTagged && (
                    <Check className="h-4 w-4 flex-shrink-0 text-blue-600" />
                  )}
                </button>
              );
            })}
          </div>

          {taggedStudents.length > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-sm">
              <span className="text-blue-700">
                <Tag className="mr-1 inline h-4 w-4" />
                {taggedStudents.length}명 태그됨
              </span>
              <span className="text-xs text-blue-500">
                {taggedStudents
                  .map((s) => students.find((st) => st.name === s)?.parent)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700">
            <Upload className="h-4 w-4" />
            업로드 및 공유
          </button>
        </div>
      </Card>

      {/* Recent Photos */}
      <Card title="최근 촬영 사진">
        {photos.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            아직 촬영한 사진이 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              >
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={
                        photo.mode === "group" ? "info" : "default"
                      }
                    >
                      {photo.mode === "group" ? "단체" : "개인"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[10px] text-white/80">
                    {photo.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
