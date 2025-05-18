
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_USERNAME?: string;
  readonly VITE_API_PASSWORD?: string;
  readonly VITE_FRONTEND_URL?: string;
  readonly VITE_FRONTEND_USERNAME?: string;
  readonly VITE_FRONTEND_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
