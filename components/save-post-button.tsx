"use client";

import { useEffect, useState } from "react";
import { Button, Icon, ToastMessage } from "@/components/design-system";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { LOGIN_REQUIRED_MESSAGE, SUPABASE_SETUP_REQUIRED_MESSAGE } from "@/lib/user-messages";
import { readSavedPosts, toggleSavedPost, type SavedPostEntry } from "@/lib/saved-posts";

type Props = {
  entry: Omit<SavedPostEntry, "savedAt">;
};

export function SavePostButton({ entry }: Props) {
  const [userId, setUserId] = useState("");
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"success" | "warning" | "muted">("success");

  useEffect(() => {
    async function loadSavedState() {
      const supabase = createBrowserSupabaseClient();
      if (!supabase) return;

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);
      setSaved(readSavedPosts(user.id).some((item) => item.id === entry.id));
    }

    void loadSavedState();
  }, [entry.id]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 2600);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function onToggle() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessageTone("warning");
      setMessage(SUPABASE_SETUP_REQUIRED_MESSAGE);
      return;
    }

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setMessageTone("warning");
      setMessage(LOGIN_REQUIRED_MESSAGE);
      return;
    }

    const result = toggleSavedPost(user.id, entry);
    setUserId(user.id);
    setSaved(result.saved);
    setMessageTone(result.saved ? "success" : "muted");
    setMessage(result.saved ? "저장했습니다. 마이페이지에서 볼 수 있습니다." : "저장을 해제했습니다.");
  }

  return (
    <>
      <Button type="button" variant={saved ? "warning" : "secondary"} size="lg" fullWidth onClick={onToggle}>
        <Icon name="star" className="mr-1.5 h-4 w-4" />
        {saved ? "저장됨" : "글 저장"}
      </Button>
      {message ? <ToastMessage tone={messageTone}>{message}</ToastMessage> : null}
      {!userId ? <span className="sr-only">로그인하면 글을 저장할 수 있습니다.</span> : null}
    </>
  );
}
