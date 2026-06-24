# 📋 Youth FC Manager — Next.js 개발 계획

> **프로젝트:** youth-fc-manager  
> **기술 스택:** Next.js 15 (App Router) + TypeScript + Tailwind CSS + Prisma ORM + Turso (SQLite)  
> **GitHub:** `hakunamta00700/youth-fc-manager`  
> **총 화면:** 61 screens (Admin 16 + Manager 14 + Coach 14 + Parent 14 + Common 3)

---

## 📊 전체 진행 현황

```
Phase 0: Plan & Setup         [■■■■■■■■■■] 100% ✅
Phase 1: Core Framework       [■■■■■■■■■■] 100% ✅
Phase 2: Admin Pages (16)     [■■■■■■■■■■] 100% ✅
Phase 3: Manager Pages (14)   [■■■■■■■■■■] 100% ✅
Phase 4: Coach Pages (14)     [■■■■■■■■■■] 100% ✅
Phase 5: Parent Pages (14)    [■■■■■■■■■■] 100% ✅
Phase 6: API & Integration    [■■■■■■■■■■] 100% ✅
Phase 7: Polish & Deploy      [□□□□□□□□□□]   0%
```

**완료:** Phase 0-6 전체 완료 (프로젝트 초기화 ~ 61개 화면 ~ 31개 API Routes)  
**진행중:** Phase 7 — Deploy & Polish  
**다음:** Phase 7 — 배포, 스모크 테스트, README

---

## Phase 0: ✅ 프로젝트 분석 및 준비 (완료)

- [x] 기존 문서 분석 (`docs/` — requirements.md, data-model.md, user-stories.md, screen-list.md)
- [x] 기존 화면 HTML 분석 (`docs/screens/` — 61개 화면)
- [x] Turso + Prisma 연동 문서 확인
- [x] 기술 스택 확정 (Next.js 14, App Router, Prisma, Turso, Tailwind)
- [x] GitHub 저장소 확인 (hakunamta00700/youth-fc-manager)

---

## Phase 1: ⚙️ 코어 프레임워크 구축 (~70 files)

### 1.1 Next.js 프로젝트 초기화
- `create-next-app` with TypeScript, Tailwind, App Router
- ESLint, Turbopack 설정

### 1.2 의존성 설치
```json
{
  "@prisma/client": "latest",
  "@prisma/adapter-libsql": "latest",
  "@libsql/client": "latest",
  "next": "^15",
  "react": "^19",
  "lucide-react": "icons",
  "zustand": "state management (optional)",
  "next-auth": "^5 (beta) or iron-session"
}
```

### 1.3 Prisma 스키마 + Turso 연동
- `prisma/schema.prisma` — 11개 모델 (Club, Member, Group, Coach, Attendance, Payment, TrainingRecord, Notification, Schedule, Inquiry, Album)
- `lib/prisma.ts` — Prisma Client with Turso adapter
- `.env` — `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`
- Migration: 로컬 SQLite → Turso CLI push

**데이터 모델 (11개):**
| # | 모델 | 설명 | 화면 연결 |
|---|------|------|-----------|
| 1 | `Club` | 클럽 정보 | 설정 |
| 2 | `Member` | 원생 (학생) | 원생 관리 전반 |
| 3 | `Group` | 반 (유치부/초등부/선수반) | 반 배정 |
| 4 | `Coach` | 코치 | 코치 관리 |
| 5 | `Attendance` | 출석 | 출석 체크/통계 |
| 6 | `Payment` | 회비 납부 | 회비 관리 |
| 7 | `TrainingRecord` | 훈련 평가 | 훈련 기록/리포트 |
| 8 | `Notification` | 공지/알림 | 공지사항 |
| 9 | `Schedule` | 일정 | 캘린더/시간표 |
| 10 | `Inquiry` | 상담/문의 | 체험수업/상담 |
| 11 | `Album` | 앨범 | 갤러리 |

### 1.4 공통 레이아웃
- `app/layout.tsx` — RootLayout (pretendard font, metadata)
- `app/(dashboard)/layout.tsx` — Dashboard layout (sidebar + topbar + content)
- `app/(auth)/layout.tsx` — Auth layout (centered card)
- `components/layout/Sidebar.tsx` — 역할별 사이드바 네비게이션
- `components/layout/Topbar.tsx` — 상단바 (사용자 정보, 알림)
- `components/layout/MobileBottomNav.tsx` — 모바일 하단 네비게이션

