/// <reference types="vite/client" />

declare module '@revealjs/react'
declare module 'reveal.js/plugin/highlight/highlight.esm.js'

interface ImportMetaEnv {
  // Reserved for future overrides if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
