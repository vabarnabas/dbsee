import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PersistingStore {
  savedUrls: string[];
  saveUrl: (url: string) => void;
}

const usePersistingStore = create<PersistingStore>()(
  persist(
    (set, get) => ({
      savedUrls: [],
      saveUrl: (url) => {
        if (!get().savedUrls.includes(url)) {
          set((state) => ({ savedUrls: [...state.savedUrls, url] }));
        }
      },
    }),
    { name: "persisting-storage" }
  )
);

export default usePersistingStore;
