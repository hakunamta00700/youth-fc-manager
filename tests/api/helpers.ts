import { APIRequestContext } from "@playwright/test";

/**
 * Shared test credentials matching src/lib/auth.ts mock users
 */
export const TEST_USERS = {
  admin: {
    email: "admin@youthfc.com",
    password: "admin1234",
    role: "admin",
  },
  manager: {
    email: "manager@youthfc.com",
    password: "manager1234",
    role: "manager",
  },
  coach: {
    email: "coach@youthfc.com",
    password: "coach1234",
    role: "coach",
  },
  parent: {
    email: "parent@youthfc.com",
    password: "parent1234",
    role: "parent",
  },
};

/**
 * Login and return the auth token
 */
export async function loginAs(
  request: APIRequestContext,
  role: keyof typeof TEST_USERS = "admin"
): Promise<string> {
  const user = TEST_USERS[role];
  const res = await request.post("/api/auth/login", {
    data: { email: user.email, password: user.password },
  });
  const body = await res.json();
  if (!res.ok()) {
    throw new Error(`Login failed: ${JSON.stringify(body)}`);
  }
  return body.token;
}

/**
 * Create an authenticated request context.
 * Returns a headers object with Bearer token.
 */
export async function authHeader(
  request: APIRequestContext,
  role: keyof typeof TEST_USERS = "admin"
): Promise<Record<string, string>> {
  const token = await loginAs(request, role);
  return { Authorization: `Bearer ${token}` };
}
