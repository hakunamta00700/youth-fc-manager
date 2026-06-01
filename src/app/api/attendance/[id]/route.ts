import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/attendance/[id] — get a single attendance record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    if (!attendance) {
      return errorResponse("출석 기록을 찾을 수 없습니다.", 404);
    }

    return successResponse(attendance);
  } catch (error) {
    console.error("Attendance get error:", error);
    return errorResponse("출석 기록을 불러오는데 실패했습니다.");
  }
}

// PUT /api/attendance/[id] — update an attendance record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.attendance.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("출석 기록을 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      date?: string;
      status?: string;
      checkIn?: string | null;
      checkOut?: string | null;
      note?: string | null;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { date, status, checkIn, checkOut, note } = parsed.data;

    const data: Record<string, unknown> = {};
    if (date !== undefined) data.date = new Date(date);
    if (status !== undefined) data.status = status;
    if (checkIn !== undefined) data.checkIn = checkIn ? new Date(checkIn) : null;
    if (checkOut !== undefined) data.checkOut = checkOut ? new Date(checkOut) : null;
    if (note !== undefined) data.note = note;

    const attendance = await prisma.attendance.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(attendance);
  } catch (error) {
    console.error("Attendance update error:", error);
    return errorResponse("출석 기록을 수정하는데 실패했습니다.");
  }
}

// DELETE /api/attendance/[id] — delete an attendance record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.attendance.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("출석 기록을 찾을 수 없습니다.", 404);
    }

    await prisma.attendance.delete({ where: { id } });

    return successResponse({ message: "출석 기록이 삭제되었습니다." });
  } catch (error) {
    console.error("Attendance delete error:", error);
    return errorResponse("출석 기록을 삭제하는데 실패했습니다.");
  }
}
