import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/notifications — list notifications with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");
    const category = searchParams.get("category");
    const pinned = searchParams.get("pinned");

    const where: Record<string, unknown> = {};

    if (clubId) where.clubId = clubId;
    if (category) where.category = category;
    if (pinned === "true") where.pinned = true;
    if (pinned === "false") where.pinned = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { sentAt: "desc" }],
    });

    return successResponse(notifications);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// POST /api/notifications — create a notification
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      clubId?: string;
      title: string;
      content: string;
      category: string;
      target: string;
      targetIds?: string;
      pinned?: boolean;
      sentAt?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { clubId, title, content, category, target, targetIds, pinned, sentAt } =
      parsed.data;

    // Validate required fields
    if (!title || !content || !category || !target) {
      return errorResponse("title, content, category, target 필드는 필수입니다.", 400);
    }

    const notification = await prisma.notification.create({
      data: {
        clubId: clubId ?? null,
        title,
        content,
        category,
        target,
        targetIds: targetIds ?? null,
        pinned: pinned ?? false,
        sentAt: sentAt ? new Date(sentAt) : new Date(),
      },
    });

    return successResponse(notification, 201);
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
