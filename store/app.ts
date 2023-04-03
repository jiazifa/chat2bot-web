import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppConfig {
  language: string;
}

const DEFAULT_CONFIG: AppConfig = {
  language: "cn",
};

interface AppStore {
  config: AppConfig;

  getConfig(): AppConfig;
  resetConfig(): void;
  updateConfig(updater: (config: AppConfig) => void): void;
  clearAllData(): void;
}

const LOCAL_KEY = "chat-app-store";

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },

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
        set(() => ({ config: { ...DEFAULT_CONFIG } }));
      },
    }),
    { name: LOCAL_KEY, version: 1 }
  )
);
