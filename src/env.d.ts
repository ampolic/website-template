/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_CONTACT_FORM_ACTION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
