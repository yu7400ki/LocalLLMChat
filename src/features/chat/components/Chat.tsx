import React from "react";

import { useChat } from "../hooks/useChat";
import { IConversion } from "../types/conversion";
import ChatLayout from "./ChatLayout";
import Conversion from "./Conversion";

type Props = {
  defaultConversion: IConversion;
  className?: string;
};

const Chat: React.FC<Props> = ({ defaultConversion, className }) => {
  const { inferring, submitMessage, conversion } = useChat(defaultConversion);

  return (
    <ChatLayout className={className} onSubmit={submitMessage} disabled={inferring}>
      <Conversion conversion={conversion} />
    </ChatLayout>
  );
};

export default React.memo(Chat);
