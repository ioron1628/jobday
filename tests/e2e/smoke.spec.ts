import { expect, test } from "@playwright/test";
import { expectNoPageError } from "./helpers";

const phase0Routes = [
  "/",
  "/listen",
  "/episodes/field-first-day",
  "/podcast",
  "/podcast/field-first-day",
  "/podcast/submit",
  "/podcast/creators",
  "/occupations",
  "/occupations/graph",
  "/occupations/site-helper",
  "/occupations/logistics-night",
  "/career-moat",
  "/login",
  "/signup",
  "/mypage",
  "/terms",
  "/privacy",
  "/disclaimer",
  "/liability",
  "/community-rules"
];

const disabledByDefaultRoutes = ["/boards", "/boards/work-raid", "/write", "/jobs", "/shop", "/business", "/business/command-center", "/membership", "/skills"];

test.describe("Phase 0 기본 화면 검수", () => {
  test("Phase 0 핵심 주소가 열린다", async ({ request }) => {
    for (const route of phase0Routes) {
      const response = await request.get(route);
      expect(response.ok(), `${route} 주소가 정상 응답해야 합니다.`).toBe(true);
      const body = await response.text();
      expect(body).not.toContain("Application error");
      expect(body).not.toContain("Unhandled Runtime Error");
    }
  });

  test("홈에서 공개 핵심 행동이 보인다", async ({ page }) => {
    await page.goto("/");
    await expectNoPageError(page);
    await expect(page.locator("body")).toContainText("방송 듣기");
    await expect(page.locator("body")).toContainText("직업 찾기");
    await expect(page.locator("body")).toContainText("일자리 찾기");
    await expect(page.locator("body")).toContainText("출연 신청");
    await expect(page.locator("body")).toContainText("Season 0");
  });

  test("직업 허브 seed가 보인다", async ({ page }) => {
    await page.goto("/occupations");
    for (const occupation of ["야간 물류", "현장 보조", "원정 작업", "매장 근무", "기술 직종", "프리랜서의 하루"]) {
      await expect(page.locator("body")).toContainText(occupation);
    }
  });

  test("모바일 Phase 0 주요 화면이 열린다", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of ["/", "/listen", "/episodes/field-first-day", "/occupations", "/occupations/site-helper", "/career-moat", "/podcast/submit"]) {
      await page.goto(route);
      await expectNoPageError(page);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
      expect(overflow, `${route} 화면에 가로 밀림이 없어야 합니다.`).toBe(false);
    }
  });

  test("검증 전 모듈은 기본값에서 공개되지 않는다", async ({ request }) => {
    for (const route of disabledByDefaultRoutes) {
      const response = await request.get(route);
      expect(response.status(), `${route} 주소는 기본값에서 숨겨져야 합니다.`).toBe(404);
    }
  });
});
