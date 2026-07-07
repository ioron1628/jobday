export function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function formatDay(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}

export function formatMoney(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  const number = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(number)) return String(value);
  return `${number.toLocaleString("ko-KR")}원`;
}

export function isActiveUntil(value: string | null | undefined) {
  if (!value) return false;
  return new Date(value).getTime() > Date.now();
}

export function asText(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "예" : "아니오";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
