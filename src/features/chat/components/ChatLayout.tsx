import React from "react";

import { css, cx } from "@styled-system/css";

import ScrollArea from "@/components/ScrollArea";

import MessageInput from "./MessageInput";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onSubmit: (message: string) => void;
  disabled?: boolean;
  inferenceController?: React.ReactNode;
};

const ChatLayout: React.FC<Props> = ({
  className,
  children,
  onSubmit,
  disabled,
  inferenceController,
}) => {
  return (
    <div
      className={cx(
        className,
        css({
          position: "relative",
        }),
      )}
    >
      <div
        className={css({
          width: "100%",
          height: "calc(100% - 5rem)",
        })}
      >
        {children}
      </div>
      <div
        className={css({
          position: "absolute",
          bottom: 0,
          insetInlineStart: 0,
          minHeight: "5rem",
          width: "100%",
          display: "grid",
          placeItems: "center",
          p: 2,
          bg: "white",
        })}
      >
        <MessageInput
          onSubmit={onSubmit}
          disabled={disabled}
          className={css({
            width: "100%",
            maxWidth: "breakpoint-md",
          })}
        >
          {inferenceController}
        </MessageInput>
      </div>
    </div>
  );
};

export default React.memo(ChatLayout);
