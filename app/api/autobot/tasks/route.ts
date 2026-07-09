import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../jobday_autobot_supabase_client';
import { Task } from '../../jobday_autobot_types';

// 모든 작업 조회 또는 작업 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agent_id");

  let query = supabase.from("tasks").select("*");

  if (agentId) {
    query = query.eq("agent_id", agentId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const task: Omit<Task, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("tasks").insert(task).select();

  if (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 작업 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/tasks/[id]/route.ts 로 사용될 예정입니다.
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<Task> = await req.json();
  const { data, error } = await supabase.from("tasks").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "Task not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Task deleted successfully" }, { status: 204 });
}

// 작업 실행 API (예시)
export async function POST_RUN(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  // 실제 작업 실행 로직 (예: 글봇이 SNS에 글을 올리는 등)
  console.log(`Executing task ${id}`);
  // 여기에 실제 에이전트 실행 로직을 추가합니다.
  // 예를 들어, 큐에 작업을 추가하거나, 다른 마이크로서비스를 호출할 수 있습니다.
  const { error } = await supabase.from("tasks").update({ status: "running" }).eq("id", id);

  if (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: `Task ${id} started successfully` });
}
