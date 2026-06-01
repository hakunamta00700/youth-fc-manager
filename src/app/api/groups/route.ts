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
    const category = searchParams.get("category");

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [{ name: { contains: search } }];
    }

    const groups = await prisma.group.findMany({
      where,
      include: {
        _count: {
          select: {
            members: true,
            coaches: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return successResponse({ groups });
  } catch (error) {
    console.error("Groups list error:", error);
    return errorResponse("그룹 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateGroupInput {
  clubId: string;
  name: string;
  category: string;
  description?: string;
  maxCapacity?: number;
  color?: string;
  schedule?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateGroupInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    if (!data.clubId || !data.name || !data.category) {
      return errorResponse("클럽 ID, 이름, 카테고리는 필수 입력 항목입니다.", 400);
    }

    // Verify club exists
    const club = await prisma.club.findUnique({ where: { id: data.clubId } });
    if (!club) {
      return errorResponse("존재하지 않는 클럽입니다.", 404);
    }

    const group = await prisma.group.create({
      data: {
        clubId: data.clubId,
        name: data.name,
        category: data.category,
        description: data.description || null,
        maxCapacity: data.maxCapacity || null,
        color: data.color || null,
        schedule: data.schedule || null,
      },
    });

    return successResponse({ group }, 201);
  } catch (error) {
    console.error("Group create error:", error);
    return errorResponse("그룹 등록에 실패했습니다.");
  }
}
