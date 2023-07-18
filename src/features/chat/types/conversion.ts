import type { IMessage } from "./message";
import type { IPromptSettings } from "./prompt_settings";

export interface IConversion {
  id: string;
  promptSettings: IPromptSettings;
  messages: IMessage[];
}
