import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../jobday_autobot_supabase_client';
import { SeoAnalytics } from '../../jobday_autobot_types';

// 모든 SEO 분석 데이터 조회 또는 데이터 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  let query = supabase.from("seo_analytics").select("*");

  if (keyword) {
    query = query.ilike("keyword", `%${keyword}%`);
  }
  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching SEO analytics:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const seoData: Omit<SeoAnalytics, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("seo_analytics").insert(seoData).select();

  if (error) {
    console.error("Error creating SEO analytics data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 SEO 분석 데이터 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/analytics/seo/[id]/route.ts 로 사용될 예정입니다.
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("seo_analytics").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching SEO analytics data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "SEO analytics data not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<SeoAnalytics> = await req.json();
  const { data, error } = await supabase.from("seo_analytics").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating SEO analytics data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "SEO analytics data not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("seo_analytics").delete().eq("id", id);

  if (error) {
    console.error("Error deleting SEO analytics data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "SEO analytics data deleted successfully" }, { status: 204 });
}
