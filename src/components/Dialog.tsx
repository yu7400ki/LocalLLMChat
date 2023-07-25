import React from "react";

import dynamic from "next/dynamic";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { css, cx } from "@styled-system/css";

import button from "@/recipes/button";

const Root = dynamic(() => import("@radix-ui/react-dialog").then((mod) => mod.Root), {
  ssr: false,
});

type Props = {
  open: boolean;
  closeLabel?: string;
  onClose: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const Dialog: React.FC<Props> = ({
  open,
  closeLabel,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  return (
    <Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={css({ position: "fixed", inset: 0, bg: "rgba(0, 0, 0, 0.4)" })}
        />
        <DialogPrimitive.Content
          className={cx(
            className,
            css({
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bg: "white",
              p: 6,
              rounded: "lg",
              shadow: "lg",
              _focus: { outline: "none" },
            }),
          )}
        >
          <DialogPrimitive.Title
            className={css({ fontSize: "xl", fontWeight: "semibold", userSelect: "none" })}
          >
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className={css({ my: 3, color: "text.description" })}>
            {description}
          </DialogPrimitive.Description>
          {children}
          <div
            className={css({
              display: "flex",
              justifyContent: "flex-end",
            })}
          >
            <DialogPrimitive.Close asChild>
              <button onClick={onClose} className={button({ visual: "solid" })}>
                {closeLabel || "閉じる"}
              </button>
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Root>
  );
};

export default React.memo(Dialog);
