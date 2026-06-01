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

    const handover = await prisma.handover.findUnique({
      where: { id },
      include: {
        fromCoach: { select: { id: true, name: true } },
        toCoach: { select: { id: true, name: true } },
      },
    });

    if (!handover) {
      return errorResponse("존재하지 않는 인수인계입니다.", 404);
    }

    return successResponse({ handover });
  } catch (error) {
    console.error("Handover get error:", error);
    return errorResponse("인수인계 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateHandoverInput {
  fromCoachId?: string;
  toCoachId?: string;
  title?: string;
  content?: string;
  attachments?: string | null;
  priority?: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.handover.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 인수인계입니다.", 404);
    }

    const parsed = await parseBody<UpdateHandoverInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    // Verify fromCoach exists if being updated
    if (data.fromCoachId) {
      const fromCoach = await prisma.coach.findUnique({
        where: { id: data.fromCoachId },
      });
      if (!fromCoach) {
        return errorResponse("존재하지 않는 인계자입니다.", 404);
      }
    }

    // Verify toCoach exists if being updated
    if (data.toCoachId) {
      const toCoach = await prisma.coach.findUnique({
        where: { id: data.toCoachId },
      });
      if (!toCoach) {
        return errorResponse("존재하지 않는 인수자입니다.", 404);
      }
    }

    const handover = await prisma.handover.update({
      where: { id },
      data: {
        ...(data.fromCoachId !== undefined && {
          fromCoachId: data.fromCoachId,
        }),
        ...(data.toCoachId !== undefined && { toCoachId: data.toCoachId }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.attachments !== undefined && {
          attachments: data.attachments,
        }),
        ...(data.priority !== undefined && { priority: data.priority }),
      },
      include: {
        fromCoach: { select: { id: true, name: true } },
        toCoach: { select: { id: true, name: true } },
      },
    });

    return successResponse({ handover });
  } catch (error) {
    console.error("Handover update error:", error);
    return errorResponse("인수인계 수정에 실패했습니다.");
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

    const existing = await prisma.handover.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 인수인계입니다.", 404);
    }

    await prisma.handover.delete({ where: { id } });

    return successResponse({ message: "인수인계가 삭제되었습니다." });
  } catch (error) {
    console.error("Handover delete error:", error);
    return errorResponse("인수인계 삭제에 실패했습니다.");
  }
}
