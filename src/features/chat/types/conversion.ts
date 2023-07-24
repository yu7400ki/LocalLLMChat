import type { IMessage } from "./message";
import type { IPromptSettings } from "./prompt_settings";
import type { IModelSettings } from "./model_settings";

export interface IConversion {
  id: string;
  name: string;
  modelSettings: IModelSettings;
  promptSettings: IPromptSettings;
  messages: IMessage[];
}
