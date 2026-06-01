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

    const coaches = await prisma.coach.findMany({
      where,
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
      orderBy: { name: "asc" },
    });

    return successResponse({ coaches });
  } catch (error) {
    console.error("Coaches list error:", error);
    return errorResponse("코치 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateCoachInput {
  clubId: string;
  groupId?: string;
  name: string;
  phone?: string;
  email?: string;
  role?: string;
  specialty?: string;
  bio?: string;
  avatar?: string;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateCoachInput>(request);
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

    const coach = await prisma.coach.create({
      data: {
        clubId: data.clubId,
        groupId: data.groupId || null,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        role: data.role || "coach",
        specialty: data.specialty || null,
        bio: data.bio || null,
        avatar: data.avatar || null,
        status: data.status || "active",
      },
      include: {
        group: { select: { id: true, name: true, color: true } },
      },
    });

    return successResponse({ coach }, 201);
  } catch (error) {
    console.error("Coach create error:", error);
    return errorResponse("코치 등록에 실패했습니다.");
  }
}
