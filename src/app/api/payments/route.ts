import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

// GET /api/payments — list payments with filters
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get("memberId");
    const month = searchParams.get("month");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};

    if (memberId) where.memberId = memberId;
    if (month) where.month = month;
    if (status) where.status = status;

    const payments = await prisma.payment.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, groupId: true },
        },
      },
      orderBy: [{ month: "desc" }, { dueDate: "asc" }],
    });

    return successResponse(payments);
  } catch (error) {
    console.error("Payment list error:", error);
    return errorResponse("납부 목록을 불러오는데 실패했습니다.");
  }
}

// POST /api/payments — create a new payment record
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<{
      memberId: string;
      amount: number;
      month: string;
      dueDate?: string;
      paidAt?: string;
      status?: string;
      method?: string;
      note?: string;
    }>(request);

    if ("error" in parsed) return parsed.error;

    const { memberId, amount, month, dueDate, paidAt, status, method, note } =
      parsed.data;

    if (!memberId || amount === undefined || !month) {
      return errorResponse("memberId, amount, month는 필수 항목입니다.", 400);
    }

    if (amount < 0) {
      return errorResponse("금액은 0보다 작을 수 없습니다.", 400);
    }

    const payment = await prisma.payment.create({
      data: {
        memberId,
        amount,
        month,
        dueDate: dueDate ? new Date(dueDate) : null,
        paidAt: paidAt ? new Date(paidAt) : null,
        status: status || "pending",
        method: method || null,
        note: note || null,
      },
      include: {
        member: {
          select: { id: true, name: true },
        },
      },
    });

    return successResponse(payment, 201);
  } catch (error) {
    console.error("Payment create error:", error);
    return errorResponse("납부 기록을 생성하는데 실패했습니다.");
  }
}
