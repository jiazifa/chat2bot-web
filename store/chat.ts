import { create } from "zustand";
import { persist, devtools, combine } from "zustand/middleware";
import Locale from "../locales";
import { requestChat } from "../utils/requests";

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

export type MessageStat = {
  streaming: boolean;
  isError: boolean;
  errorMsg?: string;
};

export type Message = {
  role: Role;
  content: string;
  date: string;
  stat?: MessageStat;
};

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

export interface ConversationStat {
  isLocal: boolean;
}

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export interface ChatConfig {
  historyMessageCount: number; // -1 means all
  compressMessageLengthThreshold: number; // -1 means no limit
  sendBotMessages: boolean; // send bot's message or not
  submitKey: SubmitKey;
  fontSize: number;

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

  disablePromptHint: false,

  modelConfig: {
    model: "gpt-3.5-turbo",
    temperature: 1,
    max_tokens: 2000,
    presence_penalty: 0,
  },
};

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
  // config: ChatConfig;
  conversations: ChatConversation[];
  currentConversationUuid: string;

  chatConfig: ChatConfig;

  resetConfig(): void;
  updateChatConfig: (updater: (config: ChatConfig) => void) => void;
  clearAllData: () => void;

  removeConversation: (uuid: string) => void;
  selectConversation: (uuid: string) => void;
  newConversation: () => void;
  currentConversation(): ChatConversation;

  onNewMessage: (message: Message) => void;
  onUserInput: (content: string) => Promise<void>;
  summarizeConversation: () => void;
  //   updateStat: (message: Message) => void;
  updateCurrentConversation: (
    updater: (conversation: ChatConversation) => void
  ) => void;
  //   updateMessage: (
  //     conversationIndex: number,
  //     messageIndex: number,
  //     updater: (message?: Message) => void
  //   ) => void;
  getMessagesWithMemory: () => Message[];
  getMemoryPrompt: () => Message;
}

function countMessages(msgs: Message[]) {
  return msgs.reduce((pre, cur) => pre + cur.content.length, 0);
}

