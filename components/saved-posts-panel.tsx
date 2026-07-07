"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, EmptyState, Icon, NoticeBox, SectionHeader } from "@/components/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { formatDate } from "@/lib/format";
import { readSavedPosts, removeSavedPost, type SavedPostEntry } from "@/lib/saved-posts";

export function SavedPostsPanel() {
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<SavedPostEntry[]>([]);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setChecked(true);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setChecked(true);
        return;
      }

      setUserId(user.id);
      setPosts(readSavedPosts(user.id));
      setChecked(true);
    }

    void loadPosts();
  }, []);

  function removePost(postId: string) {
    if (!userId) return;
    setPosts(removeSavedPost(userId, postId));
  }

  return (
    <section className="border border-line-strong bg-white">
      <SectionHeader title="저장한 글" count={`${posts.length}개`} />
      {!checked ? (
        <NoticeBox className="m-3" tone="muted">
          <p>저장한 글을 확인하는 중입니다.</p>
        </NoticeBox>
      ) : !userId ? (
        <NoticeBox className="m-3" tone="muted" title="로그인 후 볼 수 있습니다">
          <p>로그인하면 저장한 작업레이드, 공구글, 자재글을 마이페이지에서 다시 볼 수 있습니다.</p>
        </NoticeBox>
      ) : posts.length ? (
        <div className="divide-y divide-slate-200">
          {posts.map((post) => (
            <div key={post.id} className="grid gap-2 px-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <Link href={`/posts/${post.id}`} className="min-w-0 active:text-accent">
                <div className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold leading-5 text-muted">
                  <span className="inline-flex items-center gap-1">
                    <Icon name="board" className="h-3.5 w-3.5" />
                    {post.boardName}
                  </span>
                  {post.region ? <span>{post.region}</span> : null}
                  {post.trade ? <span>{post.trade}</span> : null}
                </div>
                <p className="mt-1 line-clamp-1 text-base font-bold leading-6 text-ink">{post.title}</p>
                <p className="mt-0.5 text-[12px] font-medium leading-5 text-muted">저장 {formatDate(post.savedAt)}</p>
              </Link>
              <Button type="button" size="sm" variant="quiet" onClick={() => removePost(post.id)}>
                저장 해제
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-3">
          <EmptyState
            title="저장한 글 없음"
            body="작업레이드, 공구글, 자재글에서 글 저장을 누르면 이곳에 모입니다."
            href="/boards/work-raid"
            actionLabel="작업레이드 보기"
          />
        </div>
      )}
    </section>
  );
}
