import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  parseBody,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/inquiries/[id] — get a single inquiry
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    if (!inquiry) {
      return errorResponse("문의를 찾을 수 없습니다.", 404);
    }

    return successResponse(inquiry);
  } catch (error) {
    console.error("GET /api/inquiries/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// PUT /api/inquiries/[id] — update an inquiry
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("문의를 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      memberId?: string;
      type?: string;
      content?: string;
      status?: string;
      contactedAt?: string;
      note?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { memberId, type, content, status, contactedAt, note } = parsed.data;

    // If memberId is being changed, verify the new member exists
    if (memberId !== undefined) {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
        select: { id: true },
      });

      if (!member) {
        return errorResponse("회원을 찾을 수 없습니다.", 404);
      }
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: {
        ...(memberId !== undefined && { memberId }),
        ...(type !== undefined && { type }),
        ...(content !== undefined && { content }),
        ...(status !== undefined && { status }),
        ...(contactedAt !== undefined && {
          contactedAt: contactedAt ? new Date(contactedAt) : null,
        }),
        ...(note !== undefined && { note: note ?? null }),
      },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    return successResponse(inquiry);
  } catch (error) {
    console.error("PUT /api/inquiries/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

// DELETE /api/inquiries/[id] — delete an inquiry
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    // Check existence
    const existing = await prisma.inquiry.findUnique({
      where: { id },
    });

    if (!existing) {
      return errorResponse("문의를 찾을 수 없습니다.", 404);
    }

    await prisma.inquiry.delete({
      where: { id },
    });

    return successResponse({ message: "문의가 삭제되었습니다." });
  } catch (error) {
    console.error("DELETE /api/inquiries/[id] error:", error);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
