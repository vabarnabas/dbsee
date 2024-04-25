import { create } from "zustand";

interface LocalStore {
  isEditorOpen: boolean;
  editorContent: string;
  currentDatabase: string;
  setCurrentDatabase: (connectionString: string) => void;
  setEditorContent: (content: string) => void;
  openEditor: () => void;
  closeEditor: () => void;
}

const useLocalStore = create<LocalStore>()((set, get) => ({
  isEditorOpen: false,
  editorContent: "",
  currentDatabase: "",
  setCurrentDatabase: (connectionString) =>
    set(() => ({ currentDatabase: connectionString })),
  setEditorContent: (content) => set(() => ({ editorContent: content })),
  openEditor: () => set(() => ({ isEditorOpen: true })),
  closeEditor: () => set(() => ({ isEditorOpen: false })),
}));

export default useLocalStore;
