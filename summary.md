# Youth FC Manager — 프로젝트 분석 요약

> 분석 일자: 2026-06-02
> 저장소: `hakunamta00700/youth-fc-manager`

---

## 1. 프로젝트 개요

**유소년 축구 클럽 통합 관리 시스템** — 축구교실 대표, 코치, 학부모가 모두 사용하는 올인원 웹 관리 플랫폼. 원생 관리, 출석 체크, 회비 관리, 훈련 기록, 학부모 소통, 일정 관리, 차량 운행까지 클럽 운영 전 영역을 커버한다.

| 항목 | 내용 |
|------|------|
| 버전 | 0.1.0 |
| 라이선스 | private |
| 개발 단계 | Phase 0–6 완료, Phase 7(배포/폴리시) 진행 전 |
| 총 화면 수 | 61 screens (Admin 16 + Manager 14 + Coach 14 + Parent 14 + Common 3) |
| API Routes | 31개 엔드포인트 |
| 데이터 모델 | 14개 Prisma 모델 |

---

## 2. 기술 스택

### 실제 적용 스택 (package.json 기준)

| 계층 | 기술 | 버전 |
|------|------|------|
| **Framework** | Next.js (App Router) | ^15.2.4 |
| **Language** | TypeScript | ^5.8.3 |
| **UI** | React | ^19.0.0 |
| **Styling** | Tailwind CSS | ^4.1.4 |
| **ORM** | Prisma | ^6.5.0 |
| **Database** | SQLite (local) / Turso (production) | — |
| **DB Adapter** | @prisma/adapter-libsql + @libsql/client | ^6.5.0 / ^0.14.0 |
| **State** | Zustand | ^5.0.3 |
| **Auth** | 커스텀 JWT (base64) | — |
| **Charts** | Recharts | ^2.15.1 |
| **Icons** | lucide-react | ^0.487.0 |
| **Utility** | clsx + tailwind-merge | ^2.1.1 / ^3.0.2 |
| **Test** | Playwright | ^1.60.0 |
| **Deploy** | Vercel | — |

> **참고:** README에는 Django + PostgreSQL로 기재되어 있으나, **실제 구현은 Next.js 풀스택 + SQLite/Turso**로 전환되었음.

---

## 3. 프로젝트 구조

```
youth-fc-manager/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (ko, antialiased)
│   │   ├── page.tsx                  # 랜딩 페이지 (로그인/회원가입 링크)
│   │   ├── globals.css               # Tailwind 글로벌 스타일
│   │   ├── (auth)/                   # 인증 그룹 라우트
│   │   │   ├── layout.tsx            # Auth 레이아웃 (중앙 카드)
│   │   │   ├── login/                # 로그인
│   │   │   ├── register/             # 회원가입
│   │   │   └── reset-password/       # 비밀번호 재설정
│   │   ├── (dashboard)/              # 대시보드 그룹 라우트
│   │   │   ├── layout.tsx            # Dashboard 레이아웃 (인증 가드)
│   │   │   ├── admin/                # 대표(Admin) 14+ 페이지
│   │   │   ├── manager/              # 매니저 13+ 페이지
│   │   │   ├── coach/                # 코치 9+ 페이지
│   │   │   └── parent/               # 학부모 12+ 페이지
│   │   └── api/                      # REST API (31 routes)
│   │       ├── auth/                 # 로그인, me
│   │       ├── members/              # 원생 CRUD
│   │       ├── groups/               # 반 CRUD
│   │       ├── coaches/              # 코치 CRUD
│   │       ├── attendance/           # 출석 + 통계 + 알림
│   │       ├── payments/             # 회비 + 미납관리
│   │       ├── training/             # 훈련기록 CRUD
│   │       ├── notifications/        # 공지 CRUD
│   │       ├── schedules/            # 일정 CRUD
│   │       ├── inquiries/            # 상담 CRUD
│   │       ├── albums/               # 앨범 CRUD
│   │       ├── messages/             # 메시지 + 읽음
│   │       ├── handovers/            # 인수인계 CRUD
│   │       ├── club/                 # 클럽 정보
│   │       └── upload/               # 파일 업로드
│   ├── components/
│   │   ├── layout/                   # 레이아웃 컴포넌트
│   │   │   ├── DashboardShell.tsx    # 대시보드 쉘
│   │   │   ├── Sidebar.tsx           # 사이드바
│   │   │   ├── Topbar.tsx            # 상단바
│   │   │   └── MobileNav.tsx         # 모바일 하단 네비
│   │   └── ui/                       # 공통 UI 컴포넌트 (9개)
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── DataTable.tsx
│   │       ├── FilterBar.tsx
│   │       ├── Modal.tsx
│   │       ├── QuickActions.tsx
│   │       ├── SearchInput.tsx
│   │       ├── StatCard.tsx
│   │       └── Tabs.tsx
│   └── lib/
│       ├── auth.ts                   # 커스텀 인증 (JWT 모방)
│       ├── api-auth.ts               # API 인증 미들웨어
│       ├── prisma.ts                 # 로컬 SQLite Prisma Client
│       ├── prisma.turso.ts           # Turso Prisma Client (production)
│       └── utils.ts                  # 유틸리티
├── prisma/
│   ├── schema.prisma                 # 14개 모델 스키마
│   └── seed.ts                       # 시드 데이터
├── docs/                             # 요구사항/설계 문서
│   ├── requirements.md
│   ├── data-model.md
│   ├── user-stories.md
│   ├── screen-list.md
│   ├── index.md
│   └── _config.yml
├── screens/                          # 61개 화면 HTML 목업
├── scripts/
│   └── agent-orchestrator/           # 에이전트 오케스트레이션 스크립트
├── tests/
│   ├── api/api-routes.spec.ts        # API 테스트
│   └── e2e/pages.spec.ts            # E2E 테스트
├── .github/                          # Issue/PR 템플릿
├── plan.md                           # 개발 계획서
├── vercel.json                       # Vercel 배포 설정
├── playwright.config.ts              # Playwright 테스트 설정
├── next.config.ts                    # Next.js 설정
├── tsconfig.json                     # TypeScript 설정
└── package.json
```

