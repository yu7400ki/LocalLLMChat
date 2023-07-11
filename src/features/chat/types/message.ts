export interface IMessage {
  id: string;
  role: "User" | "Bot";
  prefix: string;
  content: string;
}
