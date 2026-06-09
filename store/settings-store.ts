import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Language = "English" | "Telugu" | "Hindi";

type SettingsState = {
  theme: Theme;
  language: Language;
  voiceMode: boolean;
  notifications: boolean;
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleVoiceMode: () => void;
  toggleNotifications: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      language: "English",
      voiceMode: true,
      notifications: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      toggleVoiceMode: () => set((state) => ({ voiceMode: !state.voiceMode })),
      toggleNotifications: () => set((state) => ({ notifications: !state.notifications }))
    }),
    { name: "oncomind-settings" }
  )
);
