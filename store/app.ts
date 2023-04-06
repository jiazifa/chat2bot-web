import { create } from "zustand";
import { persist, combine, devtools } from "zustand/middleware";

export interface AppConfig {
  language: string;

  theme: Theme;
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

const DEFAULT_APP_CONFIG: AppConfig = {
  language: "cn",

  theme: Theme.Auto as Theme,
};

interface AppStore {
  appConfig: AppConfig;

  resetConfig(): void;

  updateAppConfig: (updater: (config: AppConfig) => void) => void;
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
        },
        (set, get) => ({
          resetConfig: () =>
            set({
              appConfig: DEFAULT_APP_CONFIG,
            }),

          updateAppConfig: (updater) =>
            set((state) => {
              const config = { ...state.appConfig };
              updater(config);
              return { appConfig: config };
            }),

          // end
        })
      ),
      { name: LOCAL_KEY, version: 1 }
    )
  )
);
