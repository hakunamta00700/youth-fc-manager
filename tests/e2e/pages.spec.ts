import { test, expect } from "@playwright/test";
import { TEST_USERS } from "../api/helpers";

// ════════════════════════════════════════════════════════════════════
// Token cache — log all roles in once, share across describe blocks
// ════════════════════════════════════════════════════════════════════
const tokens: Record<string, string> = {};

test.beforeAll(async ({ request }) => {
  for (const [role, user] of Object.entries(TEST_USERS)) {
    const res = await request.post("/api/auth/login", {
      data: { email: user.email, password: user.password },
    });
    if (!res.ok()) {
      throw new Error(`Login failed for ${role}: ${res.status()}`);
    }
    const body = await res.json();
    tokens[role] = body.token;
  }
});

// ════════════════════════════════════════════════════════════════════
// Helpers
// ════════════════════════════════════════════════════════════════════

/**
 * Inject the auth_token cookie into the browser context before navigating.
 * Must be called inside a test / beforeEach that has access to `context`.
 */
async function setAuthCookie(
  context: import("@playwright/test").BrowserContext,
  role: keyof typeof TEST_USERS,
) {
  await context.addCookies([
    {
      name: "auth_token",
      value: tokens[role],
      domain: "localhost",
      path: "/",
    },
  ]);
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Navigate to a page, wait for full load, and run common smoke‑test assertions.
 *
 * - Checks that the HTTP status is not a server error (< 500)
 * - Verifies the final URL contains the requested path (no unexpected redirect)
 * - Confirms a heading with the expected text is visible on the page
 * - Takes a full‑page screenshot for visual debugging
 */
async function visitPage(
  page: import("@playwright/test").Page,
  url: string,
  expectedHeading: string | RegExp,
  screenshotName: string,
) {
  const response = await page.goto(url, { waitUntil: "networkidle" });
  // Allow 200 (OK), 304 (Not Modified), or other non‑error codes
  expect(response?.status()).toBeLessThan(500);

  // URL should contain the target path (no redirect to /login)
  await expect(page).toHaveURL(new RegExp(escapeRegex(url) + "(\\?.*)?$"));

  // Expected heading should be visible
  await expect(
    page.getByRole("heading", { name: expectedHeading, exact: false }),
  ).toBeVisible();

  // Screenshot for visual debugging
  await page.screenshot({
    path: `test-results/screenshots/${screenshotName}.png`,
    fullPage: true,
  });
}

// ════════════════════════════════════════════════════════════════════
// 1. 관리자(Admin) 페이지 로딩
// ════════════════════════════════════════════════════════════════════
test.describe("관리자 페이지 로딩", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookie(context, "admin");
  });

  test("대시보드 — /admin", async ({ page }) => {
    await visitPage(page, "/admin", "운영 대시보드", "admin-dashboard");
  });

  test("원생 목록 — /admin/students", async ({ page }) => {
    await visitPage(page, "/admin/students", "원생 목록", "admin-students");
  });

  test("코치 목록 — /admin/coaches", async ({ page }) => {
    await visitPage(page, "/admin/coaches", "코치 목록", "admin-coaches");
  });

  test("공지사항 — /admin/notices", async ({ page }) => {
    await visitPage(page, "/admin/notices", /공지사항/, "admin-notices");
  });

  test("설정 — /admin/settings", async ({ page }) => {
    await visitPage(page, "/admin/settings", "권한/설정", "admin-settings");
  });
});

// ════════════════════════════════════════════════════════════════════
// 2. 매니저(Manager) 페이지 로딩
// ════════════════════════════════════════════════════════════════════
test.describe("매니저 페이지 로딩", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookie(context, "manager");
  });

  test("대시보드 — /manager", async ({ page }) => {
    await visitPage(page, "/manager", "매니저 대시보드", "manager-dashboard");
  });
});

// ════════════════════════════════════════════════════════════════════
// 3. 코치(Coach) 페이지 로딩
// ════════════════════════════════════════════════════════════════════
test.describe("코치 페이지 로딩", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookie(context, "coach");
  });

  test("대시보드 — /coach", async ({ page }) => {
    await visitPage(page, "/coach", "코치 홈", "coach-dashboard");
  });
});

// ════════════════════════════════════════════════════════════════════
// 4. 학부모(Parent) 페이지 로딩
// ════════════════════════════════════════════════════════════════════
test.describe("학부모 페이지 로딩", () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookie(context, "parent");
  });

  test("대시보드 — /parent", async ({ page }) => {
    await visitPage(page, "/parent", "학부모 대시보드", "parent-dashboard");
  });
});

// ════════════════════════════════════════════════════════════════════
// 5. 공통 페이지 로딩 (no auth required)
// ════════════════════════════════════════════════════════════════════
test.describe("공통 페이지 로딩", () => {
  test("로그인 페이지 — /login", async ({ page }) => {
    const response = await page.goto("/login", { waitUntil: "networkidle" });
    expect(response?.status()).toBeLessThan(500);
    await expect(page).toHaveURL("/login");

    // Logo / brand heading
    await expect(
      page.getByRole("heading", { name: "Youth FC Manager" }),
    ).toBeVisible();

    // Form fields should be rendered
    await expect(page.locator('input[id="email"]')).toBeVisible();
    await expect(page.locator('input[id="password"]')).toBeVisible();
    await expect(
      page.getByRole("button", { name: /로그인/ }),
    ).toBeVisible();

    // Demo accounts helper section
    await expect(page.getByText("테스트 계정")).toBeVisible();

    await page.screenshot({
      path: "test-results/screenshots/login-page.png",
      fullPage: true,
    });
  });

  test("404 페이지 — /nonexistent", async ({ page }) => {
    const response = await page.goto("/nonexistent", {
      waitUntil: "networkidle",
    });
    // Next.js renders a built‑in 404 page at status 200
    expect(response?.status()).toBe(200);
    // Should NOT redirect to /login (confirm no auth middleware side‑effect)
    await expect(page).toHaveURL(/\/nonexistent/);
    // Default Next.js 404 shows "404"
    await expect(page.getByText("404")).toBeVisible();

    await page.screenshot({
      path: "test-results/screenshots/404-page.png",
      fullPage: true,
    });
  });
});
