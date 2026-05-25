import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { resolveMongoUri } from "./mongoUri.js";

const serverRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
dotenv.config({ path: path.join(serverRoot, ".env") });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  REDIS_ENABLED: boolean;
  REDIS_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  GOOGLE_GEMINI_API_KEY: string;
  GOOGLE_GEMINI_MODEL: string;
  LLM_PROVIDER: "gemini" | "openai" | "anthropic";
  WS_CORS_ORIGIN: string;
}

export const env: EnvConfig = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: resolveMongoUri(),
  REDIS_ENABLED: process.env.REDIS_ENABLED !== "false",
  REDIS_URL: process.env.REDIS_URL || "",
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY || "",
  GOOGLE_GEMINI_MODEL: process.env.GOOGLE_GEMINI_MODEL || "gemini-2.0-flash",
  LLM_PROVIDER:
    (process.env.LLM_PROVIDER as EnvConfig["LLM_PROVIDER"]) || "gemini",
  WS_CORS_ORIGIN: process.env.WS_CORS_ORIGIN || "http://localhost:3000",
};

// Validate required env vars
export function validateEnv(): void {
  const required: (keyof EnvConfig)[] = ["MONGODB_URI"];

  if (env.LLM_PROVIDER === "gemini" && !env.GOOGLE_GEMINI_API_KEY) {
    console.warn(
      "⚠️  GOOGLE_GEMINI_API_KEY not set. AI generation will fail."
    );
  }

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
