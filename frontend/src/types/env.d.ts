/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_API_HOST: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CSRF_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
