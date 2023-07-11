import type { IMessage } from "./message";

export interface IConversion {
  id: string;
  messages: IMessage[];
  separator: string;
}
