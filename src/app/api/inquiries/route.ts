import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/inquiries — list inquiries with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (memberId) where.memberId = memberId;
    if (type) where.type = type;
    if (status) where.status = status;

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(inquiries);
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// POST /api/inquiries — create an inquiry
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      memberId: string;
      type: string;
      content: string;
      status?: string;
      contactedAt?: string;
      note?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { memberId, type, content, status, contactedAt, note } = parsed.data;

    // Validate required fields
    if (!memberId || !type || !content) {
      return errorResponse("memberId, type, content 필드는 필수입니다.", 400);
    }

    // Verify member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true },
    });

    if (!member) {
      return errorResponse("회원을 찾을 수 없습니다.", 404);
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        memberId,
        type,
        content,
        status: status ?? "pending",
        contactedAt: contactedAt ? new Date(contactedAt) : null,
        note: note ?? null,
      },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    return successResponse(inquiry, 201);
  } catch (error) {
    console.error("POST /api/inquiries error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
