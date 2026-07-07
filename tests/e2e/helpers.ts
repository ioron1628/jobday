import { expect, type Page } from "@playwright/test";

export const requiredBoards = [
  "현장자유",
  "작업레이드",
  "원정레이드",
  "보조구함",
  "오늘일당가능",
  "공구장터",
  "자재나눔거래",
  "초보입문",
  "현장질문",
  "시공사구인",
  "공지사항"
];

export type QaAccount = {
  email: string;
  password: string;
  nickname: string;
  source: "env" | "generated";
};

export function makeGeneratedQaAccount(): QaAccount {
  const stamp = Date.now();
  const suffix = Math.random().toString(36).slice(2, 8);
  return {
    email: `jobil-qa-${stamp}-${suffix}@example.com`,
    password: `JobilQa!${stamp}`,
    nickname: `검수${suffix}`,
    source: "generated"
  };
}

export function makeQaAccount(): QaAccount {
  const email = process.env.QA_TEST_EMAIL?.trim();
  const password = process.env.QA_TEST_PASSWORD?.trim();
  if (email && password) {
    const suffix = Math.random().toString(36).slice(2, 8);
    return {
      email,
      password,
      nickname: `검수${suffix}`,
      source: "env"
    };
  }

  return makeGeneratedQaAccount();
}

export async function expectNoPageError(page: Page) {
  await expect(page.locator("body")).not.toContainText("404");
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("body")).not.toContainText("Unhandled Runtime Error");
}

export async function fillIfVisible(page: Page, selector: string, value: string) {
  const field = page.locator(selector);
  await expect(field).toBeVisible();
  await field.fill(value);
}

export async function clickSubmit(page: Page, label: string) {
  const button = page.getByRole("button", { name: label });
  await expect(button).toBeVisible();
  await button.click();
}

export async function signUp(page: Page, account = makeGeneratedQaAccount()) {
  await page.goto("/signup");
  await fillIfVisible(page, "#email", account.email);
  await fillIfVisible(page, "#nickname", account.nickname);
  await fillIfVisible(page, "#password", account.password);
  await page.locator("#accepted_terms").check();
  await clickSubmit(page, "회원가입");
  await expect(page.locator("body")).toContainText(/회원가입이 접수되었습니다|이미 로그인되어 있습니다/);
  return account;
}

export async function login(page: Page, account: QaAccount) {
  await page.goto("/login");

  const emailField = page.locator("#email");
  const loggedInNotice = page.getByText("이미 로그인되어 있습니다");

  const startedAt = Date.now();
  while (Date.now() - startedAt < 12_000) {
    if (await loggedInNotice.isVisible().catch(() => false)) {
      await page.goto("/me");
      return;
    }

    if (await emailField.isVisible().catch(() => false)) {
      await page.waitForTimeout(500);
      if (await loggedInNotice.isVisible().catch(() => false)) {
        await page.goto("/me");
        return;
      }
      break;
    }

    await page.waitForTimeout(250);
  }

  await fillIfVisible(page, "#email", account.email);
  await fillIfVisible(page, "#password", account.password);
  await clickSubmit(page, "로그인");

  try {
    await page.waitForURL("**/me", { timeout: 12_000 });
  } catch {
    const bodyText = await page.locator("body").innerText();
    if (bodyText.includes("로그인에 실패")) {
      throw new Error(`로그인 실패. 화면 안내: ${bodyText.slice(0, 240)}`);
    }
    throw new Error("로그인 후 내정보 화면으로 이동하지 않았습니다.");
  }
}

export async function saveProfile(page: Page, nickname: string) {
  await page.goto("/me");
  await fillIfVisible(page, "#nickname", nickname);
  await fillIfVisible(page, "#region", "경기 화성");
  await fillIfVisible(page, "#interested_trade", "전기");
  await fillIfVisible(page, "#available_trades", "전기, 조공");
  await fillIfVisible(page, "#owned_tools", "안전화, 공구벨트");
  await page.locator("#bio").fill("JOBDAY 자동 검수용 프로필입니다.");
  await clickSubmit(page, "저장");
  await expect(page.locator("body")).toContainText("프로필을 저장했습니다.");
}

type PostResult = {
  title: string;
  url: string;
};

async function waitForCreatedPost(page: Page, title: string) {
  try {
    await expect(page.locator("body")).toContainText("저장됐습니다.");
    await page.getByRole("link", { name: "작성한 글 보기" }).click();
    await page.waitForURL(/\/posts\/[0-9a-f-]+$/, { timeout: 20_000 });
  } catch {
    const bodyText = await page.locator("body").innerText().catch(() => "");
    throw new Error(`글 저장 후 상세 페이지로 이동하지 않았습니다. 현재 주소: ${page.url()} / 화면 안내: ${bodyText.slice(0, 1000)}`);
  }

  await expect(page.locator("body")).toContainText(title);
}

async function completeCommonPostFields(page: Page, title: string) {
  await fillIfVisible(page, "#title", title);
  await page.locator("#body").fill(`${title}\n자동 검수용 게시글입니다.`);
}

