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

    const coach = await prisma.coach.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true, color: true, category: true } },
        attendanceAlerts: {
          orderBy: { sentAt: "desc" },
          take: 20,
        },
      },
    });

    if (!coach) {
      return errorResponse("존재하지 않는 코치입니다.", 404);
    }

    return successResponse({ coach });
  } catch (error) {
    console.error("Coach get error:", error);
    return errorResponse("코치 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateCoachInput {
  groupId?: string | null;
  name?: string;
  phone?: string | null;
  email?: string | null;
  role?: string;
  specialty?: string | null;
  bio?: string | null;
  avatar?: string | null;
  status?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.coach.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 코치입니다.", 404);
    }

    const parsed = await parseBody<UpdateCoachInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    // Verify group exists if being updated
    if (data.groupId) {
      const group = await prisma.group.findUnique({
        where: { id: data.groupId },
      });
      if (!group) {
        return errorResponse("존재하지 않는 그룹입니다.", 404);
      }
    }

    const coach = await prisma.coach.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.groupId !== undefined && { groupId: data.groupId }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.specialty !== undefined && { specialty: data.specialty }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar }),
        ...(data.status !== undefined && { status: data.status }),
      },
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
    });

    return successResponse({ coach });
  } catch (error) {
    console.error("Coach update error:", error);
    return errorResponse("코치 정보 수정에 실패했습니다.");
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

    const existing = await prisma.coach.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 코치입니다.", 404);
    }

    // Delete related records then the coach
    await prisma.$transaction([
      prisma.attendanceAlert.deleteMany({ where: { coachId: id } }),
      prisma.message.deleteMany({ where: { receiverId: id } }),
      prisma.handover.deleteMany({ where: { fromCoachId: id } }),
      prisma.handover.deleteMany({ where: { toCoachId: id } }),
      prisma.coach.delete({ where: { id } }),
    ]);

    return successResponse({ message: "코치가 삭제되었습니다." });
  } catch (error) {
    console.error("Coach delete error:", error);
    return errorResponse("코치 삭제에 실패했습니다.");
  }
}
