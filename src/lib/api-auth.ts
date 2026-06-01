import { type NextRequest, NextResponse } from "next/server";
import { getUserFromToken, type AuthUser } from "./auth";

/**
 * Get authenticated user from request (Authorization header or cookie).
 * Returns null if not authenticated.
 */
export function getAuthFromRequest(
  request: NextRequest
): AuthUser | null {
  const authHeader = request.headers.get("Authorization");
  let token: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    token = request.cookies.get("auth_token")?.value ?? null;
  }

  if (!token) return null;
  return getUserFromToken(token);
}

/**
 * Require authentication — returns 401 if not authenticated.
 * Otherwise returns the authed user.
 */
export function requireAuth(
  request: NextRequest
): { user: AuthUser } | { error: NextResponse } {
  const user = getAuthFromRequest(request);
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Require specific role(s) — returns 403 if role doesn't match.
 * Must be called after requireAuth.
 */
export function requireRole(
  user: AuthUser,
  allowedRoles: AuthUser["role"][]
): NextResponse | null {
  if (!allowedRoles.includes(user.role)) {
    return NextResponse.json(
      { error: "접근 권한이 없습니다." },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Common error response helper
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Common success response helper
 */
export function successResponse(data: unknown, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Parse JSON body safely
 */
export async function parseBody<T>(
  request: NextRequest
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const data = await request.json();
    return { data: data as T };
  } catch {
    return {
      error: NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      ),
    };
  }
}
