import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true, color: true, category: true } },
        attendances: {
          orderBy: { date: "desc" },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        trainingRecords: {
          orderBy: { date: "desc" },
          take: 10,
        },
      },
    });

    if (!member) {
      return errorResponse("존재하지 않는 회원입니다.", 404);
    }

    return successResponse({ member });
  } catch (error) {
    console.error("Member get error:", error);
    return errorResponse("회원 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateMemberInput {
  groupId?: string | null;
  name?: string;
  birthDate?: string | null;
  gender?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  emergencyContact?: string | null;
  medicalNote?: string | null;
  guardParent?: string | null;
  relation?: string | null;
  status?: string;
  note?: string | null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 회원입니다.", 404);
    }

    const parsed = await parseBody<UpdateMemberInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    // Verify group exists if being updated
    if (data.groupId) {
      const group = await prisma.group.findUnique({
        where: { id: data.groupId },
      });
      if (!group) {
        return errorResponse("존재하지 않는 그룹입니다.", 404);
      }
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.groupId !== undefined && { groupId: data.groupId }),
        ...(data.birthDate !== undefined && { birthDate: data.birthDate }),
        ...(data.gender !== undefined && { gender: data.gender }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.emergencyContact !== undefined && {
          emergencyContact: data.emergencyContact,
        }),
        ...(data.medicalNote !== undefined && { medicalNote: data.medicalNote }),
        ...(data.guardParent !== undefined && { guardParent: data.guardParent }),
        ...(data.relation !== undefined && { relation: data.relation }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.note !== undefined && { note: data.note }),
      },
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
    });

    return successResponse({ member });
  } catch (error) {
    console.error("Member update error:", error);
    return errorResponse("회원 정보 수정에 실패했습니다.");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.member.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 회원입니다.", 404);
    }

    // Delete related records first
    await prisma.$transaction([
      prisma.attendance.deleteMany({ where: { memberId: id } }),
      prisma.payment.deleteMany({ where: { memberId: id } }),
      prisma.trainingRecord.deleteMany({ where: { memberId: id } }),
      prisma.inquiry.deleteMany({ where: { memberId: id } }),
      prisma.message.deleteMany({ where: { senderId: id } }),
      prisma.member.delete({ where: { id } }),
    ]);

    return successResponse({ message: "회원이 삭제되었습니다." });
  } catch (error) {
    console.error("Member delete error:", error);
    return errorResponse("회원 삭제에 실패했습니다.");
  }
}
