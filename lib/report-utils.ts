import { REPORT_REASONS } from "@/lib/constants";

export function getReportReason(choice: string) {
  return REPORT_REASONS.find((reason) => reason.key === choice) ?? REPORT_REASONS[REPORT_REASONS.length - 1];
}

export function buildReportDetail(reasonLabel: string, detail: string) {
  const trimmedDetail = detail.trim();
  return trimmedDetail ? `신고 사유: ${reasonLabel}\n${trimmedDetail}` : `신고 사유: ${reasonLabel}`;
}
