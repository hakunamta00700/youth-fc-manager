import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const fromCoachId = searchParams.get("fromCoachId");
    const toCoachId = searchParams.get("toCoachId");

    const where: Record<string, unknown> = {};
    if (fromCoachId) {
      where.fromCoachId = fromCoachId;
    }
    if (toCoachId) {
      where.toCoachId = toCoachId;
    }

    const handovers = await prisma.handover.findMany({
      where,
      include: {
        fromCoach: { select: { id: true, name: true } },
        toCoach: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ handovers });
  } catch (error) {
    console.error("Handovers list error:", error);
    return errorResponse("인수인계 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateHandoverInput {
  fromCoachId: string;
  toCoachId: string;
  title: string;
  content: string;
  attachments?: string;
  priority?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateHandoverInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    if (!data.fromCoachId || !data.toCoachId || !data.title || !data.content) {
      return errorResponse(
        "인계자 ID, 인수자 ID, 제목, 내용은 필수 입력 항목입니다.",
        400
      );
    }

    // Verify fromCoach exists
    const fromCoach = await prisma.coach.findUnique({
      where: { id: data.fromCoachId },
    });
    if (!fromCoach) {
      return errorResponse("존재하지 않는 인계자입니다.", 404);
    }

    // Verify toCoach exists
    const toCoach = await prisma.coach.findUnique({
      where: { id: data.toCoachId },
    });
    if (!toCoach) {
      return errorResponse("존재하지 않는 인수자입니다.", 404);
    }

    const handover = await prisma.handover.create({
      data: {
        fromCoachId: data.fromCoachId,
        toCoachId: data.toCoachId,
        title: data.title,
        content: data.content,
        attachments: data.attachments || null,
        priority: data.priority || "normal",
      },
      include: {
        fromCoach: { select: { id: true, name: true } },
        toCoach: { select: { id: true, name: true } },
      },
    });

    return successResponse({ handover }, 201);
  } catch (error) {
    console.error("Handover create error:", error);
    return errorResponse("인수인계 등록에 실패했습니다.");
  }
}
