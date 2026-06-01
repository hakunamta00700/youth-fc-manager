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
    const id = searchParams.get("id");

    let club;

    if (id) {
      club = await prisma.club.findUnique({ where: { id } });
    } else {
      club = await prisma.club.findFirst();
    }

    if (!club) {
      return errorResponse("존재하지 않는 클럽입니다.", 404);
    }

    return successResponse({ club });
  } catch (error) {
    console.error("Club get error:", error);
    return errorResponse("클럽 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateClubInput {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  logo?: string | null;
}

export async function PUT(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    let club;

    if (id) {
      club = await prisma.club.findUnique({ where: { id } });
    } else {
      club = await prisma.club.findFirst();
    }

    if (!club) {
      return errorResponse("존재하지 않는 클럽입니다.", 404);
    }

    const parsed = await parseBody<UpdateClubInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    const updated = await prisma.club.update({
      where: { id: club.id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.address !== undefined && { address: data.address }),
        ...(data.logo !== undefined && { logo: data.logo }),
      },
    });

    return successResponse({ club: updated });
  } catch (error) {
    console.error("Club update error:", error);
    return errorResponse("클럽 정보 수정에 실패했습니다.");
  }
}
