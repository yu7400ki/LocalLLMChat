import { useEffect, useState } from "react";

import { listen } from "@tauri-apps/api/event";

import { infer, loadModel, stopInference } from "@/commands";
import { toPrompt } from "@/features/chat/utils/conversionProcessor";
import { appendBotResponse } from "@/features/chat/utils/conversionProcessor";
import { notNull } from "@/utils/evaluate";
import { uuid } from "@/utils/uuid";

import type { IConversion } from "../types/conversion";
import type { IMessage } from "../types/message";

const getMatchedStop = (
  prompt: string,
  stop: string,
): {
  isFullMatch: boolean;
  index: number;
} | null => {
  const stopInitial = stop[0];
  let fromIndex = 0;
  let initialIndex = prompt.indexOf(stopInitial, fromIndex);
  while (initialIndex !== -1) {
    let slice = prompt.slice(initialIndex);
    if (slice.startsWith(stop)) {
      return {
        isFullMatch: true,
        index: initialIndex,
      };
    } else if (stop.startsWith(slice)) {
      return {
        isFullMatch: false,
        index: initialIndex,
      };
    }
    fromIndex = initialIndex + 1;
    initialIndex = prompt.indexOf(stopInitial, fromIndex);
  }
  return null;
};

export const useChat = (defaultConversion: IConversion) => {
  const [conversion, setConversion] = useState<IConversion>(defaultConversion);
  const [inferring, setInferring] = useState<boolean>(false);
  const [buffer, setBuffer] = useState<string>("");

  useEffect(() => {
    let unlisten: (() => void) | null = null;
    const setup = async () => {
      unlisten = await listen("inference", (event) => {
        const { token } = event.payload as { token: string };
        setBuffer((prevBuffer) => {
          let buffer = prevBuffer + token;
          let append = "";
          const matchedStop = conversion.promptSettings.stop
            .map((stop) => getMatchedStop(buffer, stop))
            .filter(notNull);
          if (matchedStop.length > 0) {
            matchedStop.sort((a, b) => a.index - b.index);
            const { isFullMatch, index } = matchedStop[0];
            append = buffer.slice(0, index);
            if (isFullMatch) {
              stopInference(true);
              buffer = "";
            } else {
              buffer = buffer.slice(index);
            }
          } else {
            append = buffer;
            buffer = "";
          }
          console.log(append, buffer);
          if (append) {
            setConversion((prevConversion) => appendBotResponse(prevConversion, append));
          }
          return buffer;
        });
      });
    };
    setup();
    return () => {
      unlisten?.();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const inferStart = (prompt: string) => {
    setInferring(true);
    setConversion((prevConversion) => appendBotResponse(prevConversion, ""));
    loadModel(conversion.modelSettings.name, conversion.modelSettings.architecture)
      .then(() => {
        stopInference(false);
        setBuffer("");
        return infer(prompt);
      })
      .then(() => {
        setConversion((prevConversion) => appendBotResponse(prevConversion, buffer));
        console.log("inference done");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setBuffer("");
        stopInference(true);
        setInferring(false);
      });
  };

  useEffect(() => {
    const lastMessage = conversion.messages[conversion.messages.length - 1];
    if (lastMessage?.role === "User") {
      const prompt = toPrompt(conversion, true);
      console.log(prompt);
      inferStart(prompt);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const submitMessage = (messageContent: string) => {
    if (inferring) return;
    const message: IMessage = {
      id: uuid(),
      content: messageContent,
      role: "User",
    };
    setConversion((prevConversion) => ({
      ...prevConversion,
      messages: [...prevConversion.messages, message],
    }));
    const prompt = toPrompt({ ...conversion, messages: [...conversion.messages, message] }, true);
    console.log(prompt);
    inferStart(prompt);
  };

  return {
    conversion,
    inferring,
    submitMessage,
  };
};
