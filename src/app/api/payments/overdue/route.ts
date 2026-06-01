import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

// GET /api/payments/overdue — returns overdue payments with member info
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const now = new Date();

    // Find payments that are past due and still pending
    const overduePayments = await prisma.payment.findMany({
      where: {
        status: "pending",
        dueDate: {
          lt: now,
        },
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            phone: true,
            groupId: true,
            group: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: [{ dueDate: "asc" }, { memberId: "asc" }],
    });

    // Calculate summary
    const totalOverdueAmount = overduePayments.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    const uniqueMembers = new Set(overduePayments.map((p) => p.memberId));

    return successResponse({
      totalOverdueCount: overduePayments.length,
      totalOverdueAmount,
      uniqueMemberCount: uniqueMembers.size,
      payments: overduePayments,
    });
  } catch (error) {
    console.error("Overdue payments error:", error);
    return errorResponse("연체 목록을 불러오는데 실패했습니다.");
  }
}
