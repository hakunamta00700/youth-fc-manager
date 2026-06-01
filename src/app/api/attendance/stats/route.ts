import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/attendance/stats?month=2026-06&groupId=
// Returns attendance summary with counts by status
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const groupId = searchParams.get("groupId");

    if (!month) {
      return errorResponse("month 파라미터는 필수입니다. (예: 2026-06)", 400);
    }

    const [year, mon] = month.split("-").map(Number);
    const monthStart = new Date(year, mon - 1, 1);
    const monthEnd = new Date(year, mon, 1);

    // Build attendance where clause
    const attendanceWhere: Record<string, unknown> = {
      date: {
        gte: monthStart,
        lt: monthEnd,
      },
    };

    // If groupId is provided, filter by members in that group
    if (groupId) {
      attendanceWhere.member = {
        groupId,
      };
    }

    // Get all attendances for the month
    const attendances = await prisma.attendance.findMany({
      where: attendanceWhere,
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    // Count by status
    const statusCounts: Record<string, number> = {};
    for (const a of attendances) {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    }

    // Count unique members
    const uniqueMembers = new Set(attendances.map((a) => a.memberId));

    // Get total active members (optionally filtered by group)
    const memberWhere: Record<string, unknown> = { status: "active" };
    if (groupId) memberWhere.groupId = groupId;

    const totalMembers = await prisma.member.count({ where: memberWhere });

    return successResponse({
      month,
      groupId: groupId || null,
      totalAttendances: attendances.length,
      uniqueMembers: uniqueMembers.size,
      totalActiveMembers: totalMembers,
      statusCounts,
      attendanceRate:
        totalMembers > 0
          ? Math.round((uniqueMembers.size / totalMembers) * 100)
          : 0,
    });
  } catch (error) {
    console.error("Attendance stats error:", error);
    return errorResponse("출석 통계를 불러오는데 실패했습니다.");
  }
}
