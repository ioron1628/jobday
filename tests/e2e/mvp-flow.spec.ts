import { expect, test } from "@playwright/test";
import {
  createAvailableTodayPost,
  createDimodoPost,
  createMaterialsPost,
  createToolMarketPost,
  createWorkRaidPost,
  fillIfVisible,
  login,
  makeGeneratedQaAccount,
  makeQaAccount,
  saveProfile,
  signUp
} from "./helpers";

test.describe("실제 Supabase 저장 흐름", () => {
  test("회원가입부터 글쓰기, 댓글, 추천, 신고, 로그아웃까지 동작한다", async ({ page }) => {
    const workRaid = { title: "", url: "" };
    const signupAccount = makeGeneratedQaAccount();
    const loginAccount = makeQaAccount();
    const commentBlock = (text: string) =>
      page.getByText(text, { exact: true }).first().locator("xpath=ancestor::div[contains(@class, 'py-3')][1]");

    await test.step("홈 접속", async () => {
      await page.goto("/");
      await expect(page).toHaveTitle(/JOBDAY/);
    });

    await test.step("회원가입", async () => {
      await signUp(page, signupAccount);
    });

    await test.step("로그인", async () => {
      await login(page, loginAccount.source === "env" ? loginAccount : signupAccount);
    });

    await test.step("마이페이지 프로필 저장", async () => {
      await saveProfile(page, loginAccount.nickname);
    });

    await test.step("작업레이드 글쓰기", async () => {
      const created = await createWorkRaidPost(page, "work-raid", "작업레이드");
      workRaid.title = created.title;
      workRaid.url = created.url;
    });

    await test.step("작업레이드 목록 확인", async () => {
      await page.goto("/boards/work-raid");
      await expect(page.locator("body")).toContainText(workRaid.title);
    });

    await test.step("글 상세 페이지 진입", async () => {
      await page.goto(workRaid.url);
      await expect(page.locator("body")).toContainText(workRaid.title);
    });

    await test.step("댓글 작성", async () => {
      await page.locator('textarea[name="body"]').fill("자동 검수 댓글입니다.");
      await page.getByRole("button", { name: "댓글 쓰기" }).click();
      await expect(page.locator("body")).toContainText("댓글이 등록되었습니다.");
    });

    await test.step("댓글 수정", async () => {
      await commentBlock("자동 검수 댓글입니다.").getByRole("button", { name: "수정" }).click();
      await page.locator('form textarea[name="body"]').nth(1).fill("자동 검수 댓글 수정본입니다.");
      await page.getByRole("button", { name: "수정 저장" }).click();
      await expect(page.locator("body")).toContainText("댓글이 수정되었습니다.");
    });

    await test.step("대댓글 작성", async () => {
      await page.getByRole("button", { name: "답글" }).first().click();
      await page.locator('textarea[name="body"]').first().fill("자동 검수 대댓글입니다.");
      await page.getByRole("button", { name: "대댓글 쓰기" }).click();
      await expect(page.locator("body")).toContainText("대댓글이 등록되었습니다.");
    });

    await test.step("댓글 신고", async () => {
      await commentBlock("자동 검수 댓글 수정본입니다.").getByRole("button", { name: /신고/ }).first().click();
      await page.locator('textarea[name="detail"]').fill("자동 검수 댓글 신고입니다.");
      await page.getByRole("button", { name: "신고 접수" }).click();
      await expect(page.locator("body")).toContainText("댓글 신고가 접수되었습니다.");
    });

    await test.step("댓글 삭제", async () => {
      await commentBlock("자동 검수 댓글 수정본입니다.").getByRole("button", { name: "삭제" }).first().click();
      await expect(page.locator("body")).toContainText("삭제된 댓글입니다.");
    });

    await test.step("추천 클릭", async () => {
      await page.getByRole("button", { name: /추천/ }).first().click();
      await expect(page.locator("body")).toContainText("자기 글에는 추천/비추천을 할 수 없습니다.");
    });

    await test.step("비추천 클릭", async () => {
      await page.getByRole("button", { name: /비추천/ }).first().click();
      await expect(page.locator("body")).toContainText("자기 글에는 추천/비추천을 할 수 없습니다.");
    });

    await test.step("신고 접수", async () => {
      await page.getByRole("button", { name: /신고/ }).first().click();
      await page.locator('textarea[name="detail"]').fill("자동 검수 신고입니다.");
      await page.getByRole("button", { name: "신고 접수" }).click();
      await expect(page.locator("body")).toContainText("신고가 접수되었습니다.");
    });

    await test.step("원정레이드 글쓰기", async () => {
      await createWorkRaidPost(page, "remote-raid", "원정레이드");
    });

    await test.step("보조구함 글쓰기", async () => {
      await createDimodoPost(page);
    });

    await test.step("오늘일당가능 글쓰기", async () => {
      await createAvailableTodayPost(page);
    });

    await test.step("공구장터 글쓰기", async () => {
      const toolPost = await createToolMarketPost(page, "판매");
      await page.goto(toolPost.url);
      await page.getByRole("button", { name: "거래완료 처리" }).click();
      await expect(page.locator("body")).toContainText("거래완료로 처리했습니다.");
    });

    await test.step("공구 대여 글쓰기", async () => {
      await createToolMarketPost(page, "대여", "30000");
    });

    await test.step("자재거래 글쓰기", async () => {
      await createMaterialsPost(page);
    });

    await test.step("게시글 수정/삭제 상태 처리", async () => {
      const deleteTarget = await createWorkRaidPost(page, "work-raid", "수정삭제검수");
      const updatedTitle = `${deleteTarget.title} 수정본`;

      await page.goto(deleteTarget.url);
      await page.getByRole("link", { name: "수정" }).click();
      await fillIfVisible(page, "#title", updatedTitle);
      await page.locator("#body").fill(`${updatedTitle}\n자동 검수용 수정 본문입니다.`);
      await page.getByRole("button", { name: "수정 저장" }).click();
      await expect(page.locator("body")).toContainText("저장됐습니다.");
      await page.getByRole("link", { name: "작성한 글 보기" }).click();
      await page.waitForURL(/\/posts\/[0-9a-f-]+$/, { timeout: 20_000 });
      await expect(page.locator("body")).toContainText(updatedTitle);

      await page.getByRole("button", { name: "삭제" }).click();
      await expect(page.locator("body")).toContainText("글을 삭제 처리했습니다.");
      await page.goto("/boards/work-raid");
      await expect(page.locator("body")).not.toContainText(updatedTitle);
    });

    await test.step("관리자 접근 확인", async () => {
      await page.goto("/admin");
      await expect(page.locator("body")).toContainText(/관리자 권한이 필요합니다|신고 목록/);
    });

    await test.step("로그아웃", async () => {
      await page.goto("/me");
      await page.getByRole("button", { name: "로그아웃" }).click();
      await page.waitForURL("**/", { timeout: 12_000 });
      await expect(page.locator("body")).toContainText("JOBDAY");
    });
  });
});
