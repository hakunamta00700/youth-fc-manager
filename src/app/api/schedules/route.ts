import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/schedules — list schedules with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");
    const type = searchParams.get("type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = {};

    if (groupId) where.groupId = groupId;
    if (type) where.type = type;

    // Date range filter
    if (from || to) {
      const startTime: Record<string, Date> = {};
      if (from) startTime.gte = new Date(from);
      if (to) startTime.lte = new Date(to);
      where.startTime = startTime;
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: { startTime: "asc" },
    });

    return successResponse(schedules);
  } catch (error) {
    console.error("GET /api/schedules error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// POST /api/schedules — create a schedule
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      groupId?: string;
      title: string;
      description?: string;
      startTime: string;
      endTime: string;
      type: string;
      location?: string;
      color?: string;
      allDay?: boolean;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const {
      groupId,
      title,
      description,
      startTime,
      endTime,
      type,
      location,
      color,
      allDay,
    } = parsed.data;

    // Validate required fields
    if (!title || !startTime || !endTime || !type) {
      return errorResponse(
        "title, startTime, endTime, type 필드는 필수입니다.",
        400
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return errorResponse("유효하지 않은 날짜 형식입니다.", 400);
    }

    if (end <= start) {
      return errorResponse("종료 시간은 시작 시간 이후여야 합니다.", 400);
    }

    const schedule = await prisma.schedule.create({
      data: {
        groupId: groupId ?? null,
        title,
        description: description ?? null,
        startTime: start,
        endTime: end,
        type,
        location: location ?? null,
        color: color ?? null,
        allDay: allDay ?? false,
      },
    });

    return successResponse(schedule, 201);
  } catch (error) {
    console.error("POST /api/schedules error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
