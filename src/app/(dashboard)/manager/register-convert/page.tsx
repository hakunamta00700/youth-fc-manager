"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserCheck,
  ArrowRight,
  CalendarDays,
  School,
  CreditCard,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const CLASS_OPTIONS = ["유치부 A", "유치부 B", "초등저 A", "초등저 B", "초등고 A", "초등고 B", "선수반"];
const FEE_OPTIONS = [
  { class: "유치부", amount: 300000 },
  { class: "초등저", amount: 350000 },
  { class: "초등고", amount: 400000 },
  { class: "선수반", amount: 500000 },
];

interface TrialInfo {
  name: string;
  age: string;
  parentName: string;
  phone: string;
  trialDate: string;
  coach: string;
}

export default function RegisterConvertPage() {
  const router = useRouter();

  // Simulated trial data auto-filled
  const [trialInfo] = useState<TrialInfo>({
    name: "김지원",
    age: "8세",
    parentName: "김영호",
    phone: "010-9876-5432",
    trialDate: "2026-06-01",
    coach: "이코치",
  });

  const [selectedClass, setSelectedClass] = useState("");
  const [feeAmount, setFeeAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [sendWelcome, setSendWelcome] = useState(true);

  const handleClassChange = (classValue: string) => {
    setSelectedClass(classValue);
    const fee = FEE_OPTIONS.find((f) => classValue.startsWith(f.class));
    setFeeAmount(fee?.amount ?? 0);
  };

  const handleConvert = () => {
    alert(`신규 등록 전환 완료: ${trialInfo.name}님 (${selectedClass})`);
    router.push("/manager/students");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">신규 등록 전환</h2>
        <p className="mt-1 text-sm text-gray-500">
          체험 수강생을 정식 원생으로 등록 전환합니다
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Trial info (auto-filled) */}
          <Card title="체험 정보" subtitle="체험 신청 정보가 자동으로 채워집니다">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">이름</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.name}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">연령</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.age}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">보호자</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.parentName}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">연락처</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.phone}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">체험일</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.trialDate}</p>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">담당 코치</label>
                <p className="text-sm font-medium text-gray-900">{trialInfo.coach}</p>
              </div>
            </div>
          </Card>

          {/* Additional info */}
          <Card title="추가 정보 입력">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Birth date */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <CalendarDays className="mr-1 inline-block h-3.5 w-3.5" />
                    생년월일
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* School */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <School className="mr-1 inline-block h-3.5 w-3.5" />
                    학교/기관
                  </label>
                  <input
                    type="text"
                    placeholder="학교명 입력"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">주소</label>
                  <input
                    type="text"
                    placeholder="주소 입력"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Memo */}
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    <FileText className="mr-1 inline-block h-3.5 w-3.5" />
                    메모
                  </label>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="특이사항을 입력하세요"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Class & Fee */}
        <div className="space-y-6">
          <Card title="반 배정">
            <div className="space-y-3">
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">반을 선택하세요</option>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </Card>

          <Card title="회비 설정">
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  <CreditCard className="mr-1 inline-block h-3 w-3" />
                  월 회비
                </label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <p className="text-xs text-gray-400">
                선택한 반에 따라 회비가 자동 설정됩니다. 필요시 수정 가능합니다.
              </p>
            </div>
          </Card>

          <Card title="알림 설정">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="welcome"
                checked={sendWelcome}
                onChange={(e) => setSendWelcome(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="welcome" className="text-sm text-gray-700">
                환영 메시지 발송
              </label>
            </div>
          </Card>

          <button
            onClick={handleConvert}
            disabled={!selectedClass}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserCheck className="h-4 w-4" />
            등록 전환
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
