import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) {
      process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
    }
  }
}

function ok(label) {
  console.log(`- ${label}: 성공`);
}

function fail(label, reason) {
  console.log(`- ${label}: 실패, 이유: ${reason}`);
  process.exitCode = 1;
}

function info(label, message) {
  console.log(`- ${label}: 안내, ${message}`);
}

function warn(label, reason) {
  console.log(`- ${label}: 확인 필요, 이유: ${reason}`);
}

loadEnv();

console.log("\nJOBDAY Supabase 연결 상태를 확인합니다.\n");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  fail(".env.local", "Supabase 주소 또는 anon key가 없습니다.");
  console.log("\n.env.local에 NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY를 넣어주세요.\n");
  process.exit();
}

ok(".env.local");

if (process.env.QA_TEST_EMAIL && process.env.QA_TEST_PASSWORD) {
  ok("자동 검수용 테스트 계정");
} else {
  info("자동 검수용 테스트 계정", "고정 계정이 없어도 e2e가 새 검수 계정을 만들어 확인합니다. Supabase 이메일 확인을 다시 켜면 고정 계정을 넣어주세요.");
}

const supabase = createClient(url, anonKey);

const requiredOccupations = [
  "logistics-night",
  "site-helper",
  "remote-field",
  "store-shift",
  "field-trade",
  "freelance-workday"
];

const occupationResult = await supabase.from("occupations").select("slug,name,status").order("sort_order", { ascending: true });
if (occupationResult.error) {
  fail("직업 허브 DB", "Phase 0 migration이 실행되지 않았거나 Supabase 연결값이 다릅니다.");
} else {
  const slugs = new Set((occupationResult.data ?? []).map((occupation) => occupation.slug));
  const missing = requiredOccupations.filter((slug) => !slugs.has(slug));
  if (missing.length) {
    fail("직업 seed", `빠진 직업: ${missing.join(", ")}`);
  } else {
    ok("직업 seed 6개");
  }
}

const featureFlagResult = await supabase.from("feature_flags").select("flag_key,is_enabled");
if (featureFlagResult.error) {
  fail("Feature Flag DB", "feature_flags 테이블을 읽지 못했습니다. Phase 0 migration을 실행해주세요.");
} else {
  const flags = new Map((featureFlagResult.data ?? []).map((flag) => [flag.flag_key, flag.is_enabled]));
  const phase0PublicFlags = ["media", "internal_apply"];
  const gatedFlags = [
    "occupation_follow",
    "community",
    "controlled_beta_community",
    "jobs",
    "controlled_beta_jobs",
    "shop",
    "controlled_beta_commerce",
    "business_ads",
    "adsense_slots",
    "design_concepts",
    "b2b_command_center",
    "membership",
    "multilingual",
    "native_payments"
  ];
  const requiredFlags = [...phase0PublicFlags, ...gatedFlags];
  const missing = requiredFlags.filter((key) => !flags.has(key));
  if (missing.length) {
    fail("Feature Flag seed", `빠진 flag: ${missing.join(", ")}`);
  } else if (phase0PublicFlags.some((key) => flags.get(key) !== true)) {
    fail("Phase 0 공개 flag", "media와 internal_apply는 true여야 합니다.");
  } else if (gatedFlags.some((key) => flags.get(key) !== false)) {
    fail("검증 전 기능 flag", "직업 팔로우, Community, Jobs, Shop, Ads, Membership 등은 기본값 false여야 합니다.");
  } else {
    ok("Feature Flag 기본값");
  }
}

const communityEnabled = ["1", "true", "yes", "on", "enabled"].includes((process.env.JOBDAY_FEATURE_COMMUNITY ?? "").trim().toLowerCase());

if (!communityEnabled) {
  info("커뮤니티 DB 점검", "Phase 0 기본값에서는 커뮤니티가 비공개이므로 게시판/글/이미지 점검은 건너뜁니다.");
} else {
  const requiredSlugs = [
    "free",
    "work-raid",
    "remote-raid",
    "dimodo",
    "available-today",
    "tool-market",
    "materials",
    "beginner",
    "questions",
    "company-jobs",
    "notices"
  ];

  const boardResult = await supabase.from("boards").select("slug,name").order("sort_order", { ascending: true });
  if (boardResult.error) {
    fail("게시판 DB 연결", "community flag를 켰지만 boards 테이블을 읽지 못했습니다.");
  } else {
    const slugs = new Set((boardResult.data ?? []).map((board) => board.slug));
    const missing = requiredSlugs.filter((slug) => !slugs.has(slug));
    if (missing.length) {
      fail("게시판 11개", `빠진 게시판: ${missing.join(", ")}`);
    } else {
      ok("게시판 11개");
    }
  }

  const regionResult = await supabase.from("regions").select("id", { count: "exact", head: true });
  if (regionResult.error) {
    fail("지역 태그", "regions 테이블을 읽지 못했습니다.");
  } else {
    ok("지역 태그");
  }

  const tradeResult = await supabase.from("trades").select("id", { count: "exact", head: true });
  if (tradeResult.error) {
    fail("직종 태그", "trades 테이블을 읽지 못했습니다.");
  } else {
    ok("직종 태그");
  }

  const postResult = await supabase.from("posts").select("id", { count: "exact", head: true });
  if (postResult.error) {
    fail("게시글 저장소", "posts 테이블을 읽지 못했습니다.");
  } else {
    ok("게시글 저장소");
  }

  const storageResult = await supabase.storage.from("post-images").list("", { limit: 1 });
  if (storageResult.error) {
    warn("이미지 저장소", "post-images 버킷이 없거나 익명 조회가 제한되어 있습니다. 글쓰기 이미지 업로드 테스트에서 다시 확인하세요.");
  } else {
    ok("이미지 저장소 post-images");
  }
}

if (!process.exitCode) {
  console.log("\nSupabase Phase 0 기본 연결은 정상입니다.\n");
}
