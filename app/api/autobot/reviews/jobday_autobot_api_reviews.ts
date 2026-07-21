import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/autobot/supabaseClient";
import type { Review } from "@/types/autobot";

// 모든 검수 항목 조회 또는 검수 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("task_id");
  const reviewerId = searchParams.get("reviewer_id");

  let query = supabase.from("reviews").select("*");

  if (taskId) {
    query = query.eq("task_id", taskId);
  }
  if (reviewerId) {
    query = query.eq("reviewer_id", reviewerId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const review: Omit<Review, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("reviews").insert(review).select();

  if (error) {
    console.error("Error creating review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 검수 항목 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/reviews/[id]/route.ts 로 사용될 예정입니다.
async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("reviews").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<Review> = await req.json();
  const { data, error } = await supabase.from("reviews").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Review not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("reviews").delete().eq("id", id);

  if (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Review deleted successfully" }, { status: 204 });
}
