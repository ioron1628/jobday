import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../jobday_autobot_supabase_client';
import { SnsDistribution } from '../../jobday_autobot_types';

// 모든 SNS 배포 기록 조회 또는 기록 생성
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("task_id");
  const platform = searchParams.get("platform");

  let query = supabase.from("sns_distributions").select("*");

  if (taskId) {
    query = query.eq("task_id", taskId);
  }
  if (platform) {
    query = query.eq("platform", platform);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching SNS distributions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const snsDistribution: Omit<SnsDistribution, "id" | "created_at"> = await req.json();
  const { data, error } = await supabase.from("sns_distributions").insert(snsDistribution).select();

  if (error) {
    console.error("Error creating SNS distribution:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0], { status: 201 });
}

// 특정 SNS 배포 기록 조회, 수정, 삭제 (동적 라우트)
// 이 파일은 /app/api/autobot/sns/[id]/route.ts 로 사용될 예정입니다.
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase.from("sns_distributions").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching SNS distribution:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "SNS distribution not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const updates: Partial<SnsDistribution> = await req.json();
  const { data, error } = await supabase.from("sns_distributions").update(updates).eq("id", id).select();

  if (error) {
    console.error("Error updating SNS distribution:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data || data.length === 0) {
    return NextResponse.json({ error: "SNS distribution not found or no changes" }, { status: 404 });
  }

  return NextResponse.json(data[0]);
}

export async function DELETE_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { error } = await supabase.from("sns_distributions").delete().eq("id", id);

  if (error) {
    console.error("Error deleting SNS distribution:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "SNS distribution deleted successfully" }, { status: 204 });
}
