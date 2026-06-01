import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          orderBy: { name: "asc" },
          select: {
            id: true,
            name: true,
            birthDate: true,
            gender: true,
            phone: true,
            status: true,
            enrolledAt: true,
          },
        },
        coaches: {
          orderBy: { startedAt: "asc" },
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            role: true,
            specialty: true,
            status: true,
          },
        },
        schedules: {
          orderBy: { startTime: "asc" },
        },
        _count: {
          select: {
            members: true,
            coaches: true,
            schedules: true,
          },
        },
      },
    });

    if (!group) {
      return errorResponse("존재하지 않는 그룹입니다.", 404);
    }

    return successResponse({ group });
  } catch (error) {
    console.error("Group get error:", error);
    return errorResponse("그룹 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateGroupInput {
  name?: string;
  category?: string;
  description?: string | null;
  maxCapacity?: number | null;
  color?: string | null;
  schedule?: string | null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 그룹입니다.", 404);
    }

    const parsed = await parseBody<UpdateGroupInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    const group = await prisma.group.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.maxCapacity !== undefined && {
          maxCapacity: data.maxCapacity,
        }),
        ...(data.color !== undefined && { color: data.color }),
        ...(data.schedule !== undefined && { schedule: data.schedule }),
      },
      include: {
        _count: {
          select: {
            members: true,
            coaches: true,
          },
        },
      },
    });

    return successResponse({ group });
  } catch (error) {
    console.error("Group update error:", error);
    return errorResponse("그룹 정보 수정에 실패했습니다.");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.group.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 그룹입니다.", 404);
    }

    // Check if group has members
    const memberCount = await prisma.member.count({ where: { groupId: id } });
    if (memberCount > 0) {
      return errorResponse(
        "그룹에 소속된 회원이 있습니다. 먼저 회원을 다른 그룹으로 이동해주세요.",
        400
      );
    }

    // Check if group has coaches
    const coachCount = await prisma.coach.count({ where: { groupId: id } });
    if (coachCount > 0) {
      return errorResponse(
        "그룹에 소속된 코치가 있습니다. 먼저 코치를 다른 그룹으로 이동해주세요.",
        400
      );
    }

    // Delete related schedules then the group
    await prisma.$transaction([
      prisma.schedule.deleteMany({ where: { groupId: id } }),
      prisma.group.delete({ where: { id } }),
    ]);

    return successResponse({ message: "그룹이 삭제되었습니다." });
  } catch (error) {
    console.error("Group delete error:", error);
    return errorResponse("그룹 삭제에 실패했습니다.");
  }
}
