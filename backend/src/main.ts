import { existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";
import { config } from "dotenv";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

config({ path: resolve(__dirname, "..", ".env") });

function parseAllowedOrigins(): string[] {
  const fromPlural = (process.env.FRONTEND_ORIGINS ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const fromSingle = (process.env.FRONTEND_ORIGIN ?? "").trim();
  const defaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://www.sqspeptides.com",
    "https://sq-speptides-frontend-inky.vercel.app",
  ];
  const all = [...fromPlural, ...(fromSingle ? [fromSingle] : []), ...defaults];
  return Array.from(new Set(all.map((o) => o.replace(/\/+$/, ""))));
}

async function bootstrap() {
  const uploadsRoot = join(process.cwd(), "uploads");
  if (!existsSync(uploadsRoot)) {
    mkdirSync(uploadsRoot, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(uploadsRoot, { prefix: "/uploads/" });
  const allowedOrigins = parseAllowedOrigins();
  app.enableCors({
    origin: (origin, cb) => {
      // Allow server-to-server and health checks with no Origin header.
      if (!origin) return cb(null, true);
      const normalized = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalized)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  const port = process.env.PORT ?? 3001;
  const host = process.env.HOST ?? "0.0.0.0";
  await app.listen(Number(port), host);
  console.log(`API listening on http://${host}:${port}`);
  console.log(`CORS origins: ${allowedOrigins.join(", ")}`);
}

bootstrap();
