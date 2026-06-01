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
    const senderId = searchParams.get("senderId");
    const receiverId = searchParams.get("receiverId");

    const where: Record<string, unknown> = {};
    if (senderId) {
      where.senderId = senderId;
    }
    if (receiverId) {
      where.receiverId = receiverId;
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse({ messages });
  } catch (error) {
    console.error("Messages list error:", error);
    return errorResponse("메시지 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateMessageInput {
  senderId: string;
  receiverId: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateMessageInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    if (!data.senderId || !data.receiverId || !data.content) {
      return errorResponse(
        "발신자 ID, 수신자 ID, 내용은 필수 입력 항목입니다.",
        400
      );
    }

    // Verify sender (Member) exists
    const sender = await prisma.member.findUnique({
      where: { id: data.senderId },
    });
    if (!sender) {
      return errorResponse("존재하지 않는 발신자입니다.", 404);
    }

    // Verify receiver (Coach) exists
    const receiver = await prisma.coach.findUnique({
      where: { id: data.receiverId },
    });
    if (!receiver) {
      return errorResponse("존재하지 않는 수신자입니다.", 404);
    }

    const message = await prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
      },
      include: {
        sender: { select: { id: true, name: true } },
        receiver: { select: { id: true, name: true } },
      },
    });

    return successResponse({ message }, 201);
  } catch (error) {
    console.error("Message create error:", error);
    return errorResponse("메시지 전송에 실패했습니다.");
  }
}
