export interface IMessage {
  id: string;
  role: "User" | "Bot";
  content: string;
}