### 1.5 공통 UI 컴포넌트
- `components/ui/StatCard.tsx` — 통계 카드
- `components/ui/DataTable.tsx` — 데이터 테이블 (정렬/필터/페이징)
- `components/ui/SearchInput.tsx` — 검색 입력
- `components/ui/FilterBar.tsx` — 필터 바
- `components/ui/Modal.tsx` — 모달
- `components/ui/Card.tsx` — 기본 카드
- `components/ui/Badge.tsx` — 상태 배지
- `components/ui/QuickActions.tsx` — 퀵 액션 버튼 그룹
- `components/ui/GrowthChart.tsx` — 성장 그래프 (recharts/chart.js)
- `components/ui/RadarChart.tsx` — 레이더 차트

### 1.6 인증 시스템
- `app/api/auth/[...nextauth]/route.ts` — NextAuth v5
- `lib/auth.ts` — Auth configuration
- `middleware.ts` — Route protection
- `components/auth/LoginForm.tsx`
- `components/auth/RegisterForm.tsx`
- `components/auth/ResetPasswordForm.tsx`

### 1.7 공통 화면 (3 screens)
- `/login` — 로그인 (C01)
- `/reset-password` — 비밀번호 재설정 (C02)
- `/register` — 계정 생성 (C03)

---

## Phase 2: 👑 대표(Admin) 페이지 — 16 screens

| ID | Route | 화면명 | 설명 | 상태 |
|:--:|-------|--------|------|:----:|
| A01 | `/admin` | 운영 대시보드 | 오늘 수업, 체험신청, 회비현황, 퀵액션 | □ |
| A02 | `/admin/students` | 원생 목록 | 검색/필터, 리스트/카드형 전환 | □ |
| A03 | `/admin/students/[id]` | 원생 상세 | 기본정보+탭(출석/평가/납부) | □ |
| A04 | `/admin/students/new` | 원생 등록 | 단계별 입력폼 | □ |
| A05 | `/admin/class-assignment` | 반 배정 관리 | Drag & Drop, 이동이력 | □ |
| A06 | `/admin/student-status` | 원생 상태 관리 | 수강중/일시정지/퇴원 전환 | □ |
| A07 | `/admin/fee-status` | 회비 현황 | 월별 수입/미납, 목표 달성률 | □ |
| A08 | `/admin/notices/new` | 공지사항 작성 | WYSIWYG, 대상선택, 예약발송 | □ |
| A09 | `/admin/notices` | 공지사항 목록 | 읽음률, 미확인자, 재전송 | □ |
| A10 | `/admin/reports` | 리포트 생성/발송 | 대상/항목선택 → 생성 → 발송 | □ |
| A11 | `/admin/trials` | 체험수업 신청 목록 | 카드형, 상태관리, 연락하기 | □ |
| A12 | `/admin/coaches` | 코치 목록 | 프로필 카드, 담당반, 상태 | □ |
| A13 | `/admin/coaches/new` | 코치 등록 | 3단계 가이드 | □ |
| A14 | `/admin/weather-cancel` | 우천/취소 공지 | 템플릿, 일괄발송, 보강연동 | □ |
| A15 | `/admin/settings` | 권한/설정 | 역할별 권한, 감사로그 | □ |
| A16 | `/admin/attendance-stats` | 출석 통계 | 월별 집계, 60%미만 필터 | □ |

---

## Phase 3: 📊 매니저(Manager) 페이지 — 14 screens

