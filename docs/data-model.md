# 유소년 축구 클럽 통합 관리 시스템 — 데이터 모델

> **프로젝트:** youth-fc-manager  
> **작성일:** 2026-05-30  
> **상태:** v0.1 (초기 MVP 기준)

---

## 개요

본 문서는 유소년 축구 클럽 및 축구 교실 통합 관리 시스템의 초기 데이터 모델을 정의합니다.  
각 엔티티는 **MVP**(Minimum Viable Product)에 포함될 필드와 **추후 확장**(Future) 시 고려할 필드로 구분합니다.

---

## 1. Club (클럽)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `name` | VARCHAR(100) | 클럽명 | — | ✅ | MVP |
| `address` | TEXT | 주소 | — | — | MVP |
| `phone` | VARCHAR(20) | 대표 전화번호 | — | — | MVP |
| `email` | VARCHAR(100) | 대표 이메일 | — | — | MVP |
| `logo` | TEXT | 로고 이미지 URL | — | — | MVP |
| `business_number` | VARCHAR(20) | 사업자등록번호 | — | ✅ Future | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Club 1:N Member (하나의 클럽에 여러 원생)
- Club 1:N Group (하나의 클럽에 여러 반)
- Club 1:N Coach (하나의 클럽에 여러 코치)

---

## 2. Member (원생)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `club_id` | UUID (FK) | 소속 클럽 | Club.id | ✅ | MVP |
| `group_id` | UUID (FK, nullable) | 소속 반 | Group.id | ✅ | MVP |
| `name` | VARCHAR(50) | 이름 | — | ✅ | MVP |
| `birth_date` | DATE | 생년월일 | — | — | MVP |
| `gender` | ENUM('male','female') | 성별 | — | — | MVP |
| `grade` | VARCHAR(20) | 학년/연령 구분 (e.g. 유치부, 1학년) | — | — | MVP |
| `school` | VARCHAR(100) | 학교명 | — | — | MVP |
| `address` | TEXT | 주소 | — | — | MVP |
| `parent_name` | VARCHAR(50) | 보호자 이름 | — | ✅ | MVP |
| `parent_phone` | VARCHAR(20) | 보호자 연락처 | — | ✅ | MVP |
| `parent_email` | VARCHAR(100) | 보호자 이메일 | — | — | MVP |
| `photo` | TEXT | 원생 사진 URL | — | — | Future |
| `emergency_contact` | VARCHAR(20) | 비상 연락처 | — | — | MVP |
| `medical_notes` | TEXT | 건강/알레르기/주의사항 | — | — | MVP |
| `status` | ENUM('active','paused','dropped') | 상태 (등록/일시중단/제적) | — | ✅ | MVP |
| `joined_date` | DATE | 등록일 | — | — | MVP |
| `dropped_date` | DATE | 제적/종료일 | — | — | Future |
| `memo` | TEXT | 내부 메모 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Member N:1 Club  
- Member N:1 Group  
- Member 1:N Attendance  
- Member 1:N Payment  
- Member 1:N TrainingRecord  

---

