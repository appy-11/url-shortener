/**
 * Type definitions for Vite environment variables.
 * This file provides type safety for accessing environment variables in a Vite project.
 * It defines the structure of the `ImportMetaEnv` interface, which includes the expected environment variables.
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_SHORT_URL_DOMAIN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}