import { test, expect } from "@playwright/test";
import { authHeader } from "./helpers";

/**
 * Comprehensive Playwright API tests for youth-fc-manager.
 * Tests all 14 entity groups + auth + upload.
 *
 * Uses test.describe.serial for sequential execution because some entities
 * depend on IDs created by previous blocks (Members → Attendance/Payments/etc).
 */

let adminAuth: Record<string, string>;

// Shared IDs created across entity blocks
let createdMemberId = "";
let createdGroupId = "";
let createdCoachId = "";
let secondCoachId = "";
let createdAlbumId = "";
let createdNotificationId = "";
let createdScheduleId = "";
let createdPaymentId = "";
let createdAttendanceId = "";
let createdTrainingId = "";
let createdInquiryId = "";
let createdHandoverId = "";
let createdMessageId = "";

test.describe.serial("Youth FC Manager — 전체 API 테스트", () => {
  // ──────────────────────────────────────────────
  // 전역 beforeAll: admin / manager 로그인
  // ──────────────────────────────────────────────
  test.beforeAll(async ({ request }) => {
    adminAuth = await authHeader(request, "admin");
  });

  // ══════════════════════════════════════════════
  // 1. Auth
  // ══════════════════════════════════════════════
  test.describe.serial("Auth — 인증", () => {
    test("POST /api/auth/login — 유효한 로그인 성공", async ({ request }) => {
      const res = await request.post("/api/auth/login", {
        data: { email: "admin@youthfc.com", password: "admin1234" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.token).toBeDefined();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe("admin@youthfc.com");
    });

    test("POST /api/auth/login — 잘못된 비밀번호 401", async ({ request }) => {
      const res = await request.post("/api/auth/login", {
        data: { email: "admin@youthfc.com", password: "wrong" },
      });
      expect(res.status()).toBe(401);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    test("POST /api/auth/login — 존재하지 않는 이메일 401", async ({ request }) => {
      const res = await request.post("/api/auth/login", {
        data: { email: "nobody@test.com", password: "test1234" },
      });
      expect(res.status()).toBe(401);
      const body = await res.json();
      expect(body.error).toBeDefined();
    });

    test("POST /api/auth/login — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/auth/login", {
        data: { email: "" },
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/auth/me — 토큰으로 인증 성공", async ({ request }) => {
      const res = await request.get("/api/auth/me", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe("admin@youthfc.com");
    });

    test("GET /api/auth/me — 토큰 없이 401", async ({ request }) => {
      const res = await request.get("/api/auth/me");
      expect(res.status()).toBe(401);
    });
  });

  // ══════════════════════════════════════════════
  // 2. Members
  // ══════════════════════════════════════════════
  test.describe.serial("Members — 회원", () => {
    test("GET /api/members — 인증 없이 401", async ({ request }) => {
      const res = await request.get("/api/members");
      expect(res.status()).toBe(401);
    });

    test("GET /api/members — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/members", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.members).toBeDefined();
      expect(Array.isArray(body.members)).toBeTruthy();
    });

    test("POST /api/members — 생성 (필드 누락 400)", async ({ request }) => {
      const res = await request.post("/api/members", {
        headers: adminAuth,
        data: { clubId: "1" }, // name 누락
      });
      expect(res.status()).toBe(400);
    });

    test("POST /api/members — 생성 성공", async ({ request }) => {
      const res = await request.post("/api/members", {
        headers: adminAuth,
        data: {
          clubId: "1",
          name: "테스트회원",
          phone: "010-0000-0000",
          guardParent: "학부모",
          relation: "mother",
          status: "active",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.member).toBeDefined();
      expect(body.member.name).toBe("테스트회원");
      createdMemberId = body.member.id;
    });

    test("GET /api/members/[id] — 단건 조회", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.get(`/api/members/${createdMemberId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.member.id).toBe(createdMemberId);
      expect(body.member.name).toBe("테스트회원");
    });

    test("GET /api/members/[id] — 존재하지 않는 ID 404", async ({ request }) => {
      const res = await request.get("/api/members/nonexistent-id", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(404);
    });

    test("PUT /api/members/[id] — 수정", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.put(`/api/members/${createdMemberId}`, {
        headers: adminAuth,
        data: { name: "수정된회원", phone: "010-9999-9999" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.member.name).toBe("수정된회원");
    });

    test("DELETE /api/members/[id] — 삭제", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.delete(`/api/members/${createdMemberId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      // 재조회 시 404
      const getRes = await request.get(`/api/members/${createdMemberId}`, {
        headers: adminAuth,
      });
      expect(getRes.status()).toBe(404);
    });
  });

  // ══════════════════════════════════════════════
  // 3. Groups (그룹)
  // ══════════════════════════════════════════════
  test.describe.serial("Groups — 그룹", () => {
    test("GET /api/groups — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/groups", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.groups).toBeDefined();
      expect(Array.isArray(body.groups)).toBeTruthy();
    });

    test("POST /api/groups — 생성 성공", async ({ request }) => {
      const res = await request.post("/api/groups", {
        headers: adminAuth,
        data: {
          clubId: "1",
          name: "테스트반",
          category: "유치부",
          description: "테스트 그룹입니다",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.group).toBeDefined();
      expect(body.group.name).toBe("테스트반");
      createdGroupId = body.group.id;
    });

    test("POST /api/groups — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/groups", {
        headers: adminAuth,
        data: { clubId: "1" }, // name, category 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/groups/[id] — 단건 조회", async ({ request }) => {
      expect(createdGroupId).toBeTruthy();
      const res = await request.get(`/api/groups/${createdGroupId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.group.id).toBe(createdGroupId);
    });

    test("PUT /api/groups/[id] — 수정", async ({ request }) => {
      expect(createdGroupId).toBeTruthy();
      const res = await request.put(`/api/groups/${createdGroupId}`, {
        headers: adminAuth,
        data: { name: "수정된테스트반", description: "수정된 설명" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.group.name).toBe("수정된테스트반");
    });

    // Groups must exist for downstream tests; we don't delete it here.
  });

  // ══════════════════════════════════════════════
  // 4. Coaches (코치)
  // ══════════════════════════════════════════════
  test.describe.serial("Coaches — 코치", () => {
    test("GET /api/coaches — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/coaches", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.coaches).toBeDefined();
    });

    test("POST /api/coaches — 생성 성공", async ({ request }) => {
      const res = await request.post("/api/coaches", {
        headers: adminAuth,
        data: {
          clubId: "1",
          name: "테스트코치",
          phone: "010-1111-1111",
          role: "coach",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.coach).toBeDefined();
      expect(body.coach.name).toBe("테스트코치");
      createdCoachId = body.coach.id;
    });

    test("POST /api/coaches — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/coaches", {
        headers: adminAuth,
        data: { clubId: "1" }, // name 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/coaches/[id] — 단건 조회", async ({ request }) => {
      expect(createdCoachId).toBeTruthy();
      const res = await request.get(`/api/coaches/${createdCoachId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.coach.id).toBe(createdCoachId);
    });

    test("PUT /api/coaches/[id] — 수정", async ({ request }) => {
      expect(createdCoachId).toBeTruthy();
      const res = await request.put(`/api/coaches/${createdCoachId}`, {
        headers: adminAuth,
        data: { name: "수정된코치", specialty: "골키퍼" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.coach.name).toBe("수정된코치");
    });

    // 두 번째 코치 생성 (Handover, Message 테스트용)
    test("POST /api/coaches — 두 번째 코치 생성", async ({ request }) => {
      const res = await request.post("/api/coaches", {
        headers: adminAuth,
        data: {
          clubId: "1",
          name: "두번째코치",
          phone: "010-2222-2222",
          role: "coach",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      secondCoachId = body.coach.id;
    });
  });

  // ══════════════════════════════════════════════
  // 5. Attendance (출석) — needs member
  // ══════════════════════════════════════════════
  test.describe.serial("Attendance — 출석", () => {
    // Re-create member for attendance tests
    test.beforeAll(async ({ request }) => {
      const res = await request.post("/api/members", {
        headers: adminAuth,
        data: {
          clubId: "1",
          name: "출석테스트회원",
          phone: "010-3333-3333",
          guardParent: "학부모",
          relation: "father",
          status: "active",
        },
      });
      const body = await res.json();
      createdMemberId = body.member.id;
    });

    test("GET /api/attendance — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/attendance", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/attendance — 생성 성공", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.post("/api/attendance", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          date: "2026-06-01T00:00:00.000Z",
          status: "present",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.status).toBe("present");
      createdAttendanceId = body.id;
    });

    test("POST /api/attendance — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/attendance", {
        headers: adminAuth,
        data: { memberId: createdMemberId }, // date, status 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/attendance/[id] — 단건 조회", async ({ request }) => {
      expect(createdAttendanceId).toBeTruthy();
      const res = await request.get(`/api/attendance/${createdAttendanceId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdAttendanceId);
    });

    test("PUT /api/attendance/[id] — 수정", async ({ request }) => {
      expect(createdAttendanceId).toBeTruthy();
      const res = await request.put(`/api/attendance/${createdAttendanceId}`, {
        headers: adminAuth,
        data: { status: "late", note: "지각" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("late");
    });

    test("GET /api/attendance/stats — 통계 (month 필수)", async ({ request }) => {
      const res = await request.get("/api/attendance/stats?month=2026-06", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.month).toBe("2026-06");
      expect(body.totalAttendances).toBeDefined();
    });

    test("GET /api/attendance/stats — month 누락 400", async ({ request }) => {
      const res = await request.get("/api/attendance/stats", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/attendance/alerts — 알림 목록", async ({ request }) => {
      const res = await request.get("/api/attendance/alerts", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("DELETE /api/attendance/[id] — 삭제", async ({ request }) => {
      expect(createdAttendanceId).toBeTruthy();
      const res = await request.delete(
        `/api/attendance/${createdAttendanceId}`,
        { headers: adminAuth }
      );
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 6. Payments (납부) — needs member
  // ══════════════════════════════════════════════
  test.describe.serial("Payments — 납부", () => {
    test.beforeAll(async ({ request }) => {
      // Re-create member if it was deleted
      if (!createdMemberId) {
        const res = await request.post("/api/members", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "납부테스트회원",
            phone: "010-4444-4444",
            guardParent: "학부모",
            relation: "mother",
            status: "active",
          },
        });
        const body = await res.json();
        createdMemberId = body.member.id;
      }
    });

    test("GET /api/payments — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/payments", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/payments — 생성 성공", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.post("/api/payments", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          amount: 100000,
          month: "2026-06",
          status: "paid",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.amount).toBe(100000);
      createdPaymentId = body.id;
    });

    test("POST /api/payments — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/payments", {
        headers: adminAuth,
        data: { memberId: createdMemberId }, // amount, month 누락
      });
      expect(res.status()).toBe(400);
    });

    test("POST /api/payments — 음수 금액 400", async ({ request }) => {
      const res = await request.post("/api/payments", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          amount: -100,
          month: "2026-06",
        },
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/payments/[id] — 단건 조회", async ({ request }) => {
      expect(createdPaymentId).toBeTruthy();
      const res = await request.get(`/api/payments/${createdPaymentId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdPaymentId);
    });

    test("PUT /api/payments/[id] — 수정", async ({ request }) => {
      expect(createdPaymentId).toBeTruthy();
      const res = await request.put(`/api/payments/${createdPaymentId}`, {
        headers: adminAuth,
        data: { amount: 150000, status: "pending" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.amount).toBe(150000);
    });

    test("GET /api/payments/overdue — 연체 목록", async ({ request }) => {
      const res = await request.get("/api/payments/overdue", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.totalOverdueCount).toBeDefined();
      expect(body.totalOverdueAmount).toBeDefined();
      expect(Array.isArray(body.payments)).toBeTruthy();
    });

    test("DELETE /api/payments/[id] — 삭제", async ({ request }) => {
      expect(createdPaymentId).toBeTruthy();
      const res = await request.delete(`/api/payments/${createdPaymentId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 7. Training (훈련 기록) — needs member
  // ══════════════════════════════════════════════
  test.describe.serial("Training — 훈련 기록", () => {
    test.beforeAll(async ({ request }) => {
      if (!createdMemberId) {
        const res = await request.post("/api/members", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "훈련테스트회원",
            phone: "010-5555-5555",
            guardParent: "학부모",
            relation: "mother",
            status: "active",
          },
        });
        const body = await res.json();
        createdMemberId = body.member.id;
      }
    });

    test("GET /api/training — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/training", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/training — 생성 성공", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.post("/api/training", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          date: "2026-06-01T00:00:00.000Z",
          category: "dribbling",
          dribbling: 8,
          passing: 7,
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.category).toBe("dribbling");
      createdTrainingId = body.id;
    });

    test("POST /api/training — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/training", {
        headers: adminAuth,
        data: { memberId: createdMemberId }, // date, category 누락
      });
      expect(res.status()).toBe(400);
    });

    test("POST /api/training — 점수 범위 초과 400", async ({ request }) => {
      const res = await request.post("/api/training", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          date: "2026-06-01T00:00:00.000Z",
          category: "passing",
          passing: 15, // 1-10 범위 초과
        },
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/training/[id] — 단건 조회", async ({ request }) => {
      expect(createdTrainingId).toBeTruthy();
      const res = await request.get(`/api/training/${createdTrainingId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdTrainingId);
    });

    test("PUT /api/training/[id] — 수정", async ({ request }) => {
      expect(createdTrainingId).toBeTruthy();
      const res = await request.put(`/api/training/${createdTrainingId}`, {
        headers: adminAuth,
        data: { passing: 9, coachNote: "훈련 코멘트" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.passing).toBe(9);
    });

    test("DELETE /api/training/[id] — 삭제", async ({ request }) => {
      expect(createdTrainingId).toBeTruthy();
      const res = await request.delete(`/api/training/${createdTrainingId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 8. Notifications (알림/공지)
  // ══════════════════════════════════════════════
  test.describe.serial("Notifications — 알림/공지", () => {
    test("GET /api/notifications — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/notifications", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/notifications — 생성 성공", async ({ request }) => {
      const res = await request.post("/api/notifications", {
        headers: adminAuth,
        data: {
          clubId: "1",
          title: "테스트공지",
          content: "공지 내용입니다",
          category: "general",
          target: "all",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.title).toBe("테스트공지");
      createdNotificationId = body.id;
    });

    test("POST /api/notifications — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/notifications", {
        headers: adminAuth,
        data: { clubId: "1" }, // title, content, category, target 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/notifications/[id] — 단건 조회", async ({ request }) => {
      expect(createdNotificationId).toBeTruthy();
      const res = await request.get(
        `/api/notifications/${createdNotificationId}`,
        { headers: adminAuth }
      );
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdNotificationId);
    });

    test("PUT /api/notifications/[id] — 수정", async ({ request }) => {
      expect(createdNotificationId).toBeTruthy();
      const res = await request.put(
        `/api/notifications/${createdNotificationId}`,
        { headers: adminAuth, data: { title: "수정된공지", pinned: true } }
      );
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.title).toBe("수정된공지");
      expect(body.pinned).toBe(true);
    });

    test("DELETE /api/notifications/[id] — 삭제", async ({ request }) => {
      expect(createdNotificationId).toBeTruthy();
      const res = await request.delete(
        `/api/notifications/${createdNotificationId}`,
        { headers: adminAuth }
      );
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 9. Schedules (일정) — needs group
  // ══════════════════════════════════════════════
  test.describe.serial("Schedules — 일정", () => {
    test.beforeAll(async ({ request }) => {
      // Create a group if it doesn't exist
      if (!createdGroupId) {
        const res = await request.post("/api/groups", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "일정테스트반",
            category: "초등부",
            description: "일정 테스트용",
          },
        });
        const body = await res.json();
        createdGroupId = body.group.id;
      }
    });

    test("GET /api/schedules — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/schedules", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/schedules — 생성 성공", async ({ request }) => {
      expect(createdGroupId).toBeTruthy();
      const res = await request.post("/api/schedules", {
        headers: adminAuth,
        data: {
          groupId: createdGroupId,
          title: "테스트일정",
          startTime: "2026-06-01T09:00:00.000Z",
          endTime: "2026-06-01T10:00:00.000Z",
          type: "training",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.title).toBe("테스트일정");
      createdScheduleId = body.id;
    });

    test("POST /api/schedules — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/schedules", {
        headers: adminAuth,
        data: { groupId: createdGroupId }, // title, startTime, endTime, type 누락
      });
      expect(res.status()).toBe(400);
    });

    test("POST /api/schedules — 종료 시간이 시작 시간보다 빠름 400", async ({ request }) => {
      const res = await request.post("/api/schedules", {
        headers: adminAuth,
        data: {
          groupId: createdGroupId,
          title: "잘못된일정",
          startTime: "2026-06-01T10:00:00.000Z",
          endTime: "2026-06-01T09:00:00.000Z",
          type: "training",
        },
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/schedules/[id] — 단건 조회", async ({ request }) => {
      expect(createdScheduleId).toBeTruthy();
      const res = await request.get(`/api/schedules/${createdScheduleId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdScheduleId);
    });

    test("PUT /api/schedules/[id] — 수정", async ({ request }) => {
      expect(createdScheduleId).toBeTruthy();
      const res = await request.put(`/api/schedules/${createdScheduleId}`, {
        headers: adminAuth,
        data: { title: "수정된일정", location: "강남구민체육센터" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.title).toBe("수정된일정");
    });

    test("DELETE /api/schedules/[id] — 삭제", async ({ request }) => {
      expect(createdScheduleId).toBeTruthy();
      const res = await request.delete(`/api/schedules/${createdScheduleId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 10. Inquiries (문의) — needs member
  // ══════════════════════════════════════════════
  test.describe.serial("Inquiries — 문의", () => {
    test.beforeAll(async ({ request }) => {
      if (!createdMemberId) {
        const res = await request.post("/api/members", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "문의테스트회원",
            phone: "010-6666-6666",
            guardParent: "학부모",
            relation: "mother",
            status: "active",
          },
        });
        const body = await res.json();
        createdMemberId = body.member.id;
      }
    });

    test("GET /api/inquiries — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/inquiries", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBeTruthy();
    });

    test("POST /api/inquiries — 생성 성공", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      const res = await request.post("/api/inquiries", {
        headers: adminAuth,
        data: {
          memberId: createdMemberId,
          type: "trial",
          content: "체험수업 문의합니다",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.type).toBe("trial");
      createdInquiryId = body.id;
    });

    test("POST /api/inquiries — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/inquiries", {
        headers: adminAuth,
        data: { memberId: createdMemberId }, // type, content 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/inquiries/[id] — 단건 조회", async ({ request }) => {
      expect(createdInquiryId).toBeTruthy();
      const res = await request.get(`/api/inquiries/${createdInquiryId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.id).toBe(createdInquiryId);
    });

    test("PUT /api/inquiries/[id] — 수정", async ({ request }) => {
      expect(createdInquiryId).toBeTruthy();
      const res = await request.put(`/api/inquiries/${createdInquiryId}`, {
        headers: adminAuth,
        data: { status: "completed", note: "상담 완료" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("completed");
    });

    test("DELETE /api/inquiries/[id] — 삭제", async ({ request }) => {
      expect(createdInquiryId).toBeTruthy();
      const res = await request.delete(`/api/inquiries/${createdInquiryId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 11. Albums (앨범)
  // ══════════════════════════════════════════════
  test.describe.serial("Albums — 앨범", () => {
    test("GET /api/albums — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/albums", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.albums).toBeDefined();
      expect(Array.isArray(body.albums)).toBeTruthy();
    });

    test("POST /api/albums — 생성 성공", async ({ request }) => {
      const res = await request.post("/api/albums", {
        headers: adminAuth,
        data: {
          clubId: "1",
          title: "테스트앨범",
          description: "설명입니다",
          images: ["/uploads/test1.jpg"],
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.album).toBeDefined();
      expect(body.album.title).toBe("테스트앨범");
      createdAlbumId = body.album.id;
    });

    test("POST /api/albums — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/albums", {
        headers: adminAuth,
        data: { clubId: "1" }, // title 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/albums/[id] — 단건 조회", async ({ request }) => {
      expect(createdAlbumId).toBeTruthy();
      const res = await request.get(`/api/albums/${createdAlbumId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.album.id).toBe(createdAlbumId);
    });

    test("PUT /api/albums/[id] — 수정", async ({ request }) => {
      expect(createdAlbumId).toBeTruthy();
      const res = await request.put(`/api/albums/${createdAlbumId}`, {
        headers: adminAuth,
        data: { title: "수정된앨범", description: "수정된 설명" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.album.title).toBe("수정된앨범");
    });

    test("DELETE /api/albums/[id] — 삭제", async ({ request }) => {
      expect(createdAlbumId).toBeTruthy();
      const res = await request.delete(`/api/albums/${createdAlbumId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 12. Messages (메시지) — needs member + coach
  // ══════════════════════════════════════════════
  test.describe.serial("Messages — 메시지", () => {
    test.beforeAll(async ({ request }) => {
      // Create member for sender
      if (!createdMemberId) {
        const res = await request.post("/api/members", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "메시지테스트회원",
            phone: "010-7777-7777",
            guardParent: "학부모",
            relation: "mother",
            status: "active",
          },
        });
        const body = await res.json();
        createdMemberId = body.member.id;
      }
      // Create coach for receiver if needed
      if (!createdCoachId) {
        const res = await request.post("/api/coaches", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "메시지테스트코치",
            phone: "010-8888-8888",
            role: "coach",
          },
        });
        const body = await res.json();
        createdCoachId = body.coach.id;
      }
    });

    test("GET /api/messages — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/messages", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.messages).toBeDefined();
      expect(Array.isArray(body.messages)).toBeTruthy();
    });

    test("POST /api/messages — 생성 성공", async ({ request }) => {
      expect(createdMemberId).toBeTruthy();
      expect(createdCoachId).toBeTruthy();
      const res = await request.post("/api/messages", {
        headers: adminAuth,
        data: {
          senderId: createdMemberId,
          receiverId: createdCoachId,
          content: "안녕하세요 코치님",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.message).toBeDefined();
      expect(body.message.content).toBe("안녕하세요 코치님");
      createdMessageId = body.message.id;
    });

    test("POST /api/messages — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/messages", {
        headers: adminAuth,
        data: { senderId: createdMemberId }, // receiverId, content 누락
      });
      expect(res.status()).toBe(400);
    });

    test("PUT /api/messages/[id]/read — 읽음 처리", async ({ request }) => {
      expect(createdMessageId).toBeTruthy();
      const res = await request.put(
        `/api/messages/${createdMessageId}/read`,
        { headers: adminAuth }
      );
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.message).toBeDefined();
      expect(body.message.read).toBe(true);
    });

    test("PUT /api/messages/[id]/read — 없는 메시지 404", async ({ request }) => {
      const res = await request.put("/api/messages/nonexistent/read", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(404);
    });
  });

  // ══════════════════════════════════════════════
  // 13. Handovers (인수인계) — needs coaches
  // ══════════════════════════════════════════════
  test.describe.serial("Handovers — 인수인계", () => {
    test.beforeAll(async ({ request }) => {
      // Ensure we have two coaches
      if (!createdCoachId) {
        const res = await request.post("/api/coaches", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "인수인계코치1",
            phone: "010-9991-1111",
            role: "coach",
          },
        });
        const body = await res.json();
        createdCoachId = body.coach.id;
      }
      if (!secondCoachId) {
        const res = await request.post("/api/coaches", {
          headers: adminAuth,
          data: {
            clubId: "1",
            name: "인수인계코치2",
            phone: "010-9992-2222",
            role: "coach",
          },
        });
        const body = await res.json();
        secondCoachId = body.coach.id;
      }
    });

    test("GET /api/handovers — 목록 조회", async ({ request }) => {
      const res = await request.get("/api/handovers", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.handovers).toBeDefined();
      expect(Array.isArray(body.handovers)).toBeTruthy();
    });

    test("POST /api/handovers — 생성 성공", async ({ request }) => {
      expect(createdCoachId).toBeTruthy();
      expect(secondCoachId).toBeTruthy();
      const res = await request.post("/api/handovers", {
        headers: adminAuth,
        data: {
          fromCoachId: createdCoachId,
          toCoachId: secondCoachId,
          title: "인수인계 테스트",
          content: "인수인계 내용입니다",
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.handover).toBeDefined();
      expect(body.handover.title).toBe("인수인계 테스트");
      createdHandoverId = body.handover.id;
    });

    test("POST /api/handovers — 필드 누락 400", async ({ request }) => {
      const res = await request.post("/api/handovers", {
        headers: adminAuth,
        data: { fromCoachId: createdCoachId }, // toCoachId, title, content 누락
      });
      expect(res.status()).toBe(400);
    });

    test("GET /api/handovers/[id] — 단건 조회", async ({ request }) => {
      expect(createdHandoverId).toBeTruthy();
      const res = await request.get(`/api/handovers/${createdHandoverId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.handover.id).toBe(createdHandoverId);
    });

    test("PUT /api/handovers/[id] — 수정", async ({ request }) => {
      expect(createdHandoverId).toBeTruthy();
      const res = await request.put(`/api/handovers/${createdHandoverId}`, {
        headers: adminAuth,
        data: { title: "수정된 인수인계", priority: "high" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.handover.title).toBe("수정된 인수인계");
    });

    test("DELETE /api/handovers/[id] — 삭제", async ({ request }) => {
      expect(createdHandoverId).toBeTruthy();
      const res = await request.delete(`/api/handovers/${createdHandoverId}`, {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 14. Club (클럽)
  // ══════════════════════════════════════════════
  test.describe.serial("Club — 클럽", () => {
    test("GET /api/club — 조회", async ({ request }) => {
      const res = await request.get("/api/club", { headers: adminAuth });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.club).toBeDefined();
      expect(body.club.id).toBeDefined();
    });

    test("GET /api/club — ?id=1 로 조회", async ({ request }) => {
      const res = await request.get("/api/club?id=1", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.club).toBeDefined();
    });

    test("PUT /api/club — 수정", async ({ request }) => {
      const res = await request.put("/api/club", {
        headers: adminAuth,
        data: { name: "수정된클럽" },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.club.name).toBe("수정된클럽");
    });

    // 원래 이름으로 복원
    test("PUT /api/club — 원래 이름으로 복원", async ({ request }) => {
      const res = await request.put("/api/club", {
        headers: adminAuth,
        data: { name: "Youth FC" }, // Adjust to match actual default name
      });
      expect(res.status()).toBe(200);
    });
  });

  // ══════════════════════════════════════════════
  // 15. Upload (파일 업로드)
  // ══════════════════════════════════════════════
  test.describe.serial("Upload — 파일 업로드", () => {
    test("POST /api/upload — 인증 없이 401", async ({ request }) => {
      const res = await request.post("/api/upload");
      expect(res.status()).toBe(401);
    });

    test("POST /api/upload — 파일 업로드 성공", async ({ request }) => {
      const res = await request.post("/api/upload", {
        headers: adminAuth,
        multipart: {
          file: {
            name: "test-image.png",
            mimeType: "image/png",
            buffer: Buffer.from(
              "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
              "base64"
            ),
          },
        },
      });
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.url).toBeDefined();
      expect(body.filename).toBe("test-image.png");
    });

    test("POST /api/upload — 파일 없이 400", async ({ request }) => {
      const res = await request.post("/api/upload", {
        headers: adminAuth,
      });
      expect(res.status()).toBe(400);
    });
  });

  // ══════════════════════════════════════════════
  // 16. 인증 오류 공통 테스트 (일부 엔드포인트 샘플)
  // ══════════════════════════════════════════════
  test.describe.serial("인증 오류 — 토큰 없는 요청", () => {
    const protectedEndpoints = [
      { method: "GET", url: "/api/members" },
      { method: "POST", url: "/api/members" },
      { method: "GET", url: "/api/groups" },
      { method: "POST", url: "/api/groups" },
      { method: "GET", url: "/api/coaches" },
      { method: "POST", url: "/api/coaches" },
      { method: "GET", url: "/api/attendance" },
      { method: "POST", url: "/api/attendance" },
      { method: "GET", url: "/api/payments" },
      { method: "POST", url: "/api/payments" },
      { method: "GET", url: "/api/training" },
      { method: "POST", url: "/api/training" },
      { method: "GET", url: "/api/notifications" },
      { method: "POST", url: "/api/notifications" },
      { method: "GET", url: "/api/schedules" },
      { method: "POST", url: "/api/schedules" },
      { method: "GET", url: "/api/inquiries" },
      { method: "POST", url: "/api/inquiries" },
      { method: "GET", url: "/api/albums" },
      { method: "POST", url: "/api/albums" },
      { method: "GET", url: "/api/messages" },
      { method: "POST", url: "/api/messages" },
      { method: "GET", url: "/api/handovers" },
      { method: "POST", url: "/api/handovers" },
      { method: "GET", url: "/api/club" },
      { method: "PUT", url: "/api/club" },
    ];

    for (const ep of protectedEndpoints) {
      test(`${ep.method} ${ep.url} → 401`, async ({ request }) => {
        const res = await request.fetch(ep.url, { method: ep.method });
        expect(res.status()).toBe(401);
      });
    }
  });
});
