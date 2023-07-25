import React from "react";

import { CrossCircledIcon } from "@radix-ui/react-icons";
import { css } from "@styled-system/css";

import Dialog from "@/components/Dialog";

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
        onClose={clearError}
        title={<ErrorWithIcon>Inference Error</ErrorWithIcon>}
        description={error}
        className={css({
          w: "90%",
          maxW: "xl",
        })}
      />
    </ChatLayout>
  );
};

export default React.memo(Chat);
