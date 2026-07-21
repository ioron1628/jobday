import { NextRequest, NextResponse } from "next/server";

type FeatureKey = "community" | "jobs" | "shop" | "business_ads" | "membership";

const protectedFeatureRoutes: Array<{
  key: FeatureKey;
  prefixes: string[];
}> = [
  { key: "community", prefixes: ["/boards", "/posts", "/write"] },
  { key: "jobs", prefixes: ["/jobs"] },
  { key: "shop", prefixes: ["/shop", "/skills"] },
  { key: "business_ads", prefixes: ["/business"] },
  { key: "membership", prefixes: ["/membership"] }
];

function isEnabled(key: FeatureKey) {
  const value = process.env[`JOBDAY_FEATURE_${key.toUpperCase()}`]?.trim().toLowerCase();
  return ["1", "true", "yes", "on", "enabled"].includes(value ?? "");
}

function disabledFeatureForPath(pathname: string) {
  return protectedFeatureRoutes.find((feature) => feature.prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) && !isEnabled(feature.key));
}

function notFoundResponse() {
  return new NextResponse("찾을 수 없는 페이지입니다.", {
    status: 404,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
}

// Autobot은 전용 관리자 인증과 RLS가 준비될 때까지 운영 경로에 노출하지 않는다.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/autobot")) {
    return NextResponse.json(
      { error: "현재 운영 준비 중인 기능입니다." },
      { status: 503 }
    );
  }

  if (request.nextUrl.pathname.startsWith("/autobot")) {
    return notFoundResponse();
  }

  if (disabledFeatureForPath(request.nextUrl.pathname)) {
    return notFoundResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/autobot/:path*",
    "/api/autobot/:path*",
    "/boards/:path*",
    "/posts/:path*",
    "/write",
    "/write/:path*",
    "/jobs",
    "/jobs/:path*",
    "/shop",
    "/shop/:path*",
    "/skills",
    "/skills/:path*",
    "/business",
    "/business/:path*",
    "/membership",
    "/membership/:path*"
  ]
};
