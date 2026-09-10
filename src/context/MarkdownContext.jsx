import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { storage } from "../utils/storage";
import { uid } from "../utils/markdownHelpers";
import { validDoc } from "../utils/validation";
const C = createContext(null);
const defaults = {
  theme: "dark",
  mode: "split",
  sidebar: true,
  fontSize: 15,
  lineHeight: 1.7,
  wordWrap: true,
  lineNumbers: true,
  autoSave: true,
  reducedMotion: false,
  sidebarWidth: 270,
};
const fallback = [
  {
    id: "doc-welcome",
    title: "Welcome to MarkFlow",
    content:
      '# Welcome to MarkFlow 🚀\n\nA **modern Markdown workspace** for developers.\n\n## Quick start\n\n1. Create a document\n2. Write Markdown\n3. Preview it live\n\n```javascript\nconst hello = "MarkFlow";\nconsole.log(hello);\n```',
    favorite: true,
    archived: false,
    category: "recent",
    tags: ["markdown", "welcome"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
export function MarkdownProvider({ children }) {
  const [documents, setDocuments] = useState(() => {
    const saved = storage.get("markflow.documents", null);
    if (Array.isArray(saved)) {
      const good = saved.filter(validDoc);
      if (good.length) return good;
    }
    return fallback;
  });
  const [activeId, setActiveId] = useState(() =>
    storage.get("markflow.active", null),
  );
  const [settings, setSettings] = useState(() => ({
    ...defaults,
    ...storage.get("markflow.settings", {}),
  }));
  const [status, setStatus] = useState("Saved");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!activeId || !documents.some((d) => d.id === activeId))
      setActiveId(documents[0]?.id || null);
  }, [documents, activeId]);
 useEffect(() => {
  storage.set('markflow.documents', documents);
}, [documents]);

useEffect(() => {
  storage.set('markflow.active', activeId);
}, [activeId]);

useEffect(() => {
  storage.set('markflow.settings', settings);
}, [settings]);
  const activeDocument = useMemo(
    () => documents.find((d) => d.id === activeId) || null,
    [documents, activeId],
  );
  const notify = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.clearTimeout(window.__mfToast);
    window.__mfToast = window.setTimeout(() => setToast(null), 2600);
  }, []);
  const updateDocument = useCallback(
    (patch) => {
      setStatus("Unsaved");
      setDocuments((ds) =>
        ds.map((d) =>
          d.id === activeId
            ? { ...d, ...patch, updatedAt: new Date().toISOString() }
            : d,
        ),
      );
    },
    [activeId],
  );
  const createDocument = useCallback(
    (title = "Untitled.md", content = "") => {
      const d = {
        id: uid(),
        title: title.endsWith(".md") ? title : `${title}.md`,
        content,
        favorite: false,
        archived: false,
        category: "recent",
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDocuments((ds) => [d, ...ds]);
      setActiveId(d.id);
      setStatus("Saved");
      notify("Document created");
      return d;
    },
    [notify],
  );
  const deleteDocument = useCallback(
    (id) => {
      setDocuments((ds) => {
        const next = ds.filter((d) => d.id !== id);
        if (id === activeId) setActiveId(next[0]?.id || null);
        return next;
      });
      notify("Document deleted");
    },
    [activeId, notify],
  );
  const renameDocument = useCallback(
    (id, title) => {
      setDocuments((ds) =>
        ds.map((d) =>
          d.id === id
            ? {
                ...d,
                title: title.trim().endsWith(".md")
                  ? title.trim()
                  : `${title.trim() || "Untitled"}.md`,
                updatedAt: new Date().toISOString(),
              }
            : d,
        ),
      );
      notify("Document renamed");
    },
    [notify],
  );
  const duplicateDocument = useCallback(
    (id) => {
      const src = documents.find((d) => d.id === id);
      if (!src) return;
      const d = {
        ...src,
        id: uid(),
        title: src.title.replace(/\.md$/i, "") + " Copy.md",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDocuments((ds) => [d, ...ds]);
      setActiveId(d.id);
      notify("Document duplicated");
    },
    [documents, notify],
  );
  const toggle = useCallback(
    (id, key) =>
      setDocuments((ds) =>
        ds.map((d) =>
          d.id === id
            ? { ...d, [key]: !d[key], updatedAt: new Date().toISOString() }
            : d,
        ),
      ),
    [],
  );
  const value = {
    documents,
    activeDocument,
    activeId,
    setActiveId,
    settings,
    setSettings,
    status,
    setStatus,
    toast,
    notify,
    search,
    setSearch,
    updateDocument,
    createDocument,
    deleteDocument,
    renameDocument,
    duplicateDocument,
    toggle,
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
export const useMarkdown = () => useContext(C);