export async function createWorkRaidPost(page: Page, boardSlug = "work-raid", prefix = "작업레이드") {
  const title = `${prefix} 자동검수 ${Date.now()}`;
  await page.goto(`/boards/${boardSlug}/new`);
  await expect(page.locator("#board_slug")).toHaveValue(boardSlug);
  await completeCommonPostFields(page, title);
  await fillIfVisible(page, "#extra-site_region", "경기 평택");
  await fillIfVisible(page, "#extra-work_date", "2026-07-06");
  await fillIfVisible(page, "#extra-trade", "타일");
  await fillIfVisible(page, "#extra-needed_count", "2");
  await fillIfVisible(page, "#extra-daily_pay", "180000");
  await fillIfVisible(page, "#extra-contact_method", "댓글 후 연락");

  const departure = page.locator("#extra-departure_region");
  if (await departure.isVisible()) {
    await departure.fill("울산 남구");
  }

  const lodging = page.locator("#extra-lodging_provided");
  if (await lodging.isVisible()) {
    await lodging.check();
  }

  const transportation = page.locator("#extra-transportation_provided");
  if (boardSlug === "remote-raid" && (await transportation.isVisible())) {
    await transportation.check();
  }

  const rideShare = page.locator("#extra-ride_share_available");
  if (boardSlug === "remote-raid" && (await rideShare.isVisible())) {
    await rideShare.check();
  }

  const beginner = page.locator("#extra-beginner_ok");
  if (await beginner.isVisible()) {
    await beginner.check();
  }

  await clickSubmit(page, boardSlug === "remote-raid" ? "원정레이드 올리기" : "작업레이드 올리기");
  await waitForCreatedPost(page, title);
  return { title, url: page.url() } satisfies PostResult;
}

export async function createDimodoPost(page: Page) {
  const title = `보조 자동검수 ${Date.now()}`;
  await page.goto("/boards/dimodo/new");
  await completeCommonPostFields(page, title);
  await fillIfVisible(page, "#extra-site_region", "인천 송도");
  await fillIfVisible(page, "#extra-work_date", "2026-07-06");
  await fillIfVisible(page, "#extra-trade", "보조");
  await fillIfVisible(page, "#extra-needed_count", "1");
  await fillIfVisible(page, "#extra-daily_pay", "160000");
  await fillIfVisible(page, "#extra-contact_method", "댓글 확인");
  await clickSubmit(page, "보조 구인글 올리기");
  await waitForCreatedPost(page, title);
  return { title, url: page.url() } satisfies PostResult;
}

export async function createAvailableTodayPost(page: Page) {
  const title = `오늘일당가능 자동검수 ${Date.now()}`;
  await page.goto("/boards/available-today/new");
  await completeCommonPostFields(page, title);
  await fillIfVisible(page, "#extra-available_region", "서울 남부");
  await fillIfVisible(page, "#extra-available_date", "2026-07-06");
  await fillIfVisible(page, "#extra-available_trade", "전기 조공");
  await fillIfVisible(page, "#extra-desired_pay", "170000");
  await fillIfVisible(page, "#extra-contact_method", "댓글 후 문자");
  await page.locator("#extra-can_travel").check();
  await clickSubmit(page, "일당 가능글 올리기");
  await waitForCreatedPost(page, title);
  return { title, url: page.url() } satisfies PostResult;
}

export async function createToolMarketPost(page: Page, transactionType = "판매", price = "90000") {
  const title = `공구장터 ${transactionType} 자동검수 ${Date.now()}`;
  await page.goto("/write?board=tool-market");
  await completeCommonPostFields(page, title);
  await fillIfVisible(page, "#extra-tool_name", "밀워키 임팩");
  await page.locator("#extra-transaction_type").selectOption(transactionType);
  await fillIfVisible(page, "#extra-price", price);
  await fillIfVisible(page, "#extra-condition", "사용감 있음");
  await fillIfVisible(page, "#extra-market_region", "경기 수원");
  await fillIfVisible(page, "#extra-contact_method", "댓글 후 연락");
  await clickSubmit(page, "공구글 올리기");
  await waitForCreatedPost(page, title);
  return { title, url: page.url() } satisfies PostResult;
}

export async function createMaterialsPost(page: Page) {
  const title = `자재 무료나눔 자동검수 ${Date.now()}`;
  await page.goto("/write?board=materials");
  await completeCommonPostFields(page, title);
  await fillIfVisible(page, "#extra-material_name", "석고보드");
  await fillIfVisible(page, "#extra-quantity", "12장");
  await fillIfVisible(page, "#extra-price", "0");
  await fillIfVisible(page, "#extra-market_region", "부산 사상");
  await fillIfVisible(page, "#extra-contact_method", "댓글 확인");
  await page.locator("#extra-direct_trade").check();
  await clickSubmit(page, "자재글 올리기");
  await waitForCreatedPost(page, title);
  return { title, url: page.url() } satisfies PostResult;
}
