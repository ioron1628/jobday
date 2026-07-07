"use client";

import { useState, type ReactNode } from "react";
import { Button, ToastMessage } from "@/components/design-system";

export function ShopActionButton({ children = "문의하기" }: { children?: ReactNode }) {
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
      {visible ? <ToastMessage tone="warning">JOBDAYSHOP 문의 기능은 준비 중입니다. 초기에는 운영자가 수동으로 안내합니다.</ToastMessage> : null}
    </>
  );
}
