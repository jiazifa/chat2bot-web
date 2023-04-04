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
  conversationStat: ConversationStat;
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

export interface ConversationStat {
  isLocal: boolean;
}

const DEFAULT_TOPIC = Locale.Store.DefaultTopic;

function createEmptyConversation(uid?: number): ChatConversation {
  const createDate = new Date().toLocaleString();

  return {
    id: uid ?? 0,
    uuid: `local_conversion_${uid ?? 0}`,
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
    conversationStat: {
      isLocal: true,
    },
  };
}

interface ChatStore {
  config: ChatConfig;
  _conversations: { [key: string]: ChatConversation };
  currentConversationUuid: string;
  _allConversationUuids: string[];

  getConfig: () => ChatConfig;
  resetConfig: () => void;
  updateConfig: (updater: (config: ChatConfig) => void) => void;
  clearAllData: () => void;

  getConversations(): ChatConversation[];
  removeConversation: (uuid: string) => void;
  selectConversation: (uuid: string) => void;
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
      _conversations: { local_conversion_0: createEmptyConversation() },
      currentConversationUuid: "local_conversion_0",
      _allConversationUuids: ["local_conversion_0"],

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
          _conversations: { local_conversion_0: createEmptyConversation() },
          currentConversationUuid: "local_conversion_0",
        }));
      },

      getConversations(): ChatConversation[] {
        const {
          _conversations: conversations,
          _allConversationUuids: allConversationUuids,
        } = get();
        return allConversationUuids.map((uuid) => conversations[uuid]);
      },

      newConversation() {
        set((state) => {
          const uid = state._allConversationUuids.length;
          const newC = createEmptyConversation(uid);
          const uuid = newC.uuid;
          const newCvs = { ...state._conversations, [uuid]: newC };
          return {
            currentConversationUuid: uuid,
            _allConversationUuids: state._allConversationUuids.concat(uuid),
            _conversations: {
              ...state._conversations,
              [uuid]: newC,
            },
          };
        });
      },

      selectConversation(uuid: string) {
        set(() => ({ currentConversationUuid: uuid }));
      },

      currentConversation() {
        let uuid = get().currentConversationUuid;
        const {
          _conversations: conversations,
          _allConversationUuids: allConversationUuids,
        } = get();
        if (!conversations[uuid]) {
          uuid = allConversationUuids[0];
        }
        return conversations[uuid];
      },

      removeConversation(uuid: string) {
        set((state) => {
          const {
            _conversations: conversations,
            currentConversationUuid,
            _allConversationUuids: allConversationUuids,
          } = state;
          if (allConversationUuids.length <= 1) {
            const c = createEmptyConversation();
            const cuuid = c.uuid;
            return {
              currentConversationUuid: c.uuid,
              _conversations: { [cuuid]: c },
              _allConversationUuids: [c.uuid],
            };
          }
          let nextConversationUuid = currentConversationUuid;
          if (currentConversationUuid === uuid) {
            nextConversationUuid = allConversationUuids[0];
          }
          delete conversations[uuid];

          allConversationUuids.splice(allConversationUuids.indexOf(uuid), 1);
          return {
            _conversations: conversations,
            _allConversationUuids: allConversationUuids,
            currentConversationUuid: nextConversationUuid,
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
