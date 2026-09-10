import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import MarkdownEditor from "../components/editor/MarkdownEditor";
import MarkdownPreview from "../components/preview/MarkdownPreview";
import SettingsModal from "../components/dialogs/SettingsModal";
import ShortcutsModal from "../components/dialogs/ShortcutsModal";
import CommandPalette from "../components/dialogs/CommandPalette";
import { useMarkdown } from "../context/MarkdownContext";
import useAutoSave from "../hooks/useAutoSave";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { stats, uid } from "../utils/markdownHelpers";
export default function Workspace() {
  const {
    documents,
    settings,
    setSettings,
    setStatus,
    updateDocument,
    createDocument,
    activeDocument,
    notify,
  } = useMarkdown();
  const [settingsOpen, setSettingsOpen] = useState(false),
    [shortcutsOpen, setShortcutsOpen] = useState(false),
    [commandOpen, setCommandOpen] = useState(false),
    [searchOpen, setSearchOpen] = useState(false);
  useAutoSave(settings.autoSave, documents, setStatus);
  const save = () => {
    try {
      localStorage.setItem("markflow.documents", JSON.stringify(documents));
      setStatus("Saved");
      notify("Document saved");
    } catch {
      setStatus("Save failed");
      notify("Unable to save document", "error");
    }
  };
  useEffect(() => {
    const saveH = () => save(),
      setH = () => setSettingsOpen(true),
      cmd = () => setCommandOpen(true),
      search = () => setSearchOpen(true),
      templates = () => (location.href = "/templates"),
      imported = (e) => {
        const f = e.detail;
        if (!f?.content && f?.content !== "") return;
        createDocument(f.name, f.content);
        notify("File imported");
      };
    window.addEventListener("markflow:save", saveH);
    window.addEventListener("markflow:settings", setH);
    window.addEventListener("markflow:command", cmd);
    window.addEventListener("markflow:search", search);
    window.addEventListener("markflow:templates", templates);
    window.addEventListener("markflow:createImported", imported);
    return () => {
      window.removeEventListener("markflow:save", saveH);
      window.removeEventListener("markflow:settings", setH);
      window.removeEventListener("markflow:command", cmd);
      window.removeEventListener("markflow:search", search);
      window.removeEventListener("markflow:templates", templates);
      window.removeEventListener("markflow:createImported", imported);
    };
  }, [documents, settings, setSettings, setStatus, notify, createDocument]);
  useKeyboardShortcuts({
    onSave: save,
    onSearch: () => setSearchOpen(true),
    onCommand: () => setCommandOpen(true),
    onBold: () => document.querySelector("textarea")?.focus(),
    onItalic: () => document.querySelector("textarea")?.focus(),
    onEscape: () => {
      setSettingsOpen(false);
      setShortcutsOpen(false);
      setCommandOpen(false);
      setSearchOpen(false);
    },
  });
  return (
    <AppLayout>
      <main className={`workspace-main mode-${settings.mode}`}>
        {searchOpen && (
          <div className="inline-search">
            <input
              autoFocus
              placeholder="Search in current document..."
              onChange={(e) => {
                const q = e.target.value.toLowerCase();
                if (
                  q &&
                  activeDocument &&
                  !activeDocument.content.toLowerCase().includes(q)
                )
                  notify("No match found");
              }}
            />
            <button onClick={() => setSearchOpen(false)}>Close</button>
          </div>
        )}
        <div className="panels">
          <MarkdownEditor />
          <MarkdownPreview />
        </div>
      </main>
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <ShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSettings={() => setSettingsOpen(true)}
        onShortcuts={() => setShortcutsOpen(true)}
      />
    </AppLayout>
  );
}
