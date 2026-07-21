import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type { Board, PostStatus } from "@/types/domain";
import { POST_STATUS_LABELS } from "@/lib/constants";
import { asText, formatMoney } from "@/lib/format";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type IconName =
  | "board"
  | "box"
  | "briefcase"
  | "building"
  | "calendar"
  | "check"
  | "closed"
  | "comment"
  | "compass"
  | "clock"
  | "dots"
  | "droplet"
  | "empty"
  | "eye"
  | "filter"
  | "flag"
  | "grid"
  | "hammer"
  | "helmet"
  | "home"
  | "lightning"
  | "materials"
  | "megaphone"
  | "notice"
  | "pencil"
  | "people"
  | "pin"
  | "play"
  | "plus"
  | "question"
  | "reply"
  | "report"
  | "roller"
  | "search"
  | "sort"
  | "star"
  | "tool"
  | "trade"
  | "truck"
  | "user"
  | "wage"
  | "warning";

function iconContent(name: IconName) {
  switch (name) {
    case "board":
      return (
        <>
          <path d="M4 5h16" />
          <path d="M4 10h16" />
          <path d="M4 15h10" />
          <path d="M4 20h7" />
        </>
      );
    case "box":
      return (
        <>
          <path d="M4 8 12 4l8 4-8 4-8-4Z" />
          <path d="M4 8v8l8 4 8-4V8" />
          <path d="M12 12v8" />
        </>
      );
    case "briefcase":
      return (
        <>
          <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
          <rect x="4" y="7" width="16" height="13" rx="2" />
          <path d="M4 12h16" />
          <path d="M10 12v2h4v-2" />
        </>
      );
    case "building":
      return (
        <>
          <path d="M5 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
          <path d="M3 21h18" />
          <path d="M9 7h1" />
          <path d="M14 7h1" />
          <path d="M9 11h1" />
          <path d="M14 11h1" />
          <path d="M10 21v-5h4v5" />
        </>
      );
    case "calendar":
      return (
        <>
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
          <path d="M4 10h16" />
        </>
      );
    case "check":
      return <path d="m5 12 4 4 10-10" />;
    case "closed":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m9 9 6 6" />
          <path d="m15 9-6 6" />
        </>
      );
    case "comment":
      return (
        <>
          <path d="M5 6h14v9H9l-4 4V6Z" />
          <path d="M8 9h8" />
          <path d="M8 12h5" />
        </>
      );
    case "compass":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="m15 9-2 5-5 2 2-5 5-2Z" />
        </>
      );
    case "clock":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </>
      );
    case "dots":
      return (
        <>
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </>
      );
    case "droplet":
      return (
        <>
          <path d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z" />
          <path d="M9 15a3 3 0 0 0 5 1.6" />
        </>
      );
    case "empty":
      return (
        <>
          <rect x="5" y="5" width="14" height="14" rx="2" />
          <path d="M8 10h8" />
          <path d="M8 14h5" />
        </>
      );
    case "eye":
      return (
        <>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="3" />
        </>
      );
    case "filter":
      return (
        <>
          <path d="M4 6h16" />
          <path d="M7 12h10" />
          <path d="M10 18h4" />
        </>
      );
    case "flag":
      return (
        <>
          <path d="M6 21V4" />
          <path d="M6 5h10l-1.5 4L16 13H6" />
        </>
      );
    case "grid":
      return (
        <>
          <rect x="4" y="4" width="6" height="6" />
          <rect x="14" y="4" width="6" height="6" />
          <rect x="4" y="14" width="6" height="6" />
          <rect x="14" y="14" width="6" height="6" />
        </>
      );
    case "hammer":
      return (
        <>
          <path d="M13 5 9 9" />
          <path d="M8 4h7l2 2-4 4-5-5Z" />
          <path d="M10 11 4 17l3 3 6-6" />
        </>
      );
    case "helmet":
      return (
        <>
          <path d="M4 14a8 8 0 0 1 16 0" />
          <path d="M3 14h18" />
          <path d="M7 14v-2" />
          <path d="M17 14v-2" />
          <path d="M8 18h8" />
        </>
      );
    case "home":
      return (
        <>
          <path d="M4 11 12 4l8 7" />
          <path d="M6 10v10h12V10" />
          <path d="M10 20v-5h4v5" />
        </>
      );
    case "lightning":
      return <path d="M13 3 5 14h6l-1 7 8-12h-6l1-6Z" />;
    case "materials":
      return (
        <>
          <path d="M5 8h14v11H5z" />
          <path d="M8 5h8v3H8z" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </>
      );
    case "megaphone":
      return (
        <>
          <path d="M4 13h3l10 4V7L7 11H4v2Z" />
          <path d="M7 13v5" />
          <path d="M19 9v6" />
        </>
      );
    case "notice":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5" />
          <path d="M12 16h.01" />
        </>
      );
    case "pencil":
      return (
        <>
          <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />
          <path d="m14 7 3 3" />
        </>
      );
    case "people":
      return (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M4 20a5 5 0 0 1 10 0" />
          <path d="M15 11a3 3 0 0 0 0-6" />
          <path d="M17 20a5 5 0 0 0-3-4.5" />
        </>
      );
    case "pin":
      return (
        <>
          <path d="M7 4h10l-2 6 3 3v2H6v-2l3-3-2-6Z" />
          <path d="M12 15v6" />
        </>
      );
    case "play":
      return <path d="m8 5 11 7-11 7V5Z" />;
    case "plus":
      return (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      );
    case "question":
      return (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M9.5 9a2.7 2.7 0 1 1 4 2.4c-.9.5-1.5 1.1-1.5 2.1" />
          <path d="M12 17h.01" />
        </>
      );
    case "reply":
      return (
        <>
          <path d="m9 7-5 5 5 5" />
          <path d="M4 12h10a6 6 0 0 1 6 6" />
        </>
      );
    case "report":
      return (
        <>
          <path d="M12 3 3 20h18L12 3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </>
      );
    case "roller":
      return (
        <>
          <rect x="4" y="5" width="12" height="6" rx="2" />
          <path d="M16 8h2a2 2 0 0 1 2 2v2" />
          <path d="M20 12h-6v4" />
          <path d="M14 16v5" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 4 4" />
        </>
      );
    case "sort":
      return (
        <>
          <path d="M7 5v14" />
          <path d="m4 8 3-3 3 3" />
          <path d="M17 19V5" />
          <path d="m14 16 3 3 3-3" />
        </>
      );
    case "star":
      return <path d="m12 3 2.6 5.7 6.2.7-4.6 4.2 1.3 6.1-5.5-3.1-5.5 3.1 1.3-6.1-4.6-4.2 6.2-.7L12 3Z" />;
    case "tool":
      return (
        <>
          <path d="M14.5 5.5a4 4 0 0 0 4 4L9 19l-4-4 9.5-9.5Z" />
          <path d="M6 16l2 2" />
        </>
      );
    case "trade":
      return (
        <>
          <path d="M4 7h16" />
          <path d="M7 7v13" />
          <path d="M17 7v13" />
          <path d="M5 20h14" />
          <path d="M9 11h6" />
          <path d="M9 15h6" />
        </>
      );
    case "truck":
      return (
        <>
          <path d="M3 7h11v9H3z" />
          <path d="M14 10h4l3 3v3h-7" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="17" cy="18" r="2" />
        </>
      );
    case "user":
      return (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      );
    case "wage":
      return (
        <>
          <rect x="4" y="6" width="16" height="12" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M7 9v.01" />
          <path d="M17 15v.01" />
        </>
      );
    case "warning":
      return (
        <>
          <path d="M12 3 3 21h18L12 3Z" />
          <path d="M12 9v5" />
          <path d="M12 17h.01" />
        </>
      );
  }
}

