"use client";

import { useEffect, useState } from "react";
import { ButtonLink, LoadingState, NoticeBox } from "@/components/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { POST_STATUS_LABELS } from "@/lib/constants";

type HiddenPost = {
  id: string;
  title: string;
  status: "recruiting" | "closed" | "hidden" | "deleted";
  board?: { name: string; slug: string } | null;
};

export function HiddenPostNotice({ postId }: { postId: string }) {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<HiddenPost | null>(null);

  useEffect(() => {
    async function loadPost() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("posts")
        .select("id,title,status, board:boards(name,slug)")
        .eq("id", postId)
        .maybeSingle();

      setPost(data as unknown as HiddenPost | null);
      setLoading(false);
    }

    void loadPost();
  }, [postId]);

  if (loading) {
    return <LoadingState title="글 상태를 확인하는 중입니다" />;
  }

  if (!post) {
    return (
      <NoticeBox tone="muted" title="글을 열 수 없습니다">
        <p>글이 삭제됐거나 운영 정책에 따라 숨김 처리되어 일반 사용자에게 노출되지 않습니다.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <ButtonLink href="/boards" size="sm">
            게시판으로 이동
          </ButtonLink>
          <ButtonLink href="/login" size="sm">
            로그인
          </ButtonLink>
        </div>
      </NoticeBox>
    );
  }

  return (
    <NoticeBox tone="warning" title="운영 정책에 의해 숨김 처리된 글입니다">
      <p className="font-bold">{post.title}</p>
      <p className="mt-1">현재 상태: {POST_STATUS_LABELS[post.status]}</p>
      <p className="mt-1">작성자 본인 또는 관리자에게만 상태 확인이 가능합니다. 자세한 처리는 운영자 확인이 필요합니다.</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <ButtonLink href={post.board ? `/boards/${post.board.slug}` : "/boards"} size="sm">
          목록으로
        </ButtonLink>
        <ButtonLink href="/me" size="sm">
          마이페이지
        </ButtonLink>
      </div>
    </NoticeBox>
  );
}
