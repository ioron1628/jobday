import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AuditLogInput = {
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function recordAuditLog(supabase: SupabaseClient, input: AuditLogInput) {
  const { data, error } = await supabase.rpc("record_audit_log", {
    action_input: input.action,
    entity_type_input: input.entityType,
    entity_id_input: input.entityId ?? null,
    metadata_input: input.metadata ?? {}
  });

  if (error) {
    throw new Error("관리자 활동 기록을 저장하지 못했습니다.");
  }

  return data as string;
}