const LOCAL_KEY = "chat-next-web-store";
const DEFAULT_CONVERSATION_UUID = "local_conversion_0";
export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        conversations: [createEmptyConversation()],
        currentConversationUuid: DEFAULT_CONVERSATION_UUID,
        chatConfig: DEFAULT_CHAT_CONFIG,

        resetConfig: () => set({ chatConfig: DEFAULT_CHAT_CONFIG }),

        updateChatConfig: (updater) =>
          set((state) => {
            const config = { ...state.chatConfig };
            updater(config);
            return { chatConfig: config };
          }),

        clearAllData: () => {
          set({
            conversations: [createEmptyConversation()],
            currentConversationUuid: DEFAULT_CONVERSATION_UUID,
          });
        },

        newConversation: () =>
          set((state) => {
            const uid = state.conversations.length;
            const newC = createEmptyConversation(uid);
            const uuid = newC.uuid;

            return {
              conversations: [...state.conversations, newC],
              currentConversationUuid: uuid,
            };
          }),

        selectConversation: (uuid: string) =>
          set({ currentConversationUuid: uuid }),

        removeConversation: (uuid: string) => {
          const { conversations, currentConversationUuid } = get();
          const allUuids = conversations.map((c) => c.uuid);
          if (!allUuids.includes(uuid)) {
            return;
          }
          set((state) => {
            const { conversations, currentConversationUuid } = state;
            if (allUuids.length <= 1) {
              const c = createEmptyConversation();
              const cuuid = c.uuid;
              return {
                currentConversationUuid: c.uuid,
                conversations: [c],
              };
            }

            let nextConversationUuid = currentConversationUuid;
            if (currentConversationUuid === uuid) {
              nextConversationUuid = allUuids[0];
            }
            const idx = allUuids.indexOf(uuid);
            conversations.splice(idx, 1);
            return {
              conversations,
              currentConversationUuid: nextConversationUuid,
            };
          });
        },

        currentConversation: () => {
          const { conversations, currentConversationUuid } = get();
          const conv = conversations.find(
            (c) => c.uuid === currentConversationUuid
          );
          if (!conv) {
            throw new Error("Conversation not found");
          }
          return conv;
        },

        onNewMessage: (message: Message) => {},

        onUserInput: async (content: string) => {
          const userMessage = {
            role: "user",
            content,
            date: new Date().toLocaleString(),
          } as Message;

          const botMessage = {
            role: "assistant",
            content: "",
            date: new Date().toLocaleString(),
            stat: {
              streaming: true,
              isError: false,
            },
          } as Message;

          // get recent messages
          const recentMessages = get().getMessagesWithMemory();
          const sendMessages = recentMessages.concat(userMessage);
          const currentConversation = get().currentConversation();
          get().updateCurrentConversation((conversation) => {
            conversation.messages.push(userMessage);
            conversation.messages.push(botMessage);
          });
          let conversationIdf: string | undefined = currentConversation.uuid;
          if (currentConversation.conversationStat.isLocal) {
            conversationIdf = undefined;
          }
          try {
            const resp = await requestChat(sendMessages, conversationIdf);
            get().updateCurrentConversation((conversation) => {
              conversation.messages.pop();
              botMessage.stat = {
                streaming: false,
                isError: false,
                ...botMessage.stat,
              };
              botMessage.content = resp.content;
              conversation.messages.push(botMessage);
            });
          } catch (e) {
            get().updateCurrentConversation((conversation) => {
              conversation.messages.pop();
              botMessage.stat = {
                streaming: false,
                isError: true,
                errorMsg: "Error",
                ...botMessage.stat,
              };
              botMessage.content = `${JSON.stringify(e)}`;
              conversation.messages.push(botMessage);
            });
          }
        },

        summarizeConversation: () => {
          const conversation = get().currentConversation();
          if (!conversation) {
            return;
          }
          // should summarize topic after chating more than 50 words
          const SUMMARIZE_MIN_LEN = 50;
          if (
            conversation.topic === DEFAULT_TOPIC &&
            countMessages(conversation.messages) > SUMMARIZE_MIN_LEN
          ) {
            // 精简对话
            throw new Error("Not implemented");
          }
          // const { config } = get();
          // let toBeSummarizedMsgs = conversation.messages.slice(
          //   conversation.lastSummarizeIndex
          // );
          // const historyMsgLength = countMessages(toBeSummarizedMsgs);
          // if (historyMsgLength > 4000) {
          //   // 字数太多了，切割后再精简
          //   toBeSummarizedMsgs = toBeSummarizedMsgs.slice(
          //     -config.historyMessageCount
          //   );
          // }
          throw new Error("Not implemented");
        },

        getMemoryPrompt: () => {
          const { currentConversation } = get();
          const conversation = currentConversation();
          const { memoryPrompt } = conversation;
          return {
            role: "system",
            content: Locale.Store.Prompt.History(memoryPrompt),
            date: "",
          } as Message;
        },

        getMessagesWithMemory: () => {
          const historyMessageCount = get().chatConfig.historyMessageCount;
          const { currentConversation } = get();
          const conversation = currentConversation();
          const { messages } = conversation;
          const n = messages.length;
          const recentMessages = messages.slice(n - historyMessageCount);

          const memoryPrompt = get().getMemoryPrompt();

          if (conversation.memoryPrompt) {
            recentMessages.unshift(memoryPrompt);
          }
          return recentMessages;
        },

        updateCurrentConversation: (updater) => {
          const { currentConversationUuid, conversations } = get();
          const idx = conversations.findIndex(
            (c) => c.uuid === currentConversationUuid
          );
          if (idx === -1) {
            throw new Error("Conversation not found");
          }
          updater(conversations[idx]);
          set({ conversations });
        },
      }),
      { name: LOCAL_KEY, version: 2 }
    )
  )
);
