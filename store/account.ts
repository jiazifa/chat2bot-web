import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Account {
  id: number;
  uuid: string;
  email: string;
  createAt: number;
}

export interface AccountConfig {
  accounts: { [key: string]: Account };
}

const DEFAULT_CONFIG: AccountConfig = {
  accounts: {},
};

interface AccountStore {
  config: AccountConfig;
  selfAccountUuid: string;

  getConfig(): AccountConfig;
  resetConfig(): void;
  updateConfig(updater: (config: AccountConfig) => void): void;
  clearAllData(): void;

  getSelfAccount(): Account | undefined;

  getSelfAccountToken(): string | undefined;

  addAccount(account: Account): void;
  loginAccount(account: Account & { token: string }): void;
  logOutAccount(): void;
}

const LOCAL_KEY = "chat-account-store";
export const TOKEN_KEY = "chat-account-token";

export const ACCOUNT_STAT_CHANGED_EVENT = "account-stat-changed";

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      config: { ...DEFAULT_CONFIG },
      selfAccountUuid: "",
      selfAccountToken: "",

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

      getSelfAccount() {
        const token = localStorage.getItem(TOKEN_KEY) ?? "";
        if (token.length === 0) {
          return undefined;
        }
        const { config, selfAccountUuid } = get();
        return config.accounts[selfAccountUuid];
      },

      addAccount(account) {
        set((state) => {
          const { config } = state;
          config.accounts[account.uuid] = account;
          return { config };
        });
      },

      loginAccount(account) {
        this.addAccount(account);
        localStorage.setItem(TOKEN_KEY, account.token);
        window.dispatchEvent(new Event(ACCOUNT_STAT_CHANGED_EVENT));
        set(() => ({
          selfAccountUuid: account.uuid,
          selfAccountToken: account.token,
        }));
      },

      logOutAccount() {
        localStorage.setItem(TOKEN_KEY, "");
        set(() => ({ selfAccountUuid: "", selfAccountToken: "" }));
      },

      getSelfAccountToken() {
        const token = localStorage.getItem(TOKEN_KEY) ?? "";
        if (token.length === 0) {
          return undefined;
        }
        return token;
      },
    }),
    { name: LOCAL_KEY, version: 1 }
  )
);
