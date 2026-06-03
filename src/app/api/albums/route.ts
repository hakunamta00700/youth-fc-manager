import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireAuth,
  errorResponse,
  successResponse,
  parseBody,
} from "@/lib/api-auth";

type AlbumRecord = Record<string, unknown> & {
  images: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(request.url);
    const clubId = searchParams.get("clubId");

    const where: Record<string, unknown> = {};
    if (clubId) {
      where.clubId = clubId;
    }

    const albums = (await prisma.album.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })) as AlbumRecord[];

    // Parse images JSON string to array
    const parsed = albums.map((album) => ({
      ...album,
      images: JSON.parse(album.images || "[]"),
    }));

    return successResponse({ albums: parsed });
  } catch (error) {
    console.error("Albums list error:", error);
    return errorResponse("앨범 목록을 불러오는데 실패했습니다.");
  }
}

interface CreateAlbumInput {
  clubId: string;
  title: string;
  description?: string;
  images?: string[];
  tags?: string;
  createdById?: string;
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const parsed = await parseBody<CreateAlbumInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    if (!data.clubId || !data.title) {
      return errorResponse("클럽 ID와 제목은 필수 입력 항목입니다.", 400);
    }

    // Verify club exists
    const club = await prisma.club.findUnique({ where: { id: data.clubId } });
    if (!club) {
      return errorResponse("존재하지 않는 클럽입니다.", 404);
    }

    const album = await prisma.album.create({
      data: {
        clubId: data.clubId,
        title: data.title,
        description: data.description || null,
        images: JSON.stringify(data.images || []),
        tags: data.tags || null,
        createdById: data.createdById || null,
      },
    });

    return successResponse(
      { album: { ...album, images: JSON.parse(album.images) } },
      201
    );
  } catch (error) {
    console.error("Album create error:", error);
    return errorResponse("앨범 등록에 실패했습니다.");
  }
}