| ID | Route | 화면명 | 설명 | 상태 |
|:--:|-------|--------|------|:----:|
| M01 | `/manager` | 회계 대시보드 | 월별 수입/지출, 도넛차트 | □ |
| M02 | `/manager/monthly` | 월별 결산 상세 | 항목별 상세, 추이그래프, 내보내기 | □ |
| M03 | `/manager/overdue` | 미납 회원 관리 | 연체일 정렬, 차등관리, 문자발송 | □ |
| M04 | `/manager/transactions` | 거래 내역 | 필터, XLSX/CSV 내보내기 | □ |
| M05 | `/manager/salary` | 급여 정산 | 자동계산, 출석연동, 명세서 | □ |
| M06 | `/manager/statistics` | 통계 리포트 | 차트시각화, PDF/PPT | □ |
| M07 | `/manager/students` | 원생 목록(테이블) | 정렬/필터/일괄선택 | □ |
| M08 | `/manager/students/[id]/edit` | 원생 정보 수정 | 개별/일괄 변경 | □ |
| M09 | `/manager/dropout` | 퇴원 처리 | 사유입력, 환불확인 | □ |
| M10 | `/manager/register-convert` | 신규 등록 전환 | 체험정보 자동채움 | □ |
| M11 | `/manager/counseling` | 상담 기록 관리 | 유형별 등록, 이력조회 | □ |
| M12 | `/manager/refund` | 환불 처리 | 자동산출, 승인 | □ |
| M13 | `/manager/albums` | 앨범 관리 | 생성/업로드/정렬 | □ |
| M14 | `/manager/vehicles` | 차량 운행 관리 | 노선/탑승/운행기록 | □ |

---

## Phase 4: 🏋️ 코치(Coach) 페이지 — 14 screens

| ID | Route | 화면명 | 설명 | 상태 |
|:--:|-------|--------|------|:----:|
| T01 | `/coach` | 코치 홈(내 일정) | 오늘 시간표, 알림설정 | □ |
| T02 | `/coach/schedule` | 개인 시간표 | 주간/월간 캘린더 | □ |
| T03 | `/coach/attendance` | 출석 체크 | 카드형 목록, 탭→출석 | □ |
| T04 | `/coach/attendance/alerts` | 알림 현황 | 발송상태, 미확인 전화 | □ |
| T05 | `/coach/training/log` | 훈련 일지 작성 | 키워드 메모, 공개범위 | □ |
| T06 | `/coach/training/evaluate` | 훈련 평가 입력 | 항목별 별점(1~5) | □ |
| T07 | `/coach/training/growth` | 성장 그래프 조회 | 레이더+시계열, 반평균비교 | □ |
| T08 | `/coach/training/reports` | 성장 리포트 조회 | 월간 리포트 열람 | □ |
| T09 | `/coach/photos` | 사진 촬영/공유 | 카메라, 태그공유 | □ |
| T10 | `/coach/handover/new` | 인수인계 노트 작성 | 항목별 내용, 파일첨부 | □ |
| T11 | `/coach/handover` | 인수인계 목록 | 받은/보낸 내역 | □ |
| T12 | `/coach/messages` | 1:1 메시지(학부모) | 채팅형, 읽음확인 | □ |
| T13 | `/coach/board` | 내부 게시판 | 카테고리별, 첨부파일 | □ |
| T14 | `/coach/students` | 원생 조회(읽기전용) | 기본정보/특이사항 | □ |

---

## Phase 5: 👪 학부모(Parent) 페이지 — 14 screens

| ID | Route | 화면명 | 설명 | 상태 |
|:--:|-------|--------|------|:----:|
| P01 | `/parent` | 학부모 홈(대시보드) | 자녀정보, 출석, 회비, 공지 | □ |
| P02 | `/parent/attendance` | 출석 현황 | 오늘상태, 월간캘린더 | □ |
| P03 | `/parent/attendance/request` | 결석/조퇴 신청 | 유형선택, 사유, 제출 | □ |
| P04 | `/parent/fees` | 회비 관리 | 납부상태, 상세내역 | □ |
| P05 | `/parent/reports` | 성장 리포트 | 레이더차트, PDF저장 | □ |
| P06 | `/parent/gallery` | 훈련 갤러리 | 태그된 사진만 필터 | □ |
| P07 | `/parent/notices` | 공지사항 목록 | 최신순, 필독고정 | □ |
| P08 | `/parent/notices/[id]` | 공지사항 상세 | 본문, 첨부파일 | □ |
| P09 | `/parent/messages` | 1:1 코치 채팅 | 담당코치선택, 채팅 | □ |
| P10 | `/parent/certificates` | 증명서 발급 신청 | 선택→신청→승인→다운로드 | □ |
| P11 | `/parent/calendar` | 통합 캘린더 | 수업/대회/휴원, 필터 | □ |
| P12 | `/parent/competitions/[id]` | 대회 일정 상세 | 대진표, 결과 | □ |
| P13 | `/parent/vehicle` | 차량 위치 조회 | 지도, 정류장, 알림 | □ |
| P14 | `/parent/settings` | 내 정보/설정 | 개인정보, 알림채널 | □ |

