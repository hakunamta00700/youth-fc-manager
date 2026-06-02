import { cookies } from "next/headers";

// Types
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "coach" | "parent";
  phone?: string;
  avatar?: string;
}

export interface AuthToken {
  userId: string;
  role: AuthUser["role"];
  exp: number;
}

// Mock user database
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id: "1",
    name: "김관리자",
    email: "admin@youthfc.com",
    password: "admin1234",
    role: "admin",
    phone: "010-1234-5678",
  },
  {
    id: "2",
    name: "박매니저",
    email: "manager@youthfc.com",
    password: "manager1234",
    role: "manager",
    phone: "010-2345-6789",
  },
  {
    id: "3",
    name: "이코치",
    email: "coach@youthfc.com",
    password: "coach1234",
    role: "coach",
    phone: "010-3456-7890",
  },
  {
    id: "4",
    name: "김학부모",
    email: "parent@youthfc.com",
    password: "parent1234",
    role: "parent",
    phone: "010-4567-8901",
  },
];

// Simple base64-encoded JSON token (not cryptographically secure for production)
// In production, use a proper JWT library like `jsonwebtoken` with a secret key
const TOKEN_SECRET="youth-fc-manager-secret-2024";
const TOKEN_EXPIRY_HOURS=24

function base64Encode(data: string): string {
  return Buffer.from(data).toString("base64url");
}

function base64Decode(data: string): string {
  return Buffer.from(data, "base64url").toString("utf-8");
}

export function createToken(user: AuthUser): string {
  const payload: AuthToken = {
    userId: user.id,
    role: user.role,
    exp: Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
  };
  const header = base64Encode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64Encode(JSON.stringify(payload));
  const signature = base64Encode(
    `${header}.${encodedPayload}.${TOKEN_SECRET}`
  );
  return `${header}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [, encodedPayload] = parts;
    const payload = JSON.parse(base64Decode(encodedPayload)) as AuthToken;

    // Check expiry
    if (payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getUserFromToken(token: string): AuthUser | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  const user = MOCK_USERS.find((u) => u.id === payload.userId);
  if (!user) return null;

  const { password: _, ...safeUser } = user;
  return safeUser;
}

export function findUserByEmail(
  email: string
): (AuthUser & { password: string }) | undefined {
  return MOCK_USERS.find((u) => u.email === email);
}

export async function getAuthUserFromCookies(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return null;
    return getUserFromToken(token);
  } catch {
    return null;
  }
}
