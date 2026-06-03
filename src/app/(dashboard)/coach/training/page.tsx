import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Dumbbell,
  FileText,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function CoachTrainingPage() {
  const todaySessions = [
    {
      team: "유치부 A",
      time: "09:00",
      focus: "기초 드리블",
      status: "기록 대기",
      attendance: "10/12",
    },
    {
      team: "초등부 B",
      time: "16:30",
      focus: "패스 전개",
      status: "예정",
      attendance: "14/16",
    },
  ];

  const trainingActions = [
    {
      title: "훈련 일지",
      description: "반별 훈련 내용, 강도, 키워드와 학생별 간단 평가를 기록합니다.",
      href: "/coach/training/log",
      icon: FileText,
      accent: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "훈련 평가",
      description: "드리블, 패스, 슈팅, 수비, 태도를 학생별로 점수화합니다.",
      href: "/coach/training/evaluate",
      icon: Star,
      accent: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "성장 그래프",
      description: "기간별 성장 추이와 항목별 변화폭을 한눈에 확인합니다.",
      href: "/coach/training/growth",
      icon: TrendingUp,
      accent: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "성장 리포트",
      description: "학부모 공유용 월간 리포트를 확인하고 PDF로 저장합니다.",
      href: "/coach/training/reports",
      icon: ClipboardList,
      accent: "text-violet-600",
      bg: "bg-violet-50",
    },
  ];

  const recentLogs = [
    {
      date: "2026-06-02",
      team: "유치부 A",
      focus: "볼 컨트롤",
      score: "4.1",
    },
    {
      date: "2026-06-01",
      team: "초등부 B",
      focus: "미니 게임",
      score: "3.8",
    },
    {
      date: "2026-05-30",
      team: "유치부 B",
      focus: "패스 정확도",
      score: "4.0",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">훈련 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            훈련 기록, 평가, 성장 추이, 리포트를 한 곳에서 관리합니다.
          </p>
        </div>
        <Link
          href="/coach/training/log"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <FileText className="h-4 w-4" />
          일지 작성
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">이번 주 훈련</p>
              <p className="text-xl font-bold text-gray-900">8회</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">평가 완료</p>
              <p className="text-xl font-bold text-gray-900">34명</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">평균 점수</p>
              <p className="text-xl font-bold text-gray-900">4.0</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">리포트 대기</p>
              <p className="text-xl font-bold text-gray-900">5건</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {trainingActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link key={action.href} href={action.href}>
                  <Card hoverable className="h-full">
                    <div className="flex h-full flex-col justify-between gap-5">
                      <div>
                        <div
                          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg ${action.bg} ${action.accent}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {action.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                          {action.description}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
                        바로가기
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          <Card title="최근 훈련 기록">
            <div className="divide-y divide-gray-100">
              {recentLogs.map((log) => (
                <div
                  key={`${log.date}-${log.team}`}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {log.team}
                      </p>
                      <Badge variant="info">{log.focus}</Badge>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {log.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">평균</p>
                    <p className="text-sm font-bold text-gray-900">
                      {log.score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card title="오늘 훈련 일정" subtitle="기록이 필요한 수업">
          <div className="space-y-3">
            {todaySessions.map((session) => (
              <div
                key={`${session.team}-${session.time}`}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {session.team}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {session.time} · {session.focus}
                    </p>
                  </div>
                  <Badge
                    variant={
                      session.status === "기록 대기" ? "warning" : "default"
                    }
                  >
                    {session.status}
                  </Badge>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    출석 {session.attendance}
                  </span>
                  <Link
                    href="/coach/training/log"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    기록하기
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
