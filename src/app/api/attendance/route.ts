import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/attendance — list attendances with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const month = searchParams.get("month");

    const where: Record<string, unknown> = {};

    if (memberId) where.memberId = memberId;
    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      where.date = {
        gte: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        lt: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
      };
    }
    if (month) {
      const [year, mon] = month.split("-").map(Number);
      where.date = {
        gte: new Date(year, mon - 1, 1),
        lt: new Date(year, mon, 1),
      };
    }

    const attendances = await prisma.attendance.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return successResponse(attendances);
  } catch (error) {
    console.error("Attendance list error:", error);
    return errorResponse("출석 목록을 불러오는데 실패했습니다.");
  }
}

// POST /api/attendance — create a new attendance record
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      memberId: string;
      date: string;
      status: string;
      checkIn?: string;
      checkOut?: string;
      note?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { memberId, date, status, checkIn, checkOut, note } = parsed.data;

    if (!memberId || !date || !status) {
      return errorResponse("memberId, date, status는 필수 항목입니다.", 400);
    }

    const attendance = await prisma.attendance.create({
      data: {
        memberId,
        date: new Date(date),
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        note,
        recordedById: auth.user.id,
      },
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(attendance, 201);
  } catch (error) {
    console.error("Attendance create error:", error);
    return errorResponse("출석 기록을 생성하는데 실패했습니다.");
  }
}
