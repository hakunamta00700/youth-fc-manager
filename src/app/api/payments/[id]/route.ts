import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/payments/[id] — get a single payment record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
    });

    if (!payment) {
      return errorResponse("납부 기록을 찾을 수 없습니다.", 404);
    }

    return successResponse(payment);
  } catch (error) {
    console.error("Payment get error:", error);
    return errorResponse("납부 기록을 불러오는데 실패했습니다.");
  }
}

// PUT /api/payments/[id] — update a payment record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.payment.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("납부 기록을 찾을 수 없습니다.", 404);
    }

    const parsed = await parseBody<{
      amount?: number;
      month?: string;
      dueDate?: string | null;
      paidAt?: string | null;
      status?: string;
      method?: string | null;
      note?: string | null;
      refundedAmount?: number | null;
      refundedAt?: string | null;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const {
      amount,
      month,
      dueDate,
      paidAt,
      status,
      method,
      note,
      refundedAmount,
      refundedAt,
    } = parsed.data;

    const data: Record<string, unknown> = {};
    if (amount !== undefined) {
      if (amount < 0) return errorResponse("금액은 0보다 작을 수 없습니다.", 400);
      data.amount = amount;
    }
    if (month !== undefined) data.month = month;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;
    if (paidAt !== undefined) data.paidAt = paidAt ? new Date(paidAt) : null;
    if (status !== undefined) data.status = status;
    if (method !== undefined) data.method = method;
    if (note !== undefined) data.note = note;
    if (refundedAmount !== undefined) data.refundedAmount = refundedAmount;
    if (refundedAt !== undefined)
      data.refundedAt = refundedAt ? new Date(refundedAt) : null;

    const payment = await prisma.payment.update({
      where: { id },
      data,
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(payment);
  } catch (error) {
    console.error("Payment update error:", error);
    return errorResponse("납부 기록을 수정하는데 실패했습니다.");
  }
}

// DELETE /api/payments/[id] — delete a payment record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.payment.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("납부 기록을 찾을 수 없습니다.", 404);
    }

    await prisma.payment.delete({ where: { id } });

    return successResponse({ message: "납부 기록이 삭제되었습니다." });
  } catch (error) {
    console.error("Payment delete error:", error);
    return errorResponse("납부 기록을 삭제하는데 실패했습니다.");
  }
}