## 3. Group (반)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `club_id` | UUID (FK) | 소속 클럽 | Club.id | ✅ | MVP |
| `coach_id` | UUID (FK, nullable) | 담당 코치 | Coach.id | ✅ | MVP |
| `name` | VARCHAR(50) | 반 이름 (유치부, 초등부A, 초등부B, 선수반 등) | — | ✅ | MVP |
| `level` | ENUM('beginner','intermediate','advanced','elite') | 레벨 구분 | — | — | MVP |
| `max_capacity` | INT | 최대 정원 | — | — | MVP |
| `description` | TEXT | 반 설명 | — | — | Future |
| `color` | VARCHAR(7) | 구분 색상 (#헥스코드) | — | — | Future |
| `is_active` | BOOLEAN | 운영 여부 | — | — | MVP |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Group N:1 Club  
- Group N:1 Coach (담당 코치)  
- Group 1:N Member  
- Group 1:N Schedule  

---

## 4. Coach (코치)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `club_id` | UUID (FK) | 소속 클럽 | Club.id | ✅ | MVP |
| `name` | VARCHAR(50) | 이름 | — | ✅ | MVP |
| `phone` | VARCHAR(20) | 전화번호 | — | ✅ | MVP |
| `email` | VARCHAR(100) | 이메일 | — | — | MVP |
| `photo` | TEXT | 프로필 사진 URL | — | — | Future |
| `career_history` | TEXT | 경력 사항 (선수 경력, 지도 경력) | — | — | MVP |
| `certifications` | JSON | 자격증 목록 (종류, 발급기관, 취득일) | — | — | MVP |
| `hire_date` | DATE | 입사일 | — | — | MVP |
| `salary_info` | JSON | 급여 정보 (기본급, 수당, 계약 형태 등) | — | — | Future |
| `status` | ENUM('active','inactive') | 재직 상태 | — | ✅ | MVP |
| `role` | ENUM('head','assistant','volunteer') | 직책 | — | — | Future |
| `specialty` | TEXT | 전문 분야 (골키퍼 지도, 체력 훈련 등) | — | — | Future |
| `memo` | TEXT | 내부 메모 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Coach N:1 Club  
- Coach 1:N Group (담당 반)  
- Coach 1:N Attendance (출석 기록자)  
- Coach 1:N TrainingRecord (평가자)  

---

## 5. Attendance (출석)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `member_id` | UUID (FK) | 원생 | Member.id | ✅ | MVP |
| `schedule_id` | UUID (FK, nullable) | 관련 일정 | Schedule.id | ✅ | Future |
| `date` | DATE | 출석일 | — | ✅ | MVP |
| `status` | ENUM('present','late','absent','early_leave') | 출석 상태 | — | ✅ | MVP |
| `check_in_time` | TIME | 도착 시간 | — | — | MVP |
| `check_out_time` | TIME | 귀가 시간 | — | — | Future |
| `note` | TEXT | 특이사항 (지각/조퇴 사유 등) | — | — | MVP |
| `recorded_by` | UUID (FK) | 기록한 코치 | Coach.id | — | MVP |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Attendance N:1 Member  
- Attendance N:1 Coach (recorded_by)  
- Attendance N:1 Schedule (optional)  

**복합 인덱스 추천:** `(member_id, date)` — 특정 원생의 날짜별 출석 조회  
**유니크 인덱스 추천:** `(member_id, date)` — 하루 1회 출석 기록 제한 (Future)

---

## 6. Payment (회비)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `member_id` | UUID (FK) | 원생 | Member.id | ✅ | MVP |
| `amount` | DECIMAL(10,2) | 금액 | — | — | MVP |
| `due_date` | DATE | 납부 기한 | — | ✅ | MVP |
| `paid_date` | DATE | 실제 납부일 | — | — | MVP |
| `status` | ENUM('pending','paid','partial','refunded') | 상태 | — | ✅ | MVP |
| `payment_method` | VARCHAR(30) | 결제 수단 (계좌이체, 카드, 현금, 간편결제 등) | — | — | MVP |
| `note` | TEXT | 비고 | — | — | MVP |
| `invoiced_by` | UUID (FK, nullable) | 청구/처리한 담당자 | Coach.id | — | MVP |
| `fee_type` | VARCHAR(30) | 회비 유형 (월회비, 특별회비, 체험비 등) | — | — | Future |
| `refund_date` | DATE | 환불일 | — | — | Future |
| `refund_reason` | TEXT | 환불 사유 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Payment N:1 Member  
- Payment N:1 Coach (invoiced_by)

**복합 인덱스 추천:** `(member_id, due_date)` — 원생별 회비 납부 내역 조회  
**복합 인덱스 추천:** `(status, due_date)` — 미납/연체 관리

---

## 7. TrainingRecord (훈련 기록 / 평가)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `member_id` | UUID (FK) | 원생 | Member.id | ✅ | MVP |
| `coach_id` | UUID (FK) | 평가한 코치 | Coach.id | ✅ | MVP |
| `date` | DATE | 훈련일 | — | ✅ | MVP |
| `dribble` | TINYINT(1) | 드리블 (1~5) | — | — | MVP |
| `pass` | TINYINT(1) | 패스 (1~5) | — | — | MVP |
| `shoot` | TINYINT(1) | 슛 (1~5) | — | — | MVP |
| `speed` | TINYINT(1) | 스피드 (1~5) | — | — | MVP |
| `stamina` | TINYINT(1) | 스태미나 (1~5) | — | — | MVP |
| `defense` | TINYINT(1) | 수비 (1~5) | — | — | Future |
| `positioning` | TINYINT(1) | 포지셔닝 (1~5) | — | — | Future |
| `attitude_score` | TINYINT(1) | 태도 점수 (1~5) | — | — | MVP |
| `coach_comment` | TEXT | 코치 코멘트 | — | — | MVP |
| `recorded_date` | TIMESTAMP | 기록 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- TrainingRecord N:1 Member  
- TrainingRecord N:1 Coach  

**복합 인덱스 추천:** `(member_id, date)` — 원생별 훈련 기록 추이  
**복합 인덱스 추천:** `(coach_id, date)` — 코치별 기록 내역

---

## 8. Notification (공지 / 알림)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `title` | VARCHAR(200) | 제목 | — | — | MVP |
| `content` | TEXT | 내용 | — | — | MVP |
| `type` | ENUM('notice','message') | 유형 (공지/개별 메시지) | — | ✅ | MVP |
| `target_type` | ENUM('all','group','individual') | 대상 범위 | — | ✅ | MVP |
| `target_group_id` | UUID (FK, nullable) | 대상 반 (target_type=group 시) | Group.id | ✅ | Future |
| `target_member_id` | UUID (FK, nullable) | 대상 원생 (target_type=individual 시) | Member.id | ✅ | Future |
| `created_by` | UUID (FK) | 작성자 | Coach.id | — | MVP |
| `sent_at` | TIMESTAMP | 발송 일시 | — | — | MVP |
| `read_by` | JSON | 읽은 원생/보호자 ID 배열 | — | — | MVP |
| `is_important` | BOOLEAN | 중요 공지 여부 | — | — | Future |
| `file_attachments` | JSON | 첨부 파일 URL 배열 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Notification N:1 Coach (created_by)  
- Notification N:1 Group (target_group_id, optional)  
- Notification N:1 Member (target_member_id, optional)

---

## 9. Schedule (일정)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `group_id` | UUID (FK) | 대상 반 | Group.id | ✅ | MVP |
| `title` | VARCHAR(200) | 일정 제목 | — | — | MVP |
| `description` | TEXT | 상세 설명 | — | — | MVP |
| `start_time` | DATETIME | 시작 시간 | — | ✅ | MVP |
| `end_time` | DATETIME | 종료 시간 | — | — | MVP |
| `recurring` | JSON | 반복 요일 배열 (e.g. ["mon","wed","fri"]) | — | — | MVP |
| `location` | VARCHAR(200) | 장소 | — | — | MVP |
| `location_type` | ENUM('training','match','event') | 장소 유형 (훈련/경기/행사) | — | ✅ | MVP |
| `status` | ENUM('scheduled','cancelled','rescheduled') | 일정 상태 | — | ✅ | MVP |
| `cancel_reason` | TEXT | 취소/변경 사유 | — | — | Future |
| `notify_before` | INT | 알림 발송 시간 (분 단위, null=미발송) | — | — | Future |
| `color` | VARCHAR(7) | 캘린더 표시 색상 | — | — | Future |
| `created_by` | UUID (FK) | 작성자 | Coach.id | — | MVP |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Schedule N:1 Group  
- Schedule 1:N Attendance (Attendance.schedule_id)

**복합 인덱스 추천:** `(group_id, start_time)` — 반별 일정 조회

---

## 10. Inquiry (상담 / 문의)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `parent_name` | VARCHAR(50) | 보호자 이름 | — | ✅ | MVP |
| `parent_phone` | VARCHAR(20) | 보호자 연락처 | — | ✅ | MVP |
| `child_name` | VARCHAR(50) | 자녀 이름 (원생) | — | — | MVP |
| `child_birth_date` | DATE | 자녀 생년월일 | — | — | Future |
| `content` | TEXT | 문의 내용 | — | — | MVP |
| `status` | ENUM('new','contacted','registered','lost') | 처리 상태 | — | ✅ | MVP |
| `trial_schedule` | DATETIME | 체험 수업 예약 일시 | — | — | MVP |
| `trial_result` | TEXT | 체험 수업 후기/결과 | — | — | Future |
| `assigned_to` | UUID (FK, nullable) | 담당자 (코치) | Coach.id | ✅ | MVP |
| `source` | VARCHAR(30) | 유입 경로 (전화/방문/홈페이지/SNS/추천) | — | — | Future |
| `memo` | TEXT | 내부 메모 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | ✅ | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Inquiry N:1 Coach (assigned_to)  
- Inquiry → Member (별도 FK 없이 child_name으로 연결, 추후 정규화 가능)

---

## 11. Album (앨범)

| 필드명 | 타입 | 설명 | 관계 | 인덱스 | MVP/Future |
|--------|------|------|------|--------|------------|
| `id` | UUID (PK) | 고유 식별자 | — | PK | MVP |
| `club_id` | UUID (FK) | 소속 클럽 | Club.id | ✅ | Future |
| `title` | VARCHAR(200) | 앨범 제목 | — | — | MVP |
| `description` | TEXT | 설명 | — | — | MVP |
| `event_date` | DATE | 행사/촬영일 | — | — | MVP |
| `images` | JSON | 이미지 URL 배열 | — | — | MVP |
| `cover_image` | TEXT | 대표 이미지 URL | — | — | Future |
| `visible_to` | ENUM('all','members','parents') | 공개 범위 | — | — | MVP |
| `created_by` | UUID (FK) | 작성자 (코치) | Coach.id | — | MVP |
| `view_count` | INT | 조회수 | — | — | Future |
| `created_at` | TIMESTAMP | 생성 일시 | — | — | MVP |
| `updated_at` | TIMESTAMP | 수정 일시 | — | — | MVP |

**Relations:**  
- Album N:1 Club  
- Album N:1 Coach (created_by)

---

## 엔티티 관계 요약 (ERD)

```
Club ──┬── Member        (1:N)
       ├── Group         (1:N)
       └── Coach         (1:N)

Group ──┬── Member       (1:N)
        ├── Schedule     (1:N)
        └── Notification (1:N, target_group)

Coach ──┬── Group        (1:N, 담당 반)
        ├── Attendance   (1:N, recorded_by)
        ├── TrainingRecord (1:N)
        ├── Payment      (1:N, invoiced_by)
        ├── Notification (1:N, created_by)
        ├── Schedule     (1:N, created_by)
        ├── Inquiry      (1:N, assigned_to)
        └── Album        (1:N, created_by)

Member ─┬── Attendance   (1:N)
        ├── Payment      (1:N)
        └── TrainingRecord (1:N)
```

---

## 인덱스 요약

| 엔티티 | 인덱스 필드 | 목적 |
|--------|-------------|------|
| Club | `name` | 클럽명 검색 |
| Member | `club_id`, `group_id`, `name`, `parent_name`, `parent_phone`, `status` | 소속/검색/필터링 |
| Group | `club_id`, `coach_id`, `name` | 소속/담당자/이름 검색 |
| Coach | `club_id`, `name`, `phone`, `status` | 소속/검색/상태 |
| Attendance | `member_id`, `date`, `status` | 출석 조회/통계 |
| Attendance (복합) | `(member_id, date)` | 특정 원생 날짜별 조회 |
| Payment | `member_id`, `due_date`, `status` | 회비 조회/연체 관리 |
| Payment (복합) | `(member_id, due_date)` | 원생별 납부 내역 |
| TrainingRecord | `member_id`, `coach_id`, `date` | 기록 조회 |
| TrainingRecord (복합) | `(member_id, date)` | 원생별 기록 추이 |
| Notification | `type`, `target_type` | 유형별 조회 |
| Schedule | `group_id`, `start_time`, `location_type`, `status` | 일정 조회 |
| Schedule (복합) | `(group_id, start_time)` | 반별 일정 |
| Inquiry | `parent_name`, `parent_phone`, `status`, `assigned_to`, `created_at` | 문의 검색/처리 |

---

## 데이터 타입 참고

| 표기 | 실제 DB 타입 | 설명 |
|------|-------------|------|
| UUID | `UUID` 또는 `CHAR(36)` | 고유 식별자 |
| VARCHAR(n) | `VARCHAR(n)` | 가변 길이 문자열 |
| TEXT | `TEXT` | 장문 문자열 (65,535 bytes) |
| ENUM(...) | `ENUM(...)` | 열거형 |
| TINYINT(1) | `TINYINT(1)` | 1~5 점수 (0~127 범위) |
| DECIMAL(10,2) | `DECIMAL(10,2)` | 소수점 포함 금액 |
| DATE | `DATE` | 날짜 (YYYY-MM-DD) |
| DATETIME | `DATETIME` | 날짜+시간 |
| TIME | `TIME` | 시간 |
| TIMESTAMP | `TIMESTAMP` | 자동 생성 시간 |
| JSON | `JSON` | JSON 구조 데이터 |
| BOOLEAN | `TINYINT(1)` 또는 `BOOLEAN` | 참/거짓 |

---

## 향후 확장 고려 사항

- **다중 클럽 지원**: 현재 Club 중심 구조이나, 추후 멀티테넌트 고려 시 테넌트 식별자 추가
- **회원 로그인/인증** : `users` 테이블 추가 (코치, 관리자, 보호자 권한 분리)
- **보호자 계정**: 보호자 전용 로그인 및 자녀 연결 (`parent_accounts` 테이블)
- **수업료 정기 결제**: 자동 청구/결제 모듈
- **알림 발송 이력**: SMS/이메일/푸시 알림 발송 로그
- **훈련 영상**: TrainingRecord에 영상 URL 연결
- **대회/경기 관리**: 대회 정보, 경기 결과, 출전 기록
- **레벨 테스트**: 주기적 레벨 평가 및 Group 변경 기록
- **용품 관리**: 유니폼, 축구화 등 용품 지급/구매 관리
