"use client";

import { useState, type ReactNode } from "react";
import { Button, ToastMessage } from "@/components/design-system";

export function SkillActionButton({ children, message }: { children: ReactNode; message: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="primary"
        size="lg"
        fullWidth
        onClick={() => {
          setVisible(true);
          window.setTimeout(() => setVisible(false), 3200);
        }}
      >
        {children}
      </Button>
      {visible ? <ToastMessage tone="warning">{message}</ToastMessage> : null}
    </>
  );
}