---

## Phase 6: 🔌 API Routes & Server Actions (~50 endpoints)

### 6.1 RESTful API Routes
```
/api/auth/*          — 로그인/회원가입/토큰
/api/members/*       — 원생 CRUD + 검색/필터
/api/groups/*        — 반 CRUD + 배정
/api/coaches/*       — 코치 CRUD
/api/attendance/*    — 출석 CRUD + 통계
/api/payments/*      — 회비 CRUD + 미납관리
/api/training/*      — 훈련기록 CRUD + 리포트
/api/notifications/* — 공지 CRUD + 발송 + 읽음확인
/api/schedules/*     — 일정 CRUD
/api/inquiries/*     — 상담 CRUD
/api/albums/*        — 앨범 CRUD
```

### 6.2 Server Actions (for form submissions)
- `createStudent(formData)`, `updateAttendance(formData)`, `sendNotice(formData)` 등

### 6.3 파일 업로드
- `app/api/upload/route.ts` — 이미지/영상 업로드
- 로컬 filesystem 또는 S3 호환 스토리지

---

## Phase 7: 🚀 마무리 및 배포

- [ ] GitHub Issues 모두 완료 확인
- [ ] 전체 화면 워킹 스모크 테스트
- [ ] Prisma migration 최종 적용
- [ ] Vercel 배포 설정
- [ ] docs/README.md 업데이트
- [ ] 사용자 매뉴얼 작성

---

## 📈 GitHub 프로젝트 트래킹

GitHub Issues는 각 Phase별로 생성되며, Project Board에서 진행 상황을 추적합니다.

| 레이블 | 의미 |
|--------|------|
| `phase-1-core` | 코어 프레임워크 |
| `phase-2-admin` | 대표 페이지 |
| `phase-3-manager` | 매니저 페이지 |
| `phase-4-coach` | 코치 페이지 |
| `phase-5-parent` | 학부모 페이지 |
| `phase-6-api` | API 개발 |
| `phase-7-deploy` | 배포 |
| `bug` | 버그 수정 |
| `enhancement` | 개선 사항 |

---

## 🔧 기술 상세

### Turso + Prisma 연동
```ts
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });
```

### Prisma 스키마 (sqlite provider + driverAdapters)
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

### 마이그레이션
1. 로컬 개발: `npx prisma migrate dev --name init`
2. Turso 적용: `turso db shell <db-name> < ./prisma/migrations/.../migration.sql`

---

---

## 🔗 GitHub Issues

| Issue | Phase | 링크 |
|:-----:|-------|------|
| #1 | Phase 1 — 코어 프레임워크 | [#1](https://github.com/hakunamta00700/youth-fc-manager/issues/1) |
| #2 | Phase 2 — Admin 16 screens | [#2](https://github.com/hakunamta00700/youth-fc-manager/issues/2) |
| #3 | Phase 3 — Manager 14 screens | [#3](https://github.com/hakunamta00700/youth-fc-manager/issues/3) |
| #4 | Phase 4 — Coach 14 screens | [#4](https://github.com/hakunamta00700/youth-fc-manager/issues/4) |
| #5 | Phase 5 — Parent 14 screens | [#5](https://github.com/hakunamta00700/youth-fc-manager/issues/5) |
| #6 | Phase 6 — API Routes | [#6](https://github.com/hakunamta00700/youth-fc-manager/issues/6) |
| #7 | Phase 7 — Deploy & Polish | [#7](https://github.com/hakunamta00700/youth-fc-manager/issues/7) |

> **마지막 업데이트:** 2026-06-01  
> **작성자:** Hermes Agent  
> **다음 작업:** Phase 1.1 — Next.js 프로젝트 생성
