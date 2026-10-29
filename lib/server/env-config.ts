import fs from "fs";
import path from "path";

const ENV_LOCAL_PATH = path.resolve(process.cwd(), ".env.local");

export type CrossmintEnvConfig = {
  env: "production" | "staging";
  projectId: string;
  clientApiKey: string;
  serverApiKeyMasked: string;
  hasServerApiKey: boolean;
  recipientWallet: string;
  returningEmail: string;
  stellarLocator: string;
  sandboxBaseUrl: string;
  productionBaseUrl: string;
  sandboxConsoleUrl: string;
  productionConsoleUrl: string;
};

export function readCrossmintConfig(): CrossmintEnvConfig {
  const envRaw = (process.env.NEXT_PUBLIC_CROSSMINT_ENV ?? "").trim().toLowerCase();
  const env: "production" | "staging" =
    envRaw === "production" || envRaw === "prod" || envRaw === "live"
      ? "production"
      : "staging";

  const projectId = (process.env.NEXT_PUBLIC_CROSSMINT_PROJECT_ID ?? "").trim();
  const clientApiKey = (process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_SIDE_API_KEY ?? "").trim();
  const serverApiKey = (process.env.CROSSMINT_SERVER_SIDE_API_KEY ?? "").trim();

  const recipientWallet = (
    process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_WALLET ||
    process.env.NEXT_PUBLIC_ONRAMP_RECIPIENT_SOLANA ||
    "CDRL6CLJMJSLXCK2VTPJWHQRMI7EXG6BZYT7XTMH7DMMNDEDP6N4GKJ3"
  ).trim();

  const returningEmail = (
    process.env.NEXT_PUBLIC_ONRAMP_RETURNING_EMAIL ||
    "demos+onramp-existing-user@crossmint.com"
  ).trim();

  const stellarLocator =
    env === "production"
      ? "stellar:CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75"
      : "stellar:CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA";

  const serverApiKeyMasked = serverApiKey
    ? serverApiKey.length > 12
      ? `${serverApiKey.slice(0, 11)}••••••••${serverApiKey.slice(-4)}`
      : "••••••••"
    : "";

  return {
    env,
    projectId,
    clientApiKey,
    serverApiKeyMasked,
    hasServerApiKey: Boolean(serverApiKey),
    recipientWallet,
    returningEmail,
    stellarLocator,
    sandboxBaseUrl: "https://staging.crossmint.com",
    productionBaseUrl: "https://www.crossmint.com",
    sandboxConsoleUrl: "https://staging.crossmint.com/console",
    productionConsoleUrl: "https://www.crossmint.com/console",
  };
}

export function updateEnvLocalKeys(updates: Record<string, string>): void {
  let content = "";
  if (fs.existsSync(ENV_LOCAL_PATH)) {
    content = fs.readFileSync(ENV_LOCAL_PATH, "utf8");
  }

  const lines = content.split(/\r?\n/);
  const remainingKeys = new Set(Object.keys(updates));

  const newLines = lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;
    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) return line;
    const key = line.slice(0, eqIdx).trim();
    if (remainingKeys.has(key)) {
      const val = updates[key];
      remainingKeys.delete(key);
      process.env[key] = val;
      return `${key}=${val}`;
    }
    return line;
  });

  // Append any keys that weren't found in the file
  for (const key of remainingKeys) {
    const val = updates[key];
    process.env[key] = val;
    newLines.push(`${key}=${val}`);
  }

  fs.writeFileSync(ENV_LOCAL_PATH, newLines.join("\n"), "utf8");
}