---

## 4. 데이터 모델

14개 Prisma 모델, SQLite provider 기반:

```
Club ─┬─ 1:N → Member ─┬─ 1:N → Attendance
      │                 ├─ 1:N → Payment
      │                 ├─ 1:N → TrainingRecord
      │                 ├─ 1:N → Inquiry
      │                 └─ 1:N → Message (sender)
      ├─ 1:N → Coach ──┬─ 1:N → AttendanceAlert
      │                 ├─ 1:N → Message (receiver)
      │                 ├─ 1:N → Handover (from)
      │                 └─ 1:N → Handover (to)
      ├─ 1:N → Group ──┬─ 1:N → Member
      │                 ├─ 1:N → Coach
      │                 └─ 1:N → Schedule
      └─ 1:N → Album

Notification (독립, clubId 선택적)
```

| # | 모델 | 용도 | 주요 필드 |
|---|------|------|-----------|
| 1 | Club | 클럽 정보 | name, phone, email, address, logo |
| 2 | Member | 원생/학생 | name, birthDate, gender, status(active/paused/dropped), group 관계 |
| 3 | Group | 반(유치부/초등부/선수반) | name, category, maxCapacity, color |
| 4 | Coach | 코치 | name, role, specialty, status, group 관계 |
| 5 | Attendance | 출석 | date, status, checkIn/Out, note |
| 6 | AttendanceAlert | 출석 알림 | type, sentAt, status, method |
| 7 | Payment | 회비 납부 | amount, month, dueDate, paidAt, status, refundedAmount |
| 8 | TrainingRecord | 훈련 평가 | dribbling~attitude 8개 항목(1~5), coachNote |
| 9 | Notification | 공지/알림 | title, content, category, target, pinned |
| 10 | Schedule | 일정 | title, startTime/endTime, type, location |
| 11 | Inquiry | 상담/문의 | type, content, status, contactedAt |
| 12 | Album | 앨범 | title, images(JSON), tags |
| 13 | Message | 1:1 메시지 | sender(Member)→receiver(Coach), read, readAt |
| 14 | Handover | 인수인계 노트 | fromCoach→toCoach, priority |

---

## 5. 역할별 화면 구성

### 5.1 공통 (3 screens)
- `/login` — 로그인
- `/register` — 회원가입
- `/reset-password` — 비밀번호 재설정

### 5.2 Admin / 대표 (16 screens)
| Route | 화면명 |
|-------|--------|
| `/admin` | 운영 대시보드 |
| `/admin/students` | 원생 목록 |
| `/admin/students/[id]` | 원생 상세 |
| `/admin/students/new` | 원생 등록 |
| `/admin/class-assignment` | 반 배정 관리 |
| `/admin/student-status` | 원생 상태 관리 |
| `/admin/fee-status` | 회비 현황 |
| `/admin/fees` | 회비 관리 |
| `/admin/notices` | 공지사항 목록 |
| `/admin/notices/new` | 공지사항 작성 |
| `/admin/reports` | 리포트 생성/발송 |
| `/admin/trials` | 체험수업 신청 |
| `/admin/coaches` | 코치 목록 |
| `/admin/coaches/new` | 코치 등록 |
| `/admin/weather-cancel` | 우천/취소 공지 |
| `/admin/settings` | 권한/설정 |
| `/admin/attendance-stats` | 출석 통계 |
| `/admin/classes` | 반 관리 |

