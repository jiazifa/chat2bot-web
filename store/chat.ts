import { create } from "zustand";
import { persist } from "zustand/middleware";
import Locale from "../locales";

type Role = "user" | "assistant" | "system";

export interface ChatConversation {
  id: number;
  uuid: string;
  topic: string;
  memoryPrompt: string;
  messages: Message[];
  stat: ChatStat;
  lastUpdate: string;
  lastSummarizeIndex: number;
}

export type Message = {
  role: Role;
  content: string;
  date: string;
  streaming?: boolean;
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
  avatar: string;
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

const DEFAULT_CONFIG: ChatConfig = {
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  sendBotMessages: true as boolean,
  submitKey: SubmitKey.CtrlEnter as SubmitKey,
  avatar: "1f603",
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

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

const DEFAULT_TOPIC = Locale.Store.DefaultTopic;

function createEmptyConversation(): ChatConversation {
  const createDate = new Date().toLocaleString();

  return {
    id: Date.now(),
    uuid: "",
    topic: DEFAULT_TOPIC,
    memoryPrompt: "",
    messages: [
      {
        role: "assistant",
        content: Locale.Store.BotHello,
        date: createDate,
      },
    ],
    stat: {
      tokenCount: 0,
      wordCount: 0,
      charCount: 0,
    },
    lastUpdate: createDate,
    lastSummarizeIndex: 0,
  };
}

interface ChatStore {
  config: ChatConfig;
  conversations: ChatConversation[];
  currentConversationIndex: number;

  getConfig: () => ChatConfig;
  resetConfig: () => void;
  updateConfig: (updater: (config: ChatConfig) => void) => void;
  clearAllData: () => void;

  removeConversation: (index: number) => void;
  selectConversation: (index: number) => void;
  newConversation: () => void;
  currentConversation: () => ChatConversation;
  //   onNewMessage: (message: Message) => void;
  //   onUserInput: (content: string) => Promise<void>;
  summarizeConversation: () => void;
  //   updateStat: (message: Message) => void;
  //   updateCurrentConversation: (updater: (conversation: ChatConversation) => void) => void;
  //   updateMessage: (
  //     conversationIndex: number,
  //     messageIndex: number,
  //     updater: (message?: Message) => void
  //   ) => void;
  //   getMessagesWithMemory: () => Message[];
  //   getMemoryPrompt: () => Message;
}

function countMessages(msgs: Message[]) {
  return msgs.reduce((pre, cur) => pre + cur.content.length, 0);
}

const LOCAL_KEY = "chat-next-web-store";

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },
      conversations: [createEmptyConversation()],
      currentConversationIndex: 0,

      getConfig() {
        return get().config;
      },
      resetConfig() {
        set(() => ({ config: { ...DEFAULT_CONFIG } }));
      },
      updateConfig(updater) {
        set((state) => {
          const config = { ...state.config };
          updater(config);
          return { config };
        });
      },
      clearAllData() {
        set(() => ({
          config: { ...DEFAULT_CONFIG },
          conversations: [createEmptyConversation()],
          currentConversationIndex: 0,
        }));
      },

      newConversation() {
        set((state) => ({
          currentConversationIndex: 0,
          conversations: [createEmptyConversation()].concat(
            state.conversations
          ),
        }));
      },

      selectConversation(index) {
        set(() => ({ currentConversationIndex: index }));
      },

      currentConversation() {
        let index = get().currentConversationIndex;
        const { conversations } = get();

        if (index < 0 || index >= conversations.length) {
          index = Math.min(conversations.length - 1, Math.max(0, index));
          set(() => ({ currentConversationIndex: index }));
        }

        const session = conversations[index];

        return session;
      },

      removeConversation(index) {
        set((state) => {
          const { conversations, currentConversationIndex } = state;
          let nextIndex = currentConversationIndex;
          if (conversations.length <= 1) {
            return {
              currentConversationIndex: 0,
              conversations: [createEmptyConversation()],
            };
          }
          conversations.splice(index, 1);
          if (nextIndex === index) {
            nextIndex -= 1;
          }
          return {
            conversations,
            currentConversationIndex: nextIndex,
          };
        });
      },

      summarizeConversation() {
        const conversation = get().currentConversation();
        // should summarize topic after chating more than 50 words
        const SUMMARIZE_MIN_LEN = 50;
        if (
          conversation.topic === DEFAULT_TOPIC &&
          countMessages(conversation.messages) > SUMMARIZE_MIN_LEN
        ) {
          // 精简对话
          throw new Error("Not implemented");
        }
        const { config } = get();
        let toBeSummarizedMsgs = conversation.messages.slice(
          conversation.lastSummarizeIndex
        );
        const historyMsgLength = countMessages(toBeSummarizedMsgs);
        if (historyMsgLength > 4000) {
          // 字数太多了，切割后再精简
          toBeSummarizedMsgs = toBeSummarizedMsgs.slice(
            -config.historyMessageCount
          );
        }
        throw new Error("Not implemented");
      },
    }),
    { name: LOCAL_KEY, version: 1 }
  )
);
