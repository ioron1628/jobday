import type { Profile } from "@/types/domain";

export function isAdminProfile(profile: Pick<Profile, "role" | "status" | "is_admin"> | null | undefined) {
  return profile?.status === "active" && (profile.role === "admin" || profile.is_admin === true);
}
