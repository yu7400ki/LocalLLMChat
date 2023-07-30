import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { css, cx } from "@styled-system/css";

type Props = {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const MessageInput: React.FC<Props> = ({ onSubmit, className, disabled, children }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "0";
    const padding = parseInt(getComputedStyle(element).paddingBlock, 10);
    const height = element.scrollHeight - padding * 2;
    element.style.height = `${height}px`;
  }, []);

  useEffect(() => {
    window.addEventListener("resize", adjustTextareaHeight);
    return () => {
      window.removeEventListener("resize", adjustTextareaHeight);
    };
  }, [adjustTextareaHeight]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message, adjustTextareaHeight]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    event.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      onSubmit(message);
      setMessage("");
    }
  };

  const isDisabled = disabled || message.match(/^\s*$/) !== null;

  return (
    <div
      className={cx(
        className,
        css({
          position: "relative",
        }),
      )}
    >
      {children}
      <div
        className={css({
          display: "flex",
          alignItems: "flex-end",
          borderColor: "slate.200",
          borderWidth: 1,
          rounded: "xl",
          shadow: "md",
          fontWeight: "semibold",
        })}
      >
        <textarea
          placeholder="メッセージを入力"
          className={css({
            boxSizing: "content-box",
            flex: 1,
            p: 4,
            pr: 0,
            minHeight: "calc(1rem * 1.5)",
            height: "calc(1rem * 1.5)",
            maxHeight: "14rem",
            outline: "none",
            resize: "none",
            fontSize: "1rem",
            lineHeight: 1.5,
            color: "text",
            bg: "transparent",
            _placeholder: {
              color: "text.placeholder",
            },
          })}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={message}
          ref={textareaRef}
        />
        <div
          className={css({
            height: "3.5rem",
            display: "grid",
            placeItems: "center",
            aspectRatio: 1,
          })}
        >
          <button
            disabled={isDisabled}
            onClick={handleClick}
            className={css({
              p: 2,
              cursor: "pointer",
              bg: {
                base: "orange.500",
                _hover: "orange.600",
                _active: "orange.600",
              },
              color: "white",
              rounded: "md",
              aspectRatio: 1,
              outline: "none",
              transition: "color 150ms ease-in-out, background-color 150ms ease-in-out",
              _focusVisible: {
                outlineColor: "sky.600",
                outlineStyle: "solid",
                outlineWidth: "2px",
                outlineOffset: "1px",
              },
              _disabled: {
                bg: {
                  base: "transparent",
                  _hover: "transparent",
                  _active: "transparent",
                },
                color: "slate.400",
                cursor: "not-allowed",
              },
            })}
          >
            <PaperPlaneIcon stroke="white" strokeWidth={0.4} width={"1.1rem"} height={"1.1rem"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);
