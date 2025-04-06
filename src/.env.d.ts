/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DESCOPE_PROJECT_ID: string
  readonly VITE_DESCOPE_AUTH_URL: string
  readonly VITE_API_URL: string
  readonly VITE_MIXPANEL_TOKEN: string
  readonly VITE_MIXPANEL_PROXY: string
  readonly VITE_LANDING_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}