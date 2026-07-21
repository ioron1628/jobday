import { NextRequest, NextResponse } from 'next/server';
import { supabase } from "@/lib/autobot/supabaseClient";
import type { Schedule } from "@/types/autobot";

// 모든 스케줄 조회 또는 스케줄 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agent_id");

  let query = supabase.from("schedules").select("*");

  if (agentId) {
    query = query.eq("agent_id", agentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const schedule: Omit<Schedule, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("schedules").insert(schedule).select();

  if (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 스케줄 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/schedules/[id]/route.ts 로 사용될 예정입니다.
async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("schedules").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Schedule not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<Schedule> = await req.json();
  const { data, error } = await supabase.from("schedules").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Schedule not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("schedules").delete().eq("id", id);

  if (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Schedule deleted successfully" }, { status: 204 });
}
