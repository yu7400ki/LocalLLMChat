import React, { useEffect, useRef } from "react";

import { css } from "@styled-system/css";

import ErrorDialog from "@/components/ErrorDialog";
import ScrollArea from "@/components/ScrollArea";

import { useChat } from "../hooks/useChat";
import { IConversion } from "../types/conversion";
import ChatLayout from "./ChatLayout";
import Conversion from "./Conversion";
import InferenceController from "./InferenceController";

type Props = {
  defaultConversion: IConversion;
  className?: string;
};

const Chat: React.FC<Props> = ({ defaultConversion, className }) => {
  const {
    inferring,
    submitMessage,
    conversion,
    error,
    clearError,
    stop,
    reInfer,
    continueInfer,
    editMessage,
  } = useChat(defaultConversion);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  console.log(error);

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
        <Conversion conversion={conversion} onEditMessage={editMessage} />
      </ScrollArea>
      <ErrorDialog
        open={error !== null}
        error={error?.error!}
        description={error?.message!}
        onClose={clearError}
      />
    </ChatLayout>
  );
};

export default React.memo(Chat);
