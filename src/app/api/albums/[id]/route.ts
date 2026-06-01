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

    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return errorResponse("존재하지 않는 앨범입니다.", 404);
    }

    return successResponse({
      album: { ...album, images: JSON.parse(album.images || "[]") },
    });
  } catch (error) {
    console.error("Album get error:", error);
    return errorResponse("앨범 정보를 불러오는데 실패했습니다.");
  }
}

interface UpdateAlbumInput {
  title?: string;
  description?: string | null;
  images?: string[];
  tags?: string | null;
  createdById?: string | null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const { id } = await params;

    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 앨범입니다.", 404);
    }

    const parsed = await parseBody<UpdateAlbumInput>(request);
    if ("error" in parsed) return parsed.error;

    const data = parsed.data;

    const album = await prisma.album.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.images !== undefined && {
          images: JSON.stringify(data.images),
        }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.createdById !== undefined && {
          createdById: data.createdById,
        }),
      },
    });

    return successResponse({
      album: { ...album, images: JSON.parse(album.images) },
    });
  } catch (error) {
    console.error("Album update error:", error);
    return errorResponse("앨범 정보 수정에 실패했습니다.");
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

    const existing = await prisma.album.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("존재하지 않는 앨범입니다.", 404);
    }

    await prisma.album.delete({ where: { id } });

    return successResponse({ message: "앨범이 삭제되었습니다." });
  } catch (error) {
    console.error("Album delete error:", error);
    return errorResponse("앨범 삭제에 실패했습니다.");
  }
}
