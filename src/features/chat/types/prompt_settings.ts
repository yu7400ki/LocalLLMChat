export interface IPromptSettings {
  readonly context: string;
  readonly userPrefix: string;
  readonly userSuffix: string;
  readonly botPrefix: string;
  readonly botSuffix: string;
  readonly stop: string[];
}