export function Icon({ name, className, title }: { name: IconName; className?: string; title?: string }) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      className={cx("h-4 w-4 shrink-0", className)}
      fill="none"
      focusable="false"
      role={title ? "img" : undefined}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.9"
      viewBox="0 0 24 24"
    >
      {title ? <title>{title}</title> : null}
      {iconContent(name)}
    </svg>
  );
}

type AppIconTone = "default" | "accent" | "muted" | "success" | "warning" | "danger" | "light";
type AppIconSize = "xs" | "sm" | "md" | "lg";

const appIconToneClass: Record<AppIconTone, string> = {
  default: "text-ink",
  accent: "text-accent",
  muted: "text-muted",
  success: "text-green-700",
  warning: "text-yellow-800",
  danger: "text-red-700",
  light: "text-white"
};

const appIconSizeClass: Record<AppIconSize, string> = {
  xs: "h-3.5 w-3.5",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
};

export function AppIcon({
  name,
  tone = "default",
  size = "sm",
  className,
  title
}: {
  name: IconName;
  tone?: AppIconTone;
  size?: AppIconSize;
  className?: string;
  title?: string;
}) {
  return <Icon name={name} title={title} className={cx(appIconSizeClass[size], appIconToneClass[tone], className)} />;
}

type Tone = "default" | "accent" | "warning" | "danger" | "success" | "dark" | "muted" | "market";

