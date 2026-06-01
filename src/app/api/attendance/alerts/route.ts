import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/attendance/alerts — list attendance alerts
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const coachId = searchParams.get("coachId");

    const where: Record<string, unknown> = {};
    if (coachId) where.coachId = coachId;

    const alerts = await prisma.attendanceAlert.findMany({
      where,
      include: {
        coach: {
          select: { id: true, name: true },
        },
      },
      orderBy: { sentAt: "desc" },
    });

    return successResponse(alerts);
  } catch (error) {
    console.error("Attendance alerts list error:", error);
    return errorResponse("출석 알림 목록을 불러오는데 실패했습니다.");
  }
}

// POST /api/attendance/alerts — create a new attendance alert
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      coachId: string;
      memberId?: string;
      type: string;
      status: string;
      method: string;
      message?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { coachId, memberId, type, status, method, message } = parsed.data;

    if (!coachId || !type || !status || !method) {
      return errorResponse("coachId, type, status, method는 필수 항목입니다.", 400);
    }

    const alert = await prisma.attendanceAlert.create({
      data: {
        coachId,
        memberId: memberId || null,
        type,
        status,
        method,
        message,
      },
      include: {
        coach: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(alert, 201);
  } catch (error) {
    console.error("Attendance alert create error:", error);
    return errorResponse("출석 알림을 생성하는데 실패했습니다.");
  }
}
