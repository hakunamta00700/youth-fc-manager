import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/training — list training records with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const date = searchParams.get("date");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};

    if (memberId) where.memberId = memberId;
    if (category) where.category = category;
    if (date) {
      const d = new Date(date);
      where.date = {
        gte: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
        lt: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1),
      };
    }

    const records = await prisma.trainingRecord.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return successResponse(records);
  } catch (error) {
    console.error("Training list error:", error);
    return errorResponse("훈련 기록 목록을 불러오는데 실패했습니다.");
  }
}

// POST /api/training — create a new training record
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      memberId: string;
      date: string;
      category: string;
      dribbling?: number;
      passing?: number;
      shooting?: number;
      defense?: number;
      stamina?: number;
      speed?: number;
      cooperation?: number;
      attitude?: number;
      coachNote?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const {
      memberId,
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

    if (!memberId || !date || !category) {
      return errorResponse("memberId, date, category는 필수 항목입니다.", 400);
    }

    // Validate score ranges (1-10 or null)
    const scores = {
      dribbling,
      passing,
      shooting,
      defense,
      stamina,
      speed,
      cooperation,
      attitude,
    };

    for (const [key, val] of Object.entries(scores)) {
      if (val !== undefined && val !== null && (val < 1 || val > 10)) {
        return errorResponse(
          `${key} 점수는 1에서 10 사이여야 합니다.`,
          400
        );
      }
    }

    const record = await prisma.trainingRecord.create({
      data: {
        memberId,
        date: new Date(date),
        category,
        ...scores,
        coachNote,
        recordedById: auth.user.id,
      },
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(record, 201);
  } catch (error) {
    console.error("Training create error:", error);
    return errorResponse("훈련 기록을 생성하는데 실패했습니다.");
  }
}
