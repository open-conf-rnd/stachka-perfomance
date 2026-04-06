/// <reference types="vite/client" />

declare module '*.html?raw' {
  const content: string
  export default content
}

declare module '@revealjs/react'
declare module 'reveal.js/plugin/highlight/highlight.esm.js'

interface ImportMetaEnv {
  readonly VITE_TG_BOT_USERNAME?: string
  readonly VITE_VK_MINI_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
