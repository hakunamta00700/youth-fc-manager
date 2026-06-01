import { type NextRequest } from "next/server";
import {
  requireAuth,
  errorResponse,
  successResponse,
} from "@/lib/api-auth";

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    if ("error" in auth) return auth.error;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("파일이 필요합니다.", 400);
    }

    // Mock upload: return a placeholder URL
    const filename = file.name;
    const url = `/uploads/${Date.now()}-${filename}`;

    return successResponse({ url, filename }, 201);
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("파일 업로드에 실패했습니다.");
  }
}
