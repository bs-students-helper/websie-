/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CODE_EXECUTION_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
