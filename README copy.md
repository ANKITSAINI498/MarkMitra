# MarkFlow — Modern Markdown Workspace

A futuristic, responsive React Markdown workspace with document management, live preview, local persistence, templates, import/export, command palette, shortcuts, settings and glassmorphism UI.

## Run locally

Requires Node.js 18+ (Node 20/22/24 recommended).

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Notes

- Documents and preferences persist in LocalStorage.
- `src/services/markdownApi.js` is the REST API boundary. The UI does not depend on an API being online.
- Local JSON lives in `public/data/` and can be replaced by a backend later.
- Markdown rendering is implemented with a safe, allowlisted URL pattern and escaped HTML rather than injecting raw Markdown HTML.
- `.md` import is limited to 5 MB.
