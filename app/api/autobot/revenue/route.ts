import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/autobot/supabaseClient';
import { Revenue } from '../../../../types/autobot';

// 모든 수익 데이터 조회 또는 데이터 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  let query = supabase.from("revenue").select("*");

  if (source) {
    query = query.eq("source", source);
  }
  if (startDate) {
    query = query.gte("date", startDate);
  }
  if (endDate) {
    query = query.lte("date", endDate);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const revenueData: Omit<Revenue, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("revenue").insert(revenueData).select();

  if (error) {
    console.error("Error creating revenue data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 수익 데이터 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/revenue/[id]/route.ts 로 사용될 예정입니다.
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("revenue").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Revenue data not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<Revenue> = await req.json();
  const { data, error } = await supabase.from("revenue").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating revenue data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Revenue data not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("revenue").delete().eq("id", id);

  if (error) {
    console.error("Error deleting revenue data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Revenue data deleted successfully" }, { status: 204 });
}