### 5.3 Manager / 매니저 (14 screens)
| Route | 화면명 |
|-------|--------|
| `/manager` | 회계 대시보드 |
| `/manager/monthly` | 월별 결산 |
| `/manager/overdue` | 미납 회원 |
| `/manager/transactions` | 거래 내역 |
| `/manager/salary` | 급여 정산 |
| `/manager/statistics` | 통계 리포트 |
| `/manager/students` | 원생 목록 |
| `/manager/students/[id]/edit` | 원생 정보 수정 |
| `/manager/dropout` | 퇴원 처리 |
| `/manager/register-convert` | 신규 등록 전환 |
| `/manager/counseling` | 상담 기록 |
| `/manager/refund` | 환불 처리 |
| `/manager/albums` | 앨범 관리 |
| `/manager/vehicles` | 차량 운행 |

### 5.4 Coach / 코치 (14 screens)
| Route | 화면명 |
|-------|--------|
| `/coach` | 코치 홈 |
| `/coach/schedule` | 시간표 |
| `/coach/attendance` | 출석 체크 |
| `/coach/attendance/alerts` | 알림 현황 |
| `/coach/training/log` | 훈련 일지 |
| `/coach/training/evaluate` | 훈련 평가 |
| `/coach/training/growth` | 성장 그래프 |
| `/coach/training/reports` | 성장 리포트 |
| `/coach/photos` | 사진 공유 |
| `/coach/handover` | 인수인계 목록 |
| `/coach/handover/new` | 인수인계 작성 |
| `/coach/messages` | 1:1 메시지 |
| `/coach/board` | 내부 게시판 |
| `/coach/students` | 원생 조회 |

### 5.5 Parent / 학부모 (14 screens)
| Route | 화면명 |
|-------|--------|
| `/parent` | 학부모 홈 |
| `/parent/attendance` | 출석 현황 |
| `/parent/attendance/request` | 결석/조퇴 신청 |
| `/parent/fees` | 회비 관리 |
| `/parent/reports` | 성장 리포트 |
| `/parent/gallery` | 훈련 갤러리 |
| `/parent/notices` | 공지사항 |
| `/parent/notices/[id]` | 공지 상세 |
| `/parent/messages` | 1:1 코치 채팅 |
| `/parent/certificates` | 증명서 발급 |
| `/parent/calendar` | 통합 캘린더 |
| `/parent/competitions/[id]` | 대회 일정 |
| `/parent/vehicle` | 차량 위치 |
| `/parent/settings` | 내 정보/설정 |

---

## 6. API 구조

31개 RESTful API 엔드포인트 — Next.js Route Handlers 기반:

| 리소스 | 엔드포인트 | 메서드 |
|--------|-----------|--------|
| Auth | `/api/auth/login`, `/api/auth/me` | POST, GET |
| Members | `/api/members`, `/api/members/[id]` | GET/POST, GET/PUT/DELETE |
| Groups | `/api/groups`, `/api/groups/[id]` | GET/POST, GET/PUT/DELETE |
| Coaches | `/api/coaches`, `/api/coaches/[id]` | GET/POST, GET/PUT/DELETE |
| Attendance | `/api/attendance`, `/api/attendance/[id]`, `/api/attendance/stats`, `/api/attendance/alerts` | GET/POST, PUT, GET, GET/POST |
| Payments | `/api/payments`, `/api/payments/[id]`, `/api/payments/overdue` | GET/POST, GET/PUT, GET |
| Training | `/api/training`, `/api/training/[id]` | GET/POST, GET/PUT/DELETE |
| Notifications | `/api/notifications`, `/api/notifications/[id]` | GET/POST, GET/PUT/DELETE |
| Schedules | `/api/schedules`, `/api/schedules/[id]` | GET/POST, GET/PUT/DELETE |
| Inquiries | `/api/inquiries`, `/api/inquiries/[id]` | GET/POST, GET/PUT/DELETE |
| Albums | `/api/albums`, `/api/albums/[id]` | GET/POST, GET/PUT/DELETE |
| Messages | `/api/messages`, `/api/messages/[id]/read` | GET/POST, PUT |
| Handovers | `/api/handovers`, `/api/handovers/[id]` | GET/POST, GET/PUT/DELETE |
| Club | `/api/club` | GET/PUT |
| Upload | `/api/upload` | POST |

모든 API는 `requireAuth()` + `requireRole()` 미들웨어로 인증/권한 검사를 수행한다.

