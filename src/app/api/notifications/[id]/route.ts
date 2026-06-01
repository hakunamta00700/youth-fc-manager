import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/notifications/[id] — get a single notification
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return errorResponse("알림을 찾을 수 없습니다.", 404);
    }

    return successResponse(notification);
  } catch (error) {
    console.error("GET /api/notifications/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// PUT /api/notifications/[id] — update a notification
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("알림을 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      clubId?: string;
      title?: string;
      content?: string;
      category?: string;
      target?: string;
      targetIds?: string;
      pinned?: boolean;
      sentAt?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { clubId, title, content, category, target, targetIds, pinned, sentAt } =
      parsed.data;

    const notification = await prisma.notification.update({
      where: { id },
      data: {
        ...(clubId !== undefined && { clubId: clubId ?? null }),
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(category !== undefined && { category }),
        ...(target !== undefined && { target }),
        ...(targetIds !== undefined && { targetIds: targetIds ?? null }),
        ...(pinned !== undefined && { pinned }),
        ...(sentAt !== undefined && { sentAt: new Date(sentAt) }),
      },
    });

    return successResponse(notification);
  } catch (error) {
    console.error("PUT /api/notifications/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// DELETE /api/notifications/[id] — delete a notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("알림을 찾을 수 없습니다.", 404);
    }

    await prisma.notification.delete({
      where: { id },
    });

    return successResponse({ message: "알림이 삭제되었습니다." });
  } catch (error) {
    console.error("DELETE /api/notifications/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
