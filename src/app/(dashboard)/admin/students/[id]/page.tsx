"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, Star, DollarSign, Phone, MapPin, AlertTriangle, Download } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { Tabs } from "@/components/ui/Tabs";

export default function StudentDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("basic");

  const student = {
    id: params.id as string,
    name: "김민재",
    age: "7세",
    birthYear: "2019년생",
    className: "유치부 A",
    regDate: "2025-03-15",
    status: "수강중" as const,
    parent: "김철수 (부)",
    phone: "010-1234-5678",
    emergencyPhone: "010-9876-5432 (모)",
    address: "서울시 강남구 역삼동",
    notes: "천식 있음, 격한 운동 시 주의",
    attendance: 95,
    avgScore: 4.2,
    paymentStatus: "완납" as const,
  };

  const tabs = [
    { id: "basic", label: "기본정보" },
    { id: "attendance", label: "출석" },
    { id: "eval", label: "훈련평가" },
    { id: "payment", label: "납부내역" },
  ];

  const attendanceData = [
    { date: "2025-06-01", status: "출석" },
    { date: "2025-05-29", status: "출석" },
    { date: "2025-05-27", status: "결석" },
    { date: "2025-05-25", status: "출석" },
    { date: "2025-05-22", status: "출석" },
    { date: "2025-05-20", status: "지각" },
  ];

  const evalData = [
    { date: "2025-05-30", category: "드리블", score: 4.5, coach: "박코치" },
    { date: "2025-05-23", category: "패스", score: 4.0, coach: "박코치" },
    { date: "2025-05-16", category: "슈팅", score: 4.2, coach: "이코치" },
    { date: "2025-05-09", category: "수비", score: 3.8, coach: "박코치" },
  ];

  const paymentData = [
    { date: "2025-06-01", amount: "₩150,000", method: "카드", status: "완납" as const },
    { date: "2025-05-01", amount: "₩150,000", method: "계좌이체", status: "완납" as const },
    { date: "2025-04-01", amount: "₩150,000", method: "카드", status: "완납" as const },
    { date: "2025-03-01", amount: "₩200,000", method: "현금", status: "완납" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/students"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            원생 상세 - {student.name}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            원생 정보를 상세히 조회하고 관리합니다
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
              {student.name[0]}
            </div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">{student.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {student.age} ({student.birthYear}) · {student.className}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              등록일: {student.regDate}
            </p>
            <div className="mt-3">
              <Badge variant="success">{student.status}</Badge>
            </div>
            <hr className="my-4 w-full border-gray-100" />
            <div className="grid w-full grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-400">출석률</p>
                <p className="text-lg font-bold text-green-600">{student.attendance}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">훈련평가</p>
                <p className="text-lg font-bold text-blue-600">{student.avgScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">납부상태</p>
                <p className="text-lg font-bold text-green-600">{student.paymentStatus}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {/* 기본정보 Tab */}
            {activeTab === "basic" && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-gray-400">보호자</p>
                    <p className="font-medium text-gray-900">{student.parent}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">연락처</p>
                    <p className="font-medium text-gray-900">{student.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">비상연락처</p>
                    <p className="font-medium text-gray-900">{student.emergencyPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">주소</p>
                    <p className="font-medium text-gray-900">{student.address}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400">특이사항</p>
                  <p className="font-medium text-amber-700">{student.notes}</p>
                </div>
              </div>
            )}

            {/* 출석 Tab */}
            {activeTab === "attendance" && (
              <div className="mt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard title="이번 달 출석률" value="92%" trend="up" trendValue="3% 증가" color="#059669" />
                  <StatCard title="총 출석일" value="18일" subtitle="이번 달 20일 중" color="#2563eb" />
                  <StatCard title="지각/결석" value="2회" subtitle="지각 1, 결석 1" color="#f59e0b" />
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                        <th className="px-3 py-3">날짜</th>
                        <th className="px-3 py-3">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-900">{row.date}</td>
                          <td className="px-3 py-3">
                            <Badge
                              variant={
                                row.status === "출석"
                                  ? "success"
                                  : row.status === "지각"
                                    ? "warning"
                                    : "danger"
                              }
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 훈련평가 Tab */}
            {activeTab === "eval" && (
              <div className="mt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard title="평균 평점" value="4.2" subtitle="최근 4회 기준" color="#2563eb" />
                  <StatCard title="최고 평점" value="4.5" subtitle="드리블 (5/30)" color="#059669" />
                  <StatCard title="평가 횟수" value="12회" subtitle="이번 달" color="#8b5cf6" />
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                        <th className="px-3 py-3">날짜</th>
                        <th className="px-3 py-3">항목</th>
                        <th className="px-3 py-3">평점</th>
                        <th className="px-3 py-3">코치</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evalData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-900">{row.date}</td>
                          <td className="px-3 py-3 text-gray-700">{row.category}</td>
                          <td className="px-3 py-3">
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                              {row.score} <Star className="h-3 w-3 fill-blue-600" />
                            </span>
                          </td>
                          <td className="px-3 py-3 text-gray-600">{row.coach}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 납부내역 Tab */}
            {activeTab === "payment" && (
              <div className="mt-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard title="총 납부액" value="₩650,000" subtitle="3월~6월" color="#059669" />
                  <StatCard title="이번 달 회비" value="₩150,000" subtitle="납부 완료" color="#2563eb" />
                  <StatCard title="미납" value="₩0" subtitle="정상" color="#059669" />
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-semibold uppercase text-gray-500">
                        <th className="px-3 py-3">납부일</th>
                        <th className="px-3 py-3">금액</th>
                        <th className="px-3 py-3">방법</th>
                        <th className="px-3 py-3">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                          <td className="px-3 py-3 text-gray-900">{row.date}</td>
                          <td className="px-3 py-3 font-medium text-gray-900">{row.amount}</td>
                          <td className="px-3 py-3 text-gray-600">{row.method}</td>
                          <td className="px-3 py-3">
                            <Badge variant="success" size="sm">
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