const toneClass: Record<Tone, string> = {
  default: "border-line bg-white text-ink",
  accent: "border-amber-300 bg-amber-50 text-amber-950",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
  danger: "border-red-200 bg-red-50 text-red-700",
  success: "border-green-200 bg-green-50 text-green-800",
  dark: "border-slate-900 bg-slate-900 text-white",
  muted: "border-line bg-soft text-slate-600",
  market: "border-slate-300 bg-slate-50 text-slate-950"
};

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger" | "warning";
type ButtonSize = "sm" | "md" | "lg";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "border-accent bg-accent text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.16)] active:bg-accent-strong",
  secondary: "border-line bg-white text-ink active:bg-amber-50",
  quiet: "border-line bg-soft text-slate-700 active:bg-slate-100",
  danger: "border-red-200 bg-white text-red-700 active:bg-red-50",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-900 active:bg-yellow-100"
};

const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 py-2 text-sm",
  md: "min-h-11 px-3 py-2 text-sm",
  lg: "min-h-12 px-4 py-3 text-base"
};

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function Button({ className, variant = "secondary", size = "md", fullWidth = false, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-sm border font-semibold leading-tight transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-500",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export function ButtonLink({ className, variant = "secondary", size = "md", fullWidth = false, ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cx(
        "inline-flex items-center justify-center rounded-sm border font-semibold leading-tight transition-colors active:translate-y-px",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: ComponentPropsWithoutRef<"input">) {
  return <input className={cx("field-input", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentPropsWithoutRef<"select">) {
  return <select className={cx("field-input", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cx("field-input", className)} {...props} />;
}

export function Badge({ children, tone = "default", className, icon }: { children: ReactNode; tone?: Tone; className?: string; icon?: IconName }) {
  return (
    <span className={cx("badge-base gap-1 border shadow-[inset_0_-1px_0_rgba(17,24,39,0.08)]", toneClass[tone], className)}>
      {icon ? <Icon name={icon} className="h-3.5 w-3.5" /> : null}
      {children}
    </span>
  );
}

type VisualTone = "default" | "work" | "market" | "guide" | "success" | "warning" | "danger" | "dark" | "muted";
type IconFrameSize = "sm" | "md" | "lg";

const iconFrameToneClass: Record<VisualTone, string> = {
  default: "border-line bg-white text-ink",
  work: "border-amber-300 bg-amber-50 text-amber-800",
  market: "border-slate-300 bg-slate-100 text-slate-950",
  guide: "border-yellow-300 bg-yellow-50 text-yellow-900",
  success: "border-green-200 bg-green-50 text-green-800",
  warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
  danger: "border-red-200 bg-red-50 text-red-700",
  dark: "border-slate-900 bg-slate-900 text-white",
  muted: "border-line bg-soft text-slate-600"
};

const iconFrameSizeClass: Record<IconFrameSize, { frame: string; icon: string }> = {
  sm: { frame: "h-7 w-7", icon: "h-4 w-4" },
  md: { frame: "h-9 w-9", icon: "h-5 w-5" },
  lg: { frame: "h-14 w-14", icon: "h-7 w-7" }
};

export function IconFrame({
  icon,
  tone = "default",
  size = "md",
  className
}: {
  icon: IconName;
  tone?: VisualTone;
  size?: IconFrameSize;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "relative isolate inline-flex shrink-0 items-center justify-center overflow-hidden border shadow-[inset_0_-2px_0_rgba(17,24,39,0.08)]",
        iconFrameToneClass[tone],
        iconFrameSizeClass[size].frame,
        className
      )}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/45" />
      <span className="absolute -bottom-2 -right-2 h-5 w-5 border border-current/10 bg-current/5" />
      <Icon name={icon} className={cx("relative", iconFrameSizeClass[size].icon)} />
    </span>
  );
}

function valueText(value: unknown, money = false) {
  const text = money ? formatMoney(value as string | number | null | undefined) : asText(value);
  return text === "-" ? "" : text;
}

export function RegionBadge({ value, className }: { value: unknown; className?: string }) {
  const text = valueText(value);
  if (!text) return null;
  return <Badge tone="default" icon="home" className={className}>지역 {text}</Badge>;
}

export function TradeBadge({ value, className }: { value: unknown; className?: string }) {
  const text = valueText(value);
  if (!text) return null;
  return <Badge tone="accent" icon="trade" className={className}>직종 {text}</Badge>;
}

export function WageBadge({ value, className }: { value: unknown; className?: string }) {
  const text = valueText(value, true);
  if (!text) return null;
  return <Badge tone="warning" icon="wage" className={className}>{text}</Badge>;
}

export function StatusBadge({ status }: { status: PostStatus }) {
  const tone =
    status === "recruiting"
      ? "success"
      : status === "closed"
        ? "muted"
        : status === "hidden"
          ? "danger"
          : "muted";

  const icon = status === "recruiting" ? "check" : status === "closed" ? "closed" : status === "hidden" ? "report" : "closed";

  return <Badge tone={tone} icon={icon} className="font-bold">{POST_STATUS_LABELS[status]}</Badge>;
}

export type ConditionItem = {
  label?: string;
  value: unknown;
  tone?: Tone;
  money?: boolean;
  strong?: boolean;
  icon?: IconName;
};

export function ConditionBadge({ item }: { item: ConditionItem }) {
  const text = valueText(item.value, item.money);
  if (!text) return null;
  return (
    <Badge
      tone={item.tone ?? "default"}
      icon={item.icon}
      className={cx(
        "min-h-7 w-full justify-center px-2 py-1 text-[12px] leading-[1.25] sm:w-auto",
        item.strong && "text-[13px] font-bold"
      )}
    >
      {item.label ? `${item.label} ${text}` : text}
    </Badge>
  );
}

export function JobConditionRow({ items, className }: { items: ConditionItem[]; className?: string }) {
  return (
    <div className={cx("grid grid-cols-2 gap-1.5 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap", className)}>
      {items.map((item, index) => (
        <ConditionBadge key={`${item.label ?? "item"}-${index}`} item={{ tone: "default", ...item }} />
      ))}
    </div>
  );
}

export function MarketConditionRow({ items, className }: { items: ConditionItem[]; className?: string }) {
  return (
    <div className={cx("grid grid-cols-2 gap-1.5 min-[420px]:grid-cols-3 sm:flex sm:flex-wrap", className)}>
      {items.map((item, index) => (
        <ConditionBadge key={`${item.label ?? "item"}-${index}`} item={{ tone: "market", ...item }} />
      ))}
    </div>
  );
}

export function JobRaidListItem({ href, children, anchorId }: { href: string; children: ReactNode; anchorId?: string }) {
  return (
    <PostListItem href={href} variant="job" anchorId={anchorId}>
      {children}
    </PostListItem>
  );
}

export function MarketListItem({ href, children, anchorId }: { href: string; children: ReactNode; anchorId?: string }) {
  return (
    <PostListItem href={href} variant="market" anchorId={anchorId}>
      {children}
    </PostListItem>
  );
}

export function RequiredBadge({ required }: { required: boolean }) {
  return <Badge tone={required ? "accent" : "muted"} icon={required ? "check" : undefined}>{required ? "필수" : "선택"}</Badge>;
}

export function FieldLabel({ htmlFor, label, required = false }: { htmlFor: string; label: string; required?: boolean }) {
  return (
    <label className="mb-1 flex items-center gap-2 text-[15px] font-bold leading-6 text-ink" htmlFor={htmlFor}>
      <span>{label}</span>
      <RequiredBadge required={required} />
    </label>
  );
}

function avatarText(nickname: string) {
  const normalized = nickname.trim() || "익명";
  return Array.from(normalized).slice(0, 2).join("");
}

const avatarToneClasses = [
  "border-slate-900 bg-slate-900 text-white",
  "border-amber-700 bg-amber-700 text-white",
  "border-slate-700 bg-slate-100 text-slate-950",
  "border-green-700 bg-green-50 text-green-800"
];

function avatarToneIndex(nickname: string) {
  const normalized = nickname.trim() || "익명";
  return Array.from(normalized).reduce((sum, char) => sum + char.codePointAt(0)!, 0) % avatarToneClasses.length;
}

export function UserAvatar({ nickname, className }: { nickname: string; className?: string }) {
  return (
    <span
      className={cx(
        "relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden border text-[12px] font-bold leading-none shadow-[inset_0_-2px_0_rgba(17,24,39,0.14)]",
        avatarToneClasses[avatarToneIndex(nickname)],
        className
      )}
    >
      <span className="absolute inset-x-0 top-0 h-1/2 bg-white/20" />
      <span className="relative">{avatarText(nickname)}</span>
      <span className="absolute bottom-0 right-0 h-2 w-2 border border-white bg-accent" />
    </span>
  );
}

export function ProfileAvatar({ nickname, className }: { nickname: string; className?: string }) {
  return <UserAvatar nickname={nickname} className={className} />;
}

function roleIcon(label: string, premium?: boolean): IconName {
  if (premium) return "building";
  if (label.includes("공구")) return "tool";
  if (label.includes("자재")) return "box";
  if (label.includes("댓글")) return "comment";
  if (label.includes("원정")) return "compass";
  if (label.includes("초보")) return "flag";
  if (label.includes("반장")) return "helmet";
  if (label.includes("전기")) return "lightning";
  if (label.includes("타일")) return "grid";
  if (label.includes("목공")) return "hammer";
  if (label.includes("설비")) return "droplet";
  if (label.includes("도배")) return "roller";
  if (label.includes("철거")) return "hammer";
  return "user";
}

function roleTone(label: string, premium?: boolean): Tone {
  if (premium) return "warning";
  if (label.includes("공구") || label.includes("자재")) return "market";
  if (label.includes("원정") || label.includes("반장")) return "accent";
  if (label.includes("초보")) return "warning";
  if (label.includes("댓글")) return "muted";
  if (label.includes("전기") || label.includes("타일") || label.includes("목공") || label.includes("설비")) return "accent";
  return "muted";
}

export function RoleBadge({ label, premium = false }: { label?: string | null; premium?: boolean }) {
  const text = premium ? "사업자 정보 등록" : label?.trim();
  if (!text) return null;

  return (
    <Badge tone={roleTone(text, premium)} icon={roleIcon(text, premium)} className="px-1.5 py-0.5 text-[11px]">
      {text}
    </Badge>
  );
}

export function UserRoleBadge(props: { label?: string | null; premium?: boolean }) {
  return <RoleBadge {...props} />;
}

export function AuthorIdentity({
  nickname,
  roleLabel,
  premium = false,
  className
}: {
  nickname: string;
  roleLabel?: string | null;
  premium?: boolean;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex min-w-0 items-center gap-2", className)}>
      <UserAvatar nickname={nickname} />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold leading-5 text-ink">{nickname}</span>
        <span className="mt-0.5 block">
          <RoleBadge label={roleLabel} premium={premium} />
        </span>
      </span>
    </span>
  );
}

export function ErrorMessage({ children, tone = "danger" }: { children: ReactNode; tone?: "danger" | "success" | "warning" | "muted" }) {
  const classes = {
    danger: "border-red-200 bg-red-50 text-red-700",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
    muted: "border-line bg-soft text-slate-700"
  };

  const icon = tone === "danger" ? "report" : tone === "success" ? "check" : tone === "warning" ? "warning" : "notice";

  return (
    <p className={cx("flex items-start gap-2 rounded-sm border p-3 text-sm font-medium leading-6", classes[tone])}>
      <Icon name={icon} className="mt-0.5 h-4 w-4" />
      <span>{children}</span>
    </p>
  );
}

export function ToastMessage({ children, tone = "success" }: { children: ReactNode; tone?: "danger" | "success" | "warning" | "muted" }) {
  const classes = {
    danger: "border-red-200 bg-red-50 text-red-700",
    success: "border-green-200 bg-green-50 text-green-800",
    warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
    muted: "border-line bg-white text-slate-700"
  };

  const icon = tone === "danger" ? "report" : tone === "success" ? "check" : tone === "warning" ? "warning" : "notice";

  return (
    <div
      aria-live="polite"
      className={cx(
        "fixed bottom-20 left-1/2 z-50 flex w-[calc(100%-24px)] max-w-sm -translate-x-1/2 items-start gap-2 rounded-sm border px-3 py-2 text-sm font-bold leading-6 shadow-[0_10px_28px_rgba(17,24,39,0.16)] sm:bottom-6",
        classes[tone]
      )}
      role="status"
    >
      <Icon name={icon} className="mt-0.5 h-4 w-4" />
      <span>{children}</span>
    </div>
  );
}

export function ErrorState({
  title = "문제가 생겼습니다",
  body,
  actionHref,
  actionLabel
}: {
  title?: string;
  body?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <NoticeBox tone="danger" title={title} className="p-5">
      {body ? <p>{body}</p> : null}
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} size="sm" className="mt-3">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </NoticeBox>
  );
}

export function NoticeBox({
  children,
  title,
  tone = "warning",
  collapsible = false,
  className
}: {
  children: ReactNode;
  title?: string;
  tone?: "warning" | "muted" | "danger" | "success";
  collapsible?: boolean;
  className?: string;
}) {
  const classes = {
    warning: "border-yellow-300 bg-yellow-50 text-yellow-900",
    muted: "border-line bg-soft text-slate-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    success: "border-green-200 bg-green-50 text-green-800"
  };
  const icon = tone === "danger" ? "report" : tone === "success" ? "check" : tone === "warning" ? "warning" : "notice";

  if (collapsible) {
    return (
      <details className={cx("rounded-sm border p-3 text-sm font-medium leading-6", classes[tone], className)}>
        <summary className="flex cursor-pointer items-center gap-2 text-base font-bold">
          <Icon name={icon} className="h-4 w-4" />
          <span>{title}</span>
        </summary>
        <div className="mt-2 space-y-2">{children}</div>
      </details>
    );
  }

  return (
    <section className={cx("rounded-sm border p-3 text-sm font-medium leading-6", classes[tone], className)}>
      <div className="flex items-start gap-2">
        <Icon name={icon} className="mt-1 h-4 w-4" />
        <div className="min-w-0 flex-1">
          {title ? <h2 className="mb-1 text-base font-bold">{title}</h2> : null}
          {children}
        </div>
      </div>
    </section>
  );
}

function sectionIcon(title: string): IconName {
  if (title.includes("검색")) return "search";
  if (title.includes("작업") || title.includes("구인")) return "lightning";
  if (title.includes("원정")) return "compass";
  if (title.includes("보조") || title.includes("일당")) return "briefcase";
  if (title.includes("공구")) return "tool";
  if (title.includes("자재")) return "box";
  if (title.includes("공지")) return "notice";
  if (title.includes("게시판") || title.includes("자유")) return "board";
  if (title.includes("초보") || title.includes("입문")) return "flag";
  if (title.includes("광고") || title.includes("상단")) return "megaphone";
  return "board";
}

function sectionTone(title: string): VisualTone {
  if (title.includes("작업") || title.includes("구인") || title.includes("보조") || title.includes("일당")) return "work";
  if (title.includes("공구") || title.includes("자재") || title.includes("거래")) return "market";
  if (title.includes("초보") || title.includes("입문")) return "guide";
  if (title.includes("공지") || title.includes("안내")) return "muted";
  if (title.includes("광고") || title.includes("상단")) return "warning";
  return "default";
}

export function SectionHeader({
  title,
  count,
  actionHref,
  actionLabel,
  className,
  icon
}: {
  title: string;
  count?: string | number;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  icon?: IconName;
}) {
  const visualIcon = icon ?? sectionIcon(title);

  return (
    <div className={cx("section-strip", className)}>
      <h2 className="flex items-center gap-2 text-[19px] font-bold leading-[1.3] text-ink">
        <IconFrame icon={visualIcon} tone={sectionTone(title)} size="sm" />
        <span>{title}</span>
      </h2>
      <div className="flex items-center gap-2">
        {count !== undefined ? <span className="text-sm font-semibold text-ink">{count}</span> : null}
        {actionHref && actionLabel ? (
          <Link href={actionHref} className="text-sm font-semibold text-accent">
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function SidebarCard({ title, children, actionHref, actionLabel }: { title: string; children: ReactNode; actionHref?: string; actionLabel?: string }) {
  return (
    <section className="sidebar-card">
      <SectionHeader title={title} actionHref={actionHref} actionLabel={actionLabel} />
      <div>{children}</div>
    </section>
  );
}

export function LoadingState({ title = "불러오는 중입니다", body }: { title?: string; body?: string }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <section className="rounded-sm border border-line bg-white p-3">
        <div className="flex items-start gap-3">
          <IconFrame icon="search" tone="muted" size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-[1.35] text-ink">{title}</p>
            {body ? <p className="mt-1 text-sm font-medium leading-5 text-muted">{body}</p> : null}
          </div>
        </div>
      </section>
      <div className="space-y-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="border border-line bg-white p-3">
            <div className="flex gap-2">
              <span className="h-7 w-16 animate-pulse bg-soft" />
              <span className="h-7 w-20 animate-pulse bg-soft" />
              <span className="h-7 w-14 animate-pulse bg-soft" />
            </div>
            <div className="mt-3 h-5 w-4/5 animate-pulse bg-soft" />
            <div className="mt-2 h-4 w-2/3 animate-pulse bg-soft" />
          </div>
        ))}
      </div>
    </div>
  );
}

function emptyIcon(title: string): IconName {
  if (title.includes("공구")) return "tool";
  if (title.includes("자재")) return "box";
  if (title.includes("댓글")) return "comment";
  if (title.includes("검색")) return "search";
  if (title.includes("공지")) return "notice";
  if (title.includes("게시판")) return "board";
  if (title.includes("작업")) return "lightning";
  return "empty";
}

function emptyTone(title: string): VisualTone {
  if (title.includes("작업")) return "work";
  if (title.includes("공구") || title.includes("자재") || title.includes("거래")) return "market";
  if (title.includes("댓글") || title.includes("검색")) return "muted";
  if (title.includes("공지") || title.includes("안내")) return "guide";
  return "default";
}

function EmptyVisual({ icon, tone, compact = false }: { icon: IconName; tone: VisualTone; compact?: boolean }) {
  return (
    <span className={cx("relative inline-flex shrink-0 items-center justify-center", compact ? "h-10 w-10" : "h-16 w-16")}>
      <span className="absolute inset-0 border border-line-strong bg-white" />
      <span className="absolute left-1 top-1 h-2 w-2 border border-line bg-soft" />
      <span className="absolute bottom-1 right-1 h-2 w-5 border border-line bg-soft" />
      <IconFrame icon={icon} tone={tone} size={compact ? "md" : "lg"} className="relative" />
    </span>
  );
}

export function EmptyState({
  title,
  body,
  href,
  actionLabel
}: {
  title: string;
  body?: string;
  href?: string;
  actionLabel?: string;
}) {
  const icon = emptyIcon(title);
  const tone = emptyTone(title);

  return (
    <section className="rounded-sm border border-line bg-soft p-6 text-center text-sm font-medium leading-6 text-slate-700">
      <span className="mx-auto mb-3 block">
        <EmptyVisual icon={icon} tone={tone} />
      </span>
      <p className="text-lg font-bold leading-[1.35] text-ink">{title}</p>
      {body ? <p className="mt-2 text-base font-medium leading-7 text-muted">{body}</p> : null}
      {href && actionLabel ? (
        <ButtonLink href={href} variant="primary" size="lg" className="mt-4">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </section>
  );
}

export function CompactEmptyState({
  title,
  body,
  href,
  actionLabel,
  icon
}: {
  title: string;
  body?: string;
  href?: string;
  actionLabel?: string;
  icon?: IconName;
}) {
  const visualIcon = icon ?? emptyIcon(title);
  const tone = emptyTone(title);

  return (
    <section className="flex items-start gap-3 border border-line bg-soft p-3 text-sm font-medium leading-6 text-slate-700">
      <EmptyVisual icon={visualIcon} tone={tone} compact />
      <div className="min-w-0 flex-1">
        <p className="text-base font-bold leading-6 text-ink">{title}</p>
        {body ? <p className="mt-0.5 text-sm font-medium leading-5 text-muted">{body}</p> : null}
        {href && actionLabel ? (
          <ButtonLink href={href} size="sm" variant="primary" className="mt-2">
            {actionLabel}
          </ButtonLink>
        ) : null}
      </div>
    </section>
  );
}

export function MobileStickyAction({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("mobile-fixed-action", className)}>{children}</div>;
}

const categoryLabel: Record<string, string> = {
  free: "자유",
  work: "일거리",
  market: "장터",
  guide: "입문",
  question: "질문",
  company: "업체",
  notice: "공지"
};

function boardIconName(board: Pick<Board, "slug" | "category">): IconName {
  if (board.slug === "work-raid") return "lightning";
  if (board.slug === "remote-raid") return "compass";
  if (board.slug === "dimodo") return "people";
  if (board.slug === "available-today") return "clock";
  if (board.slug === "tool-market") return "tool";
  if (board.slug === "materials") return "box";
  if (board.slug === "beginner") return "flag";
  if (board.slug === "questions") return "comment";
  if (board.slug === "notices" || board.category === "notice") return "pin";
  if (board.category === "company") return "building";
  if (board.category === "market") return "tool";
  if (board.category === "work") return "lightning";
  return "board";
}

function boardVisualTone(board: Pick<Board, "slug" | "category">): VisualTone {
  if (board.slug === "tool-market" || board.slug === "materials" || board.category === "market") return "market";
  if (board.slug === "beginner") return "guide";
  if (board.slug === "notices" || board.category === "notice") return "muted";
  if (board.category === "work" || board.category === "company") return "work";
  return "default";
}

export function BoardIcon({ board, className }: { board: Pick<Board, "slug" | "category">; className?: string }) {
  return <Icon name={boardIconName(board)} className={className} />;
}

export function BoardIconFrame({
  board,
  size = "md",
  className
}: {
  board: Pick<Board, "slug" | "category">;
  size?: IconFrameSize;
  className?: string;
}) {
  return <IconFrame icon={boardIconName(board)} tone={boardVisualTone(board)} size={size} className={className} />;
}

export function BoardListItem({ board }: { board: Board }) {
  return (
    <Link key={board.id} href={`/boards/${board.slug}`} className="block min-h-[72px] border-b border-r border-line bg-white p-3 active:bg-amber-50">
      <div className="flex items-start gap-2">
        <BoardIconFrame board={board} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="text-base font-bold leading-[1.35] text-ink sm:text-lg">{board.name}</span>
            <Badge tone="muted" className="px-1.5 py-0.5 text-[11px]">
              {categoryLabel[board.category] ?? board.category}
            </Badge>
          </div>
          <p className="mt-1 line-clamp-1 text-[13px] font-medium leading-5 text-muted">{board.description}</p>
        </div>
      </div>
    </Link>
  );
}

function tradeIconName(label?: string | null): IconName {
  const text = label?.trim() ?? "";
  if (text.includes("타일")) return "grid";
  if (text.includes("목공")) return "hammer";
  if (text.includes("전기")) return "lightning";
  if (text.includes("설비")) return "droplet";
  if (text.includes("도배") || text.includes("장판") || text.includes("페인트")) return "roller";
  if (text.includes("철거")) return "hammer";
  if (text.includes("양중")) return "box";
  if (text.includes("공구")) return "tool";
  if (text.includes("자재")) return "box";
  return "dots";
}

export function TradeIcon({ trade, className }: { trade?: string | null; className?: string }) {
  return <AppIcon name={tradeIconName(trade)} tone="accent" className={className} />;
}

export function QuickMenuButton({
  href,
  title,
  body,
  icon,
  tone = "default",
  primary = false,
  className
}: {
  href: string;
  title: string;
  body?: string;
  icon: IconName;
  tone?: VisualTone;
  primary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "group flex min-h-[60px] items-center gap-2 border px-3 py-2 active:translate-y-px",
        primary ? "border-accent bg-accent-soft" : "border-line bg-white active:bg-amber-50",
        className
      )}
    >
      <IconFrame icon={icon} tone={tone} size="sm" />
      <span className="min-w-0">
        <span className="block text-[15px] font-bold leading-5 text-ink sm:text-base">{title}</span>
        {body ? <span className="mt-0.5 block truncate text-[12px] font-semibold leading-5 text-muted">{body}</span> : null}
      </span>
    </Link>
  );
}

export function BottomNavItem({ href, label, icon }: { href: string; label: string; icon: IconName }) {
  return (
    <Link
      href={href}
      className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold leading-none text-muted active:bg-accent-soft"
    >
      <AppIcon name={icon} tone="default" size="md" className="stroke-[1.6]" />
      <span>{label}</span>
    </Link>
  );
}

export function PostListItem({
  href,
  children,
  variant = "default",
  anchorId
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "job" | "market";
  anchorId?: string;
}) {
  const variantClass = {
    default: "border-l-transparent",
    job: "border-l-accent",
    market: "border-l-slate-900"
  };

  return (
    <article id={anchorId} className={cx("list-row scroll-mt-20 border-l-4", variantClass[variant])}>
      <Link href={href} className="block px-2 py-3">
        {children}
      </Link>
    </article>
  );
}

type SummaryItem = {
  label: string;
  value: unknown;
  money?: boolean;
};

function SummaryPill({ item }: { item: SummaryItem }) {
  return (
    <div className="min-h-12 border-r border-line px-2 py-1.5 last:border-r-0">
      <dt className="text-[12px] font-medium leading-4 text-muted">{item.label}</dt>
      <dd className="mt-0.5 text-base font-bold leading-6 text-ink">
        {item.money ? formatMoney(item.value as string | number | null | undefined) : asText(item.value)}
      </dd>
    </div>
  );
}

export function JobPostSummary({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="mb-2 grid grid-cols-2 border border-line bg-amber-50 sm:grid-cols-4">
      {items.map((item) => (
        <SummaryPill key={item.label} item={item} />
      ))}
    </dl>
  );
}

export function MarketPostSummary({ items }: { items: SummaryItem[] }) {
  return (
    <dl className="mb-2 grid grid-cols-2 border border-line bg-field sm:grid-cols-4">
      {items.map((item) => (
        <SummaryPill key={item.label} item={item} />
      ))}
    </dl>
  );
}
