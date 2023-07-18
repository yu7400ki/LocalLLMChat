export interface IPromptSettings {
  readonly userPrefix: string;
  readonly userSuffix: string;
  readonly botPrefix: string;
  readonly botSuffix: string;
  readonly stop: string[];
}
