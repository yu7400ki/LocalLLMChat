import React from "react";

import { Close } from "@radix-ui/react-dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { css } from "@styled-system/css";

import Dialog from "@/components/Dialog";
import button from "@/recipes/button";

import { useChat } from "../hooks/useChat";
import { IConversion } from "../types/conversion";
import ChatLayout from "./ChatLayout";
import Conversion from "./Conversion";

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
  const { inferring, submitMessage, conversion, error, clearError } = useChat(defaultConversion);

  return (
    <ChatLayout className={className} onSubmit={submitMessage} disabled={inferring}>
      <Conversion conversion={conversion} />
      <Dialog
        open={error !== null}
        title={<ErrorWithIcon>Inference Error</ErrorWithIcon>}
        description={error}
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
