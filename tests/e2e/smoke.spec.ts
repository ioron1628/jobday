import { expect, test } from "@playwright/test";
import { expectNoPageError, requiredBoards } from "./helpers";

const coreRoutes = [
  "/",
  "/boards",
  "/boards/work-raid",
  "/boards/remote-raid",
  "/boards/dimodo",
  "/boards/available-today",
  "/boards/tool-market",
  "/boards/materials",
  "/boards/work-raid/new",
  "/boards/remote-raid/new",
  "/boards/dimodo/new",
  "/boards/available-today/new",
  "/boards/tool-market/new",
  "/boards/materials/new",
  "/write?board=work-raid",
  "/write?board=tool-market",
  "/write?board=materials",
  "/login",
  "/signup",
  "/mypage",
  "/admin",
  "/admin/posts",
  "/admin/reports",
  "/admin/comments",
  "/admin/users",
  "/admin/notices",
  "/admin/promotions",
  "/admin/banners",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/liability",
  "/community-rules"
];

test.describe("기본 화면 검수", () => {
  test("핵심 주소가 열린다", async ({ page }) => {
    for (const route of coreRoutes) {
      await page.goto(route);
      await expectNoPageError(page);
    }
  });

  test("게시판 11개가 보인다", async ({ page }) => {
    await page.goto("/boards");
    for (const board of requiredBoards) {
      await expect(page.locator("body")).toContainText(board);
    }
  });

  test("모바일 주요 화면이 열린다", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/boards", "/boards/work-raid", "/boards/work-raid/new", "/boards/remote-raid/new", "/boards/available-today/new"]) {
      await page.goto(route);
      await expectNoPageError(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(overflow, `${route} 화면에 가로 밀림이 없어야 합니다.`).toBe(false);
    }
  });

  test("글쓰기 전용 필드가 보인다", async ({ page }) => {
    await page.goto("/boards/work-raid/new");
    await expect(page.locator("#extra-site_region")).toBeVisible();
    await expect(page.locator("#extra-work_date")).toBeVisible();
    await expect(page.locator("#extra-needed_count")).toBeVisible();
    await expect(page.locator("#extra-daily_pay")).toBeVisible();

    await page.goto("/boards/remote-raid/new");
    await expect(page.locator("#extra-lodging_provided")).toBeVisible();
    await expect(page.locator("#extra-transportation_provided")).toBeVisible();
    await expect(page.locator("#extra-ride_share_available")).toBeVisible();

    await page.goto("/boards/dimodo/new");
    await expect(page.locator("#extra-site_region")).toBeVisible();
    await expect(page.locator("#extra-needed_count")).toBeVisible();
    await expect(page.locator("#extra-contact_method")).toBeVisible();

    await page.goto("/boards/available-today/new");
    await expect(page.locator("#extra-available_region")).toBeVisible();
    await expect(page.locator("#extra-available_date")).toBeVisible();
    await expect(page.locator("#extra-can_travel")).toBeVisible();

    await page.goto("/boards/tool-market/new");
    await expect(page.locator("#extra-tool_name")).toBeVisible();
    await expect(page.locator("#extra-transaction_type")).toBeVisible();
    await expect(page.locator("#extra-price")).toBeVisible();

    await page.goto("/boards/materials/new");
    await expect(page.locator("#extra-material_name")).toBeVisible();
    await expect(page.locator("#extra-quantity")).toBeVisible();
    await expect(page.locator("#extra-direct_trade")).toBeVisible();
  });

  test("비로그인 사용자는 관리자 화면에서 차단된다", async ({ page }) => {
    for (const route of ["/admin", "/admin/posts", "/admin/reports", "/admin/comments", "/admin/users", "/admin/notices", "/admin/promotions", "/admin/banners"]) {
      await page.goto(route);
      await expectNoPageError(page);
      await expect(page.locator("body")).toContainText(/로그인이 필요합니다|관리자 권한이 필요합니다|접근할 수 없습니다/);
    }
  });
});
