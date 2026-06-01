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
    const search = searchParams.get("search");
    const groupId = searchParams.get("groupId");
    const status = searchParams.get("status") || "active";

    const where: Record<string, unknown> = {};

    if (status !== "all") {
      where.status = status;
    }

    if (groupId) {
      where.groupId = groupId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    // If user is a coach, scope to their group
    if (auth.user.role === "coach") {
      const coach = await prisma.coach.findFirst({
        where: { id: auth.user.id },
        select: { groupId: true },
      });
      if (coach?.groupId) {
        where.groupId = coach.groupId;
      }
    }

    const members = await prisma.member.findMany({
      where,
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
      orderBy: { name: "asc" },
    });

    return successResponse({ members });
  } catch (error) {
    console.error("Members list error:", error);
    return errorResponse("회원 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateMemberInput {
  clubId: string;
  groupId?: string;
  name: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  medicalNote?: string;
  guardParent?: string;
  relation?: string;
  status?: string;
  note?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateMemberInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    if (!data.clubId || !data.name) {
      return errorResponse("클럽 ID와 이름은 필수 입력 항목입니다.", 400);
    }

    // Verify club exists
    const club = await prisma.club.findUnique({ where: { id: data.clubId } });
    if (!club) {
      return errorResponse("존재하지 않는 클럽입니다.", 404);
    }

    // Verify group exists if provided
    if (data.groupId) {
      const group = await prisma.group.findUnique({
        where: { id: data.groupId },
      });
      if (!group) {
        return errorResponse("존재하지 않는 그룹입니다.", 404);
      }
    }

    const member = await prisma.member.create({
      data: {
        clubId: data.clubId,
        groupId: data.groupId || null,
        name: data.name,
        birthDate: data.birthDate || null,
        gender: data.gender || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        emergencyContact: data.emergencyContact || null,
        medicalNote: data.medicalNote || null,
        guardParent: data.guardParent || null,
        relation: data.relation || null,
        status: data.status || "active",
        note: data.note || null,
      },
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
    });

    return successResponse({ member }, 201);
  } catch (error) {
    console.error("Member create error:", error);
    return errorResponse("회원 등록에 실패했습니다.");
  }
}
