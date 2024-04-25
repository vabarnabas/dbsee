import { create } from "zustand";

interface LocalStore {
  isEditorOpen: boolean;
  editorContent: string;
  savedUrls: string[];
  saveUrl: (url: string) => void;
  setEditorContent: (content: string) => void;
  openEditor: () => void;
  closeEditor: () => void;
}

const useLocalStore = create<LocalStore>()((set, get) => ({
  isEditorOpen: false,
  editorContent: "",
  savedUrls: [],
  saveUrl: (url) => {
    if (!get().savedUrls.includes(url)) {
      set((state) => ({ savedUrls: [...state.savedUrls, url] }));
    }
  },
  setEditorContent: (content) => set(() => ({ editorContent: content })),
  openEditor: () => set(() => ({ isEditorOpen: true })),
  closeEditor: () => set(() => ({ isEditorOpen: false })),
}));

export default useLocalStore;