---

## 7. 인증 시스템

- **방식:** 커스텀 JWT 모방 (base64 인코딩, HMAC 미적용)
- **토큰 저장:** 쿠키 (`auth_token`)
- **만료:** 24시간
- **역할:** admin / manager / coach / parent (4종)
- **현재 상태:** Mock 사용자 4명으로 하드코딩

| 역할 | 이메일 | 비밀번호 |
|------|--------|---------|
| admin | admin@youthfc.com | admin1234 |
| manager | manager@youthfc.com | manager1234 |
| coach | coach@youthfc.com | coach1234 |
| parent | parent@youthfc.com | parent1234 |

> **주의:** 프로덕션 배포 전 실제 DB 연동 + 암호화 서명 JWT로 교체 필요.

---

## 8. 데이터베이스 아키텍처

### 개발/프로덕션 이원화

| 환경 | DB | Prisma Client | 파일 |
|------|-----|---------------|------|
| Local | SQLite (`file:./dev.db`) | `lib/prisma.ts` | 기본 PrismaClient |
| Production | Turso (libSQL) | `lib/prisma.turso.ts` | PrismaLibSQL Adapter |

### Vercel 빌드 설정
```json
{
  "buildCommand": "npx prisma generate && npx prisma db push --skip-generate && next build",
  "serverExternalPackages": ["@libsql/client", "@prisma/adapter-libsql"]
}
```

---

## 9. 테스트

| 유형 | 프레임워크 | 위치 | 파일 |
|------|-----------|------|------|
| API | Playwright | `tests/api/` | `api-routes.spec.ts`, `helpers.ts` |
| E2E | Playwright | `tests/e2e/` | `pages.spec.ts` |

Playwright 설정: `fullyParallel: false`, `workers: 1`, 스크린샷은 실패 시만 캡처.

---

## 10. 개발 진행 현황

```
Phase 0: Plan & Setup       [■■■■■■■■■■] 100% ✅
Phase 1: Core Framework      [■■■■■■■■■■] 100% ✅
Phase 2: Admin Pages (16)    [■■■■■■■■■■] 100% ✅
Phase 3: Manager Pages (14)  [■■■■■■■■■■] 100% ✅
Phase 4: Coach Pages (14)    [■■■■■■■■■■] 100% ✅
Phase 5: Parent Pages (14)   [■■■■■■■■■■] 100% ✅
Phase 6: API & Integration   [■■■■■■■■■■] 100% ✅
Phase 7: Polish & Deploy     [□□□□□□□□□□]   0% ⏳
```

### Phase 7 잔여 작업
- [ ] 전체 화면 워킹 스모크 테스트
- [ ] Prisma migration 최종 적용
- [ ] Vercel 배포 설정 완료
- [ ] README.md 업데이트 (실제 스택 반영)
- [ ] 사용자 매뉴얼 작성
- [ ] 인증 시스템 프로덕션급 교체

---

## 11. 리스크 & 개선 권장사항

| 우선순위 | 항목 | 현황 | 권장 |
|----------|------|------|------|
| **P0** | 인증 보안 | base64 인코딩만, 서명 없음 | JWT 라이브러리(jsonwebtoken) 도입 + HMAC 서명 |
| **P0** | 사용자 DB | Mock 하드코딩 4명 | Member/Coach 모델과 연동된 실제 사용자 관리 |
| **P1** | README 불일치 | Django + PostgreSQL로 기재 | Next.js + SQLite/Turso로 정정 |
| **P1** | 환경변수 관리 | .env 미확인 | .env.example 추가 + TURSO_DATABASE_URL, TURSO_AUTH_TOKEN 명시 |
| **P2** | 테스트 커버리지 | API 1개, E2E 1개 파일 | 각 API 엔드포인트별 테스트 추가 |
| **P2** | 에러 핸들링 | API 표준화는 되어 있으나 클라이언트 측 보완 필요 | toast/notification + error boundary |
| **P3** | 이미지 스토리지 | upload route 존재하나 S3 미연동 | Vercel Blob 또는 S3 연동 |
| **P3** | 푸시 알림 | 카카오톡 알림톡/Push 미구현 | Phase 7+ 에서 추가 |

---

## 12. 파일 통계

| 카테고리 | 수량 |
|----------|------|
| 페이지 컴포넌트 (.tsx) | 80 |
| API Routes | 31 |
| UI 컴포넌트 | 9 |
| 레이아웃 컴포넌트 | 4 |
| Lib 유틸리티 | 5 |
| Prisma 모델 | 14 |
| 테스트 파일 | 3 |
| 문서 파일 | 6 |
| **총 소스 파일** | **~148** |
