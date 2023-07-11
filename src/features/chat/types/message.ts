export interface IMessage {
  role: "User" | "Bot";
  prefix: string;
  content: string;
}
