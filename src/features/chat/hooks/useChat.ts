import { useEffect, useState } from "react";

import { listen } from "@tauri-apps/api/event";

import { infer, loadModel, stopInference } from "@/commands";
import { toPrompt } from "@/features/chat/utils/conversionProcessor";
import { appendBotResponse, removeSuffix } from "@/features/chat/utils/conversionProcessor";
import { conversionStore } from "@/store";
import type { TauriError } from "@/types/tauri_error";
import { toTauriError } from "@/utils/error";
import { notNull } from "@/utils/evaluate";
import { uuid } from "@/utils/uuid";

import { conversions as conversionsKey } from "../constants/storageKey";
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
  const [error, setError] = useState<TauriError | null>(null);

  const setTauriError = (error: unknown) => {
    setError(toTauriError(error));
  };

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
      stopInference(true);
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
        console.error(err.message);
        setTauriError(err);
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

  useEffect(() => {
    (async () => {
      const saved = await conversionStore.get<IConversion[]>(conversionsKey);
      const newConversions = [conversion, ...(saved?.filter((c) => c.id !== conversion.id) ?? [])];
      await conversionStore.set(conversionsKey, newConversions);
      await conversionStore.save();
    })();
  }, [conversion]);

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

  const clearError = () => {
    setError(null);
  };

  const stop = (force?: boolean) => {
    console.log("stop");
    if (force) {
      stopInference(true);
      setInferring(false);
      setBuffer("");
    } else {
      stopInference(false);
    }
  };

  const reInfer = () => {
    console.log("re-infer");
    stop();
    setConversion((prevConversion) => {
      prevConversion.messages.pop();
      return prevConversion;
    });
    const prompt = toPrompt(conversion, true);
    console.log(prompt);
    inferStart(prompt);
  };

  const continueInfer = () => {
    console.log("continue infer");
    stop();
    let prompt = toPrompt(conversion, false);
    prompt = removeSuffix(prompt, conversion.promptSettings.botSuffix);
    console.log(prompt);
    inferStart(prompt);
  };

  return {
    conversion,
    inferring,
    submitMessage,
    error,
    clearError,
    stop,
    reInfer,
    continueInfer,
  };
};
