import React, { useEffect, useRef } from "react";

import { Close } from "@radix-ui/react-dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { css } from "@styled-system/css";

import Dialog from "@/components/Dialog";
import ScrollArea from "@/components/ScrollArea";
import button from "@/recipes/button";

import { useChat } from "../hooks/useChat";
import { IConversion } from "../types/conversion";
import ChatLayout from "./ChatLayout";
import Conversion from "./Conversion";
import InferenceController from "./InferenceController";

type Props = {
  defaultConversion: IConversion;
  className?: string;
};

const ErrorWithIcon: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={css({ display: "flex", alignItems: "center", gap: 2 })}>
      <CrossCircledIcon width={"1.5rem"} height={"1.5rem"} className={css({ color: "red.500" })} />
      {children}
    </div>
  );
};

const Chat: React.FC<Props> = ({ defaultConversion, className }) => {
  const { inferring, submitMessage, conversion, error, clearError, stop, reInfer, continueInfer } =
    useChat(defaultConversion);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { shouldScrollToBottom, scrollHeight } = (() => {
    if (!scrollAreaRef.current)
      return {
        shouldScrollToBottom: false,
        scrollHeight: 0,
      };
    const { scrollHeight, scrollTop, clientHeight } = scrollAreaRef.current;
    const shouldScrollToBottom = scrollHeight - scrollTop - clientHeight < 10;
    return {
      shouldScrollToBottom,
      scrollHeight,
    };
  })();

  useEffect(() => {
    if (!scrollAreaRef.current) return;
    if (scrollAreaRef.current.scrollHeight === scrollHeight) return;
    if (shouldScrollToBottom) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversion.messages]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ChatLayout
      className={className}
      onSubmit={submitMessage}
      disabled={inferring}
      inferenceController={
        <InferenceController
          stopInference={inferring}
          onStopInference={stop}
          reInference={!inferring}
          onReInference={reInfer}
          continue={!inferring}
          onContinue={continueInfer}
        />
      }
    >
      <ScrollArea
        className={css({
          height: "100%",
        })}
        ref={scrollAreaRef}
      >
        <Conversion conversion={conversion} />
      </ScrollArea>
      <Dialog
        open={error !== null}
        title={<ErrorWithIcon>{error?.error}</ErrorWithIcon>}
        description={error?.message}
        className={css({
          w: "90%",
          maxW: "xl",
        })}
      >
        <div
          className={css({
            display: "flex",
            justifyContent: "flex-end",
          })}
        >
          <Close asChild>
            <button onClick={clearError} className={button({ visual: "solid" })}>
              閉じる
            </button>
          </Close>
        </div>
      </Dialog>
    </ChatLayout>
  );
};

export default React.memo(Chat);
