import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../jobday_autobot_supabase_client';
import { Agent } from '../../jobday_autobot_types';

// 모든 에이전트 조회 또는 에이전트 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentType = searchParams.get("type");

  let query = supabase.from("agents").select("*");

  if (agentType) {
    query = query.eq("type", agentType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const agent: Omit<Agent, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("agents").insert(agent).select();

  if (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 에이전트 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/agents/[id]/route.ts 로 사용될 예정입니다.
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("agents").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<Agent> = await req.json();
  const { data, error } = await supabase.from("agents").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Agent not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("agents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Agent deleted successfully" }, { status: 204 });
}
