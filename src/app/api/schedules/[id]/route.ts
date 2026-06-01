import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/schedules/[id] — get a single schedule
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return errorResponse("일정을 찾을 수 없습니다.", 404);
    }

    return successResponse(schedule);
  } catch (error) {
    console.error("GET /api/schedules/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// PUT /api/schedules/[id] — update a schedule
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("일정을 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      groupId?: string;
      title?: string;
      description?: string;
      startTime?: string;
      endTime?: string;
      type?: string;
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

    // Validate dates if provided
    if (startTime && isNaN(new Date(startTime).getTime())) {
      return errorResponse("유효하지 않은 시작 날짜 형식입니다.", 400);
    }

    if (endTime && isNaN(new Date(endTime).getTime())) {
      return errorResponse("유효하지 않은 종료 날짜 형식입니다.", 400);
    }

    // If both times are provided, validate ordering
    const effectiveStart = startTime
      ? new Date(startTime)
      : existing.startTime;
    const effectiveEnd = endTime ? new Date(endTime) : existing.endTime;

    if (effectiveEnd <= effectiveStart) {
      return errorResponse("종료 시간은 시작 시간 이후여야 합니다.", 400);
    }

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        ...(groupId !== undefined && { groupId: groupId ?? null }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description ?? null }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(type !== undefined && { type }),
        ...(location !== undefined && { location: location ?? null }),
        ...(color !== undefined && { color: color ?? null }),
        ...(allDay !== undefined && { allDay }),
      },
    });

    return successResponse(schedule);
  } catch (error) {
    console.error("PUT /api/schedules/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// DELETE /api/schedules/[id] — delete a schedule
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("일정을 찾을 수 없습니다.", 404);
    }

    await prisma.schedule.delete({
      where: { id },
    });

    return successResponse({ message: "일정이 삭제되었습니다." });
  } catch (error) {
    console.error("DELETE /api/schedules/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
