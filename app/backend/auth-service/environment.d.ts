declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      POSTGRES_HOST: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      POSTGRES_PORT: number;
    }
  }
}

export {};
