import { uuid } from "@/utils/uuid";

import { IConversion } from "../types/conversion";

export const toPrompt = (conversion: IConversion, appendBotPrefix = false) => {
  const promptSettings = conversion.promptSettings;
  const prompt = conversion.messages.reduce((prompt, message) => {
    if (message.role === "User") {
      return prompt + promptSettings.userPrefix + message.content + promptSettings.userSuffix;
    } else {
      return prompt + promptSettings.botPrefix + message.content + promptSettings.botSuffix;
    }
  }, conversion.promptSettings.context);

  if (appendBotPrefix) {
    return prompt + promptSettings.botPrefix;
  } else {
    return prompt;
  }
};

export const appendBotResponse = (conversion: IConversion, response: string): IConversion => {
  const messages = conversion.messages;
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return conversion;
  }
  if (lastMessage.role !== "Bot") {
    return {
      ...conversion,
      messages: [
        ...conversion.messages,
        {
          id: uuid(),
          content: response,
          role: "Bot",
        },
      ],
    };
  }
  return {
    ...conversion,
    messages: [
      ...conversion.messages.slice(0, -1),
      {
        ...lastMessage,
        content: lastMessage.content + response,
      },
    ],
  };
};
