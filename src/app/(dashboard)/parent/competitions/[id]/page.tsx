"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Trophy,
  ChevronLeft,
  Medal,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface MatchResult {
  round: string;
  opponent: string;
  score: string;
  result: "win" | "lose" | "draw" | "upcoming";
}

interface CompetitionDetail {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  bracket: MatchResult[];
}

const competition: CompetitionDetail = {
  id: "1",
  title: "6월 유소년 축구 대회",
  date: "2026-06-15",
  time: "09:00-17:00",
  location: "종합운동장",
  organizer: "한국유소년축구연맹",
  description: "유치부 A 팀이 참가하는 6월 정기 대회입니다. 각 팀별 리그전으로 진행되며, 우승팀에게는 트로피가 수여됩니다.",
  bracket: [
    { round: "예선 1경기", opponent: "FC트윙클", score: "3-1", result: "win" },
    { round: "예선 2경기", opponent: "점프FC", score: "1-2", result: "lose" },
    { round: "예선 3경기", opponent: "스타FC", score: "2-2", result: "draw" },
    { round: "준결승", opponent: "드림FC", score: "-", result: "upcoming" },
    { round: "결승", opponent: "TBD", score: "-", result: "upcoming" },
  ],
};

const resultConfig = {
  win: { label: "승", variant: "success" as const, icon: Medal },
  lose: { label: "패", variant: "danger" as const, icon: Trophy },
  draw: { label: "무", variant: "warning" as const, icon: Trophy },
  upcoming: { label: "예정", variant: "default" as const, icon: Trophy },
};

export default function ParentCompetitionDetailPage() {
  const params = useParams();
  // In real app, fetch by params.id

  return (
    <div className="space-y-6">
      <Link
        href="/parent/calendar"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="h-4 w-4" />
        캘린더로
      </Link>

      {/* Header */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="danger" size="sm" className="mb-2">
                대회
              </Badge>
              <h1 className="text-xl font-bold text-gray-900">
                {competition.title}
              </h1>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
              <Trophy className="h-7 w-7 text-amber-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">일시</p>
                <p className="text-sm font-medium text-gray-900">
                  {competition.date}
                </p>
                <p className="text-xs text-gray-400">{competition.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">장소</p>
                <p className="text-sm font-medium text-gray-900">
                  {competition.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">주최</p>
                <p className="text-sm font-medium text-gray-900">
                  {competition.organizer}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-600">
            {competition.description}
          </p>
        </div>
      </Card>

      {/* Bracket / Match Results */}
      <Card title="대진표 및 결과">
        <div className="divide-y divide-gray-100">
          {competition.bracket.map((match, i) => {
            const cfg = resultConfig[match.result];
            const ResultIcon = cfg.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {match.round}
                    </p>
                    <p className="text-xs text-gray-500">
                      vs {match.opponent}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {match.result !== "upcoming" && (
                    <span className="text-sm font-bold text-gray-900">
                      {match.score}
                    </span>
                  )}
                  <Badge variant={cfg.variant} size="sm">
                    <span className="flex items-center gap-1">
                      <ResultIcon className="h-3 w-3" />
                      {cfg.label}
                    </span>
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* My Child's Record */}
      <Card title="내 자녀 기록">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
            김
          </div>
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-semibold text-gray-900">
              김민재 · 유치부 A
            </p>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-green-50 px-3 py-1.5 text-center">
                <p className="text-xs font-bold text-green-700">2</p>
                <p className="text-[10px] text-green-600">득점</p>
              </div>
              <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-center">
                <p className="text-xs font-bold text-blue-700">1</p>
                <p className="text-[10px] text-blue-600">어시스트</p>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-1.5 text-center">
                <p className="text-xs font-bold text-amber-700">45분</p>
                <p className="text-[10px] text-amber-600">출전</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
