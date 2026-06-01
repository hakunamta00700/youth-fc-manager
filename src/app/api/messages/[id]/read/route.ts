import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.message.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 메시지입니다.", 404);
    }

    const message = await prisma.message.update({
      where: { id },
      data: {
        read: true,
        readAt: new Date(),
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    return successResponse({ message });
  } catch (error) {
    console.error("Message read update error:", error);
    return errorResponse("메시지 읽음 처리에 실패했습니다.");
  }
}
