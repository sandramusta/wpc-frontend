interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}