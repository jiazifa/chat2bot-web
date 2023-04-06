import { create } from "zustand";
import { persist, devtools, combine } from "zustand/middleware";
import Locale from "../locales";
import { useAppStore } from "./app";

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
  // config: ChatConfig;
  conversations: ChatConversation[];
  currentConversationUuid: string;

  clearAllData: () => void;

  removeConversation: (uuid: string) => void;
  selectConversation: (uuid: string) => void;
  newConversation: () => void;
  currentConversation(): ChatConversation;

  //   onNewMessage: (message: Message) => void;
  onUserInput: (content: string) => Promise<void>;
  summarizeConversation: () => void;
  //   updateStat: (message: Message) => void;
  //   updateCurrentConversation: (updater: (conversation: ChatConversation) => void) => void;
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

        onUserInput: async (content: string) => {
          const userMessage = {
            role: "user",
            content,
            date: new Date().toLocaleString(),
          };

          const botMessage = {
            role: "assistant",
            content: "",
            date: new Date().toLocaleString(),
          };

          console.log("onUserInput", content);
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
          const historyMessageCount =
            useAppStore().chatConfig.historyMessageCount;
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
      }),
      { name: LOCAL_KEY, version: 2 }
    )
  )
);
