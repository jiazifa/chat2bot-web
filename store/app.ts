import { create } from "zustand";
import { persist, combine, devtools } from "zustand/middleware";

export interface AppConfig {
  language: string;
}

const DEFAULT_APP_CONFIG: AppConfig = {
  language: "cn",
};

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export interface ChatConfig {
  historyMessageCount: number; // -1 means all
  compressMessageLengthThreshold: number; // -1 means no limit
  sendBotMessages: boolean; // send bot's message or not
  submitKey: SubmitKey;
  fontSize: number;
  theme: Theme;

  disablePromptHint: boolean;

  modelConfig: {
    model: string;
    temperature: number;
    max_tokens: number;
    presence_penalty: number;
  };
}

export type ModelConfig = ChatConfig["modelConfig"];

const ENABLE_GPT4 = true;

export const ALL_MODELS = [
  {
    name: "gpt-4",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-4-32k-0314",
    available: ENABLE_GPT4,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
];
export function isValidModel(name: string) {
  return ALL_MODELS.some((m) => m.name === name && m.available);
}

export function isValidNumber(x: number, min: number, max: number) {
  return typeof x === "number" && x <= max && x >= min;
}

export function filterConfig(config: ModelConfig): Partial<ModelConfig> {
  const validator: {
    [k in keyof ModelConfig]: (x: ModelConfig[keyof ModelConfig]) => boolean;
  } = {
    model(x) {
      return isValidModel(x as string);
    },
    max_tokens(x) {
      return isValidNumber(x as number, 100, 4000);
    },
    presence_penalty(x) {
      return isValidNumber(x as number, -2, 2);
    },
    temperature(x) {
      return isValidNumber(x as number, 0, 1);
    },
  };

  Object.keys(validator).forEach((k) => {
    const key = k as keyof ModelConfig;
    if (!validator[key](config[key])) {
      // eslint-disable-next-line no-param-reassign
      delete config[key];
    }
  });

  return config;
}

const DEFAULT_CHAT_CONFIG: ChatConfig = {
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  sendBotMessages: true as boolean,
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  fontSize: 14,
  theme: Theme.Auto as Theme,

  disablePromptHint: false,

  modelConfig: {
    model: "gpt-3.5-turbo",
    temperature: 1,
    max_tokens: 2000,
    presence_penalty: 0,
  },
};

interface AppStore {
  appConfig: AppConfig;

  chatConfig: ChatConfig;

  resetConfig(): void;

  updateAppConfig: (updater: (config: AppConfig) => void) => void;

  updateChatConfig: (updater: (config: ChatConfig) => void) => void;
}

const LOCAL_KEY = "chat-app-store";

// const resetConfig: StateCreator<AppStore> = (set, get) => {
//   config: DEFAULT_CONFIG;
// };

// const myMiddlewares = (f: any) =>
//   devtools(persist(f, { name: LOCAL_KEY, version: 1 }));

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      combine(
        {
          appConfig: DEFAULT_APP_CONFIG,
          chatConfig: DEFAULT_CHAT_CONFIG,
        },
        (set, get) => ({
          resetConfig: () =>
            set({
              appConfig: DEFAULT_APP_CONFIG,
              chatConfig: DEFAULT_CHAT_CONFIG,
            }),

          updateAppConfig: (updater) =>
            set((state) => {
              const config = { ...state.appConfig };
              updater(config);
              return { appConfig: config };
            }),

          updateChatConfig: (updater) =>
            set((state) => {
              const config = { ...state.chatConfig };
              updater(config);
              return { chatConfig: config };
            }),
          // end
        })
      ),
      { name: LOCAL_KEY, version: 1 }
    )
  )
);
