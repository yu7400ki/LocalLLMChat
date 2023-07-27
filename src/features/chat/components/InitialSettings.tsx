import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { ReloadIcon, UploadIcon } from "@radix-ui/react-icons";
import { css, cx } from "@styled-system/css";

import { getModels, openModelsDir } from "@/commands";
import AddField, { AddedValue } from "@/components/AddField";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScrollArea from "@/components/ScrollArea";
import SelectBox from "@/components/SelectBox";
import SelectOption from "@/components/SelectOption";
import Textarea from "@/components/Textarea";
import { conversionStore, settingsStore } from "@/store";
import { uuid } from "@/utils/uuid";

import { conversions as conversionsKey, settings as settingsKey } from "../constants/storageKey";
import type { Architecture } from "../types/architecture";
import type { IConversion } from "../types/conversion";
import type { IMessage } from "../types/message";
import type { IModelSettings } from "../types/model_settings";
import type { IPromptSettings } from "../types/prompt_settings";
import ChatLayout from "./ChatLayout";

type Props = {
  className?: string;
};

type Settings = {
  architecture: Architecture | undefined;
  model: string | undefined;
  context: string;
  userPrefix: string;
  userSuffix: string;
  botPrefix: string;
  botSuffix: string;
  stop: AddedValue[];
};

type SavedSettings = Record<string, Settings>;

const initialSettings: Settings = {
  architecture: undefined,
  model: undefined,
  context: "",
  userPrefix: "",
  userSuffix: "",
  botPrefix: "",
  botSuffix: "",
  stop: [],
};

const InitialSettings: React.FC<Props> = ({ className }) => {
  const router = useRouter();
  const [models, setModels] = useState<string[]>([]);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const setSettingHelper = (key: keyof Settings) => (value: string | AddedValue[]) => {
    setSettings((prev) => {
      let next = { ...prev, [key]: value };
      if (next.model !== undefined) {
        const model = next.model;
        settingsStore
          .get<SavedSettings>(settingsKey)
          .then((savedSettings) => {
            return settingsStore.set(settingsKey, {
              ...savedSettings,
              [model]: next,
            });
          })
          .then(() => {
            settingsStore.save();
          });
      }
      return next;
    });
  };

  const loadSettings = async (model: string) => {
    const savedSettings = (await settingsStore.get<SavedSettings>(settingsKey)) || {};
    const savedSetting = savedSettings[model] || initialSettings;
    setSettings((prev) => {
      return { ...prev, ...savedSetting, model };
    });
  };

  const disabled = settings.architecture === undefined || settings.model === undefined;

  useEffect(() => {
    getModels().then((models) => setModels(models));
  }, []);

  const onSubmit = async (message: string) => {
    if (disabled) return;
    const modelSettings: IModelSettings = {
      architecture: settings.architecture as Architecture,
      name: settings.model as string,
    };
    const promptSettings: IPromptSettings = {
      context: settings.context,
      userPrefix: settings.userPrefix.replace(/\\n/g, "\n"),
      userSuffix: settings.userSuffix.replace(/\\n/g, "\n"),
      botPrefix: settings.botPrefix.replace(/\\n/g, "\n"),
      botSuffix: settings.botSuffix.replace(/\\n/g, "\n"),
      stop: settings.stop.map((stop) => stop.value.replace(/\\n/g, "\n")),
    };
    const messages: IMessage[] = [
      {
        id: uuid(),
        role: "User",
        content: message,
      },
    ];
    const conversion: IConversion = {
      id: uuid(),
      name: "新しいチャット",
      modelSettings,
      promptSettings,
      messages,
    };
    const savedConversions = (await conversionStore.get<IConversion[]>(conversionsKey)) || [];
    await conversionStore.set(conversionsKey, [conversion, ...savedConversions]);
    await conversionStore.save();
    router.push(`/chat?id=${conversion.id}`);
  };

  return (
    <ChatLayout onSubmit={onSubmit} className={className} disabled={disabled}>
      <ScrollArea
        className={css({
          height: "100%",
        })}
      >
        <div
          className={cx(
            className,
            css({
              maxWidth: "breakpoint-md",
              mx: "auto",
              py: 4,
              px: 2,
            }),
          )}
        >
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: 3,
            })}
          >
            <SelectBox
              label="Architecture"
              placeholder="Architecture"
              className={css({
                width: "12rem",
              })}
              error={settings.architecture === undefined ? "required" : undefined}
              value={settings.architecture}
              onChange={setSettingHelper("architecture")}
            >
              <SelectOption value="bloom">Bloom</SelectOption>
              <SelectOption value="gpt2">GPT-2</SelectOption>
              <SelectOption value="gptj">GPT-J</SelectOption>
              <SelectOption value="gptneox">GPT-NeoX</SelectOption>
              <SelectOption value="llama">LLaMA</SelectOption>
              <SelectOption value="mpt">MPT</SelectOption>
            </SelectBox>
            <SelectBox
              label="Model"
              placeholder="Model"
              className={css({
                flex: 1,
              })}
              error={settings.model === undefined ? "required" : undefined}
              value={settings.model}
              onChange={loadSettings}
            >
              {models.map((model) => (
                <SelectOption key={model} value={model}>
                  {model}
                </SelectOption>
              ))}
            </SelectBox>
            <Button
              className={css({
                aspectRatio: "1/1",
              })}
              onClick={() => getModels().then((models) => setModels(models))}
            >
              <ReloadIcon />
            </Button>
            <Button
              className={css({
                aspectRatio: "1/1",
              })}
              onClick={() => openModelsDir()}
            >
              <UploadIcon />
            </Button>
          </div>
          <div>
            <Textarea
              label="Context"
              id="context"
              rows={5}
              value={settings.context}
              onChange={(e) => {
                setSettingHelper("context")(e.target.value);
              }}
            />
          </div>
          <div
            className={css({
              display: "flex",
              gap: 3,
            })}
          >
            <Input
              label="User Prefix"
              id="user-prefix"
              className={css({
                flex: 1,
              })}
              value={settings.userPrefix}
              onChange={(e) => {
                setSettingHelper("userPrefix")(e.target.value);
              }}
            />
            <Input
              label="User Suffix"
              id="user-suffix"
              className={css({
                flex: 1,
              })}
              value={settings.userSuffix}
              onChange={(e) => {
                setSettingHelper("userSuffix")(e.target.value);
              }}
            />
          </div>
          <div
            className={css({
              display: "flex",
              gap: 3,
            })}
          >
            <Input
              label="Bot Prefix"
              id="bot-prefix"
              className={css({
                flex: 1,
              })}
              value={settings.botPrefix}
              onChange={(e) => {
                setSettingHelper("botPrefix")(e.target.value);
              }}
            />
            <Input
              label="Bot Suffix"
              id="bot-suffix"
              className={css({
                flex: 1,
              })}
              value={settings.botSuffix}
              onChange={(e) => {
                setSettingHelper("botSuffix")(e.target.value);
              }}
            />
          </div>
          <div>
            <AddField
              label="Stop Word"
              id="stop-word"
              placeholder="Enterを押して追加"
              values={settings.stop}
              onPressEnter={(value) => {
                setSettingHelper("stop")([...settings.stop, { id: uuid(), value }]);
              }}
              onClickDelete={(value) => {
                setSettingHelper("stop")(settings.stop.filter((stop) => stop.id !== value.id));
              }}
            />
          </div>
        </div>
      </ScrollArea>
    </ChatLayout>
  );
};

export default React.memo(InitialSettings);
