export type SavedPostEntry = {
  id: string;
  title: string;
  boardName: string;
  boardSlug: string;
  region?: string;
  trade?: string;
  savedAt: string;
};

const STORAGE_PREFIX = "jobday:saved-posts:";
const MAX_SAVED_POSTS = 80;

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function readSavedPosts(userId: string): SavedPostEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is SavedPostEntry => Boolean(item?.id && item?.title));
  } catch {
    return [];
  }
}

export function writeSavedPosts(userId: string, posts: SavedPostEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(userId), JSON.stringify(posts.slice(0, MAX_SAVED_POSTS)));
}

export function toggleSavedPost(userId: string, entry: Omit<SavedPostEntry, "savedAt">) {
  const current = readSavedPosts(userId);
  const exists = current.some((item) => item.id === entry.id);
  const next = exists
    ? current.filter((item) => item.id !== entry.id)
    : [{ ...entry, savedAt: new Date().toISOString() }, ...current.filter((item) => item.id !== entry.id)];

  writeSavedPosts(userId, next);
  return { saved: !exists, posts: next };
}

export function removeSavedPost(userId: string, postId: string) {
  const next = readSavedPosts(userId).filter((item) => item.id !== postId);
  writeSavedPosts(userId, next);
  return next;
}
