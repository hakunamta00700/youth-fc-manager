import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/training/[id] — get a single training record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const record = await prisma.trainingRecord.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    if (!record) {
      return errorResponse("훈련 기록을 찾을 수 없습니다.", 404);
    }

    return successResponse(record);
  } catch (error) {
    console.error("Training get error:", error);
    return errorResponse("훈련 기록을 불러오는데 실패했습니다.");
  }
}

// PUT /api/training/[id] — update a training record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.trainingRecord.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("훈련 기록을 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      date?: string;
      category?: string;
      dribbling?: number | null;
      passing?: number | null;
      shooting?: number | null;
      defense?: number | null;
      stamina?: number | null;
      speed?: number | null;
      cooperation?: number | null;
      attitude?: number | null;
      coachNote?: string | null;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const {
      date,
      category,
      dribbling,
      passing,
      shooting,
      defense,
      stamina,
      speed,
      cooperation,
      attitude,
      coachNote,
    } = parsed.data;

    const data: Record<string, unknown> = {};
    if (date !== undefined) data.date = new Date(date);
    if (category !== undefined) data.category = category;
    if (dribbling !== undefined) data.dribbling = dribbling;
    if (passing !== undefined) data.passing = passing;
    if (shooting !== undefined) data.shooting = shooting;
    if (defense !== undefined) data.defense = defense;
    if (stamina !== undefined) data.stamina = stamina;
    if (speed !== undefined) data.speed = speed;
    if (cooperation !== undefined) data.cooperation = cooperation;
    if (attitude !== undefined) data.attitude = attitude;
    if (coachNote !== undefined) data.coachNote = coachNote;

    // Validate score ranges if provided (1-10 scale)
    const scoreFields: (keyof typeof data)[] = [
      "dribbling",
      "passing",
      "shooting",
      "defense",
      "stamina",
      "speed",
      "cooperation",
      "attitude",
    ];
    for (const field of scoreFields) {
      const val = data[field] as number | null | undefined;
      if (val !== undefined && val !== null && (val < 1 || val > 10)) {
        return errorResponse(
          `${field} 점수는 1에서 10 사이여야 합니다.`,
          400
        );
      }
    }

    const record = await prisma.trainingRecord.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(record);
  } catch (error) {
    console.error("Training update error:", error);
    return errorResponse("훈련 기록을 수정하는데 실패했습니다.");
  }
}

// DELETE /api/training/[id] — delete a training record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.trainingRecord.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("훈련 기록을 찾을 수 없습니다.", 404);
    }

    await prisma.trainingRecord.delete({ where: { id } });

    return successResponse({ message: "훈련 기록이 삭제되었습니다." });
  } catch (error) {
    console.error("Training delete error:", error);
    return errorResponse("훈련 기록을 삭제하는데 실패했습니다.");
  }
}
