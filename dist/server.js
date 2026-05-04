// src/app.ts
import express2 from "express";
import cors from "cors";

// src/config/prisma.ts
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.7.0",
  "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
  "activeProvider": "mysql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "mysql"\n}\n\nmodel User {\n  id            Int            @id @default(autoincrement())\n  fullName      String\n  email         String         @unique\n  password      String\n  isVerified    Boolean        @default(false)\n  googleId      String?        @unique\n  avatar        String?\n  provider      String?        @default("local")\n  tasks         Task[]\n  refreshTokens RefreshToken[]\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime?      @updatedAt\n\n  @@map("users")\n}\n\nmodel Task {\n  id          Int       @id @default(autoincrement())\n  title       String\n  description String?\n  status      String    @default("pending") // "pending", "in_progress", "completed"\n  priority    Int       @default(1) // 0: low, 1: medium, 2: high\n  deadline    DateTime?\n  userId      Int\n  user        User      @relation(fields: [userId], references: [id])\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime? @updatedAt\n\n  @@map("tasks")\n}\n\nmodel AuthToken {\n  id        Int      @id @default(autoincrement())\n  email     String\n  type      String //"verify_email" or "reset_password"\n  token     String\n  isUsed    Boolean  @default(false)\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  @@index([email, type, createdAt])\n  @@index([email, type, isUsed])\n  @@map("authTokens")\n}\n\nmodel RefreshToken {\n  id        Int      @id @default(autoincrement())\n  token     String   @unique\n  userId    Int\n  user      User     @relation(fields: [userId], references: [id])\n  expiresAt DateTime\n  revoked   Boolean  @default(false)\n  createdAt DateTime @default(now())\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"isVerified","kind":"scalar","type":"Boolean"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"avatar","kind":"scalar","type":"String"},{"name":"provider","kind":"scalar","type":"String"},{"name":"tasks","kind":"object","type":"Task","relationName":"TaskToUser"},{"name":"refreshTokens","kind":"object","type":"RefreshToken","relationName":"RefreshTokenToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"users"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"priority","kind":"scalar","type":"Int"},{"name":"deadline","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"TaskToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"tasks"},"AuthToken":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"email","kind":"scalar","type":"String"},{"name":"type","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"isUsed","kind":"scalar","type":"Boolean"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"authTokens"},"RefreshToken":{"fields":[{"name":"id","kind":"scalar","type":"Int"},{"name":"token","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"Int"},{"name":"user","kind":"object","type":"User","relationName":"RefreshTokenToUser"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"revoked","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","tasks","refreshTokens","_count","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.updateOne","User.updateMany","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_avg","_sum","_min","_max","User.groupBy","User.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.updateOne","Task.updateMany","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","AuthToken.findUnique","AuthToken.findUniqueOrThrow","AuthToken.findFirst","AuthToken.findFirstOrThrow","AuthToken.findMany","AuthToken.createOne","AuthToken.createMany","AuthToken.updateOne","AuthToken.updateMany","AuthToken.upsertOne","AuthToken.deleteOne","AuthToken.deleteMany","AuthToken.groupBy","AuthToken.aggregate","RefreshToken.findUnique","RefreshToken.findUniqueOrThrow","RefreshToken.findFirst","RefreshToken.findFirstOrThrow","RefreshToken.findMany","RefreshToken.createOne","RefreshToken.createMany","RefreshToken.updateOne","RefreshToken.updateMany","RefreshToken.upsertOne","RefreshToken.deleteOne","RefreshToken.deleteMany","RefreshToken.groupBy","RefreshToken.aggregate","AND","OR","NOT","id","token","userId","expiresAt","revoked","createdAt","equals","not","in","notIn","lt","lte","gt","gte","contains","startsWith","endsWith","search","email","type","isUsed","title","description","status","priority","deadline","updatedAt","fullName","password","isVerified","googleId","avatar","provider","every","some","none","is","isNot","_relevance","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "0wEiOA8EAACBAQAgBQAAggEAIEcAAH4AMEgAAA4AEEkAAH4AMEoCAAAAAU9AAHQAIVwBAAAAAWRAAIABACFlAQByACFmAQByACFnIABzACFoAQAAAAFpAQB_ACFqAQB_ACEBAAAAAQAgDQMAAIQBACBHAACFAQAwSAAAAwAQSQAAhQEAMEoCAHEAIUwCAHEAIU9AAHQAIV8BAHIAIWABAH8AIWEBAHIAIWICAHEAIWNAAIABACFkQACAAQAhBQMAAMUBACBgAACXAQAgYwAAlwEAIGQAAJcBACBwAADHAQAgDQMAAIQBACBHAACFAQAwSAAAAwAQSQAAhQEAMEoCAAAAAUwCAHEAIU9AAHQAIV8BAHIAIWABAH8AIWEBAHIAIWICAHEAIWNAAIABACFkQACAAQAhAwAAAAMAIAEAAAQAMAIAAAUAIAoDAACEAQAgRwAAgwEAMEgAAAcAEEkAAIMBADBKAgBxACFLAQByACFMAgBxACFNQAB0ACFOIABzACFPQAB0ACECAwAAxQEAIHAAAMYBACAKAwAAhAEAIEcAAIMBADBIAAAHABBJAACDAQAwSgIAAAABSwEAAAABTAIAcQAhTUAAdAAhTiAAcwAhT0AAdAAhAwAAAAcAIAEAAAgAMAIAAAkAIAEAAAADACABAAAABwAgAQAAAAEAIA8EAACBAQAgBQAAggEAIEcAAH4AMEgAAA4AEEkAAH4AMEoCAHEAIU9AAHQAIVwBAHIAIWRAAIABACFlAQByACFmAQByACFnIABzACFoAQB_ACFpAQB_ACFqAQB_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_ACFpAQB_ACFqAQB_ACEMUAEAAAABUQEAfAAhUgEAAAAFUwEAAAAFVAEAAAABVQEAAAABVgEAAAABVwEAAAABWAEAAAABWQEAAAABWgEAAAABWwEAAAABCFBAAAAAAVFAAHoAIVJAAAAABVNAAAAABVRAAAAAAVVAAAAAAVZAAAAAAVdAAAAAAQNrAAADACBsAAADACBtAAADACADawAABwAgbAAABwAgbQAABwAgCgMAAIQBACBHAACDAQAwSAAABwAQSQAAgwEAMEoCAHEAIUsBAHIAIUwCAHEAIU1AAHQAIU4gAHMAIU9AAHQAIREEAACBAQAgBQAAggEAIEcAAH4AMEgAAA4AEEkAAH4AMEoCAHEAIU9AAHQAIVwBAHIAIWRAAIABACFlAQByACFmAQByACFnIABzACFoAQB_ACFpAQB_ACFqAQB_ACFuAAAOACBvAAAOACANAwAAhAEAIEcAAIUBADBIAAADABBJAACFAQAwSgIAcQAhTAIAcQAhT0AAdAAhXwEAcgAhYAEAfwAhYQEAcgAhYgIAcQAhY0AAgAEAIWRAAIABACEAAAAAAAF0AQAAAAEBdEAAAAABAXQgAAAAAQV0AgAAAAF6AgAAAAF7AgAAAAF8AgAAAAF9AgAAAAEFEQAAzwEAIBIAANIBACBxAADQAQAgcgAA0QEAIHcAAAEAIAMRAADPAQAgcQAA0AEAIHcAAAEAIAAAAAAAAVsBAAAAAQAAAAAAAAF0AQAAAAEBdEAAAAABBREAAMoBACASAADNAQAgcQAAywEAIHIAAMwBACB3AAABACADEQAAygEAIHEAAMsBACB3AAABACAAAAAAAAsRAAC0AQAwEgAAuQEAMHEAALUBADByAAC2AQAwcwAAtwEAIHQAALgBADB1AAC4AQAwdgAAuAEAMHcAALgBADB4AAC6AQAweQAAuwEAMAsRAACoAQAwEgAArQEAMHEAAKkBADByAACqAQAwcwAAqwEAIHQAAKwBADB1AACsAQAwdgAArAEAMHcAAKwBADB4AACuAQAweQAArwEAMAVKAgAAAAFLAQAAAAFNQAAAAAFOIAAAAAFPQAAAAAECAAAACQAgEQAAswEAIAMAAAAJACARAACzAQAgEgAAsgEAIAEMAADJAQAwCgMAAIQBACBHAACDAQAwSAAABwAQSQAAgwEAMEoCAAAAAUsBAAAAAUwCAHEAIU1AAHQAIU4gAHMAIU9AAHQAIQIAAAAJACAMAACyAQAgAgAAALABACAMAACxAQAgCUcAAK8BADBIAACwAQAQSQAArwEAMEoCAHEAIUsBAHIAIUwCAHEAIU1AAHQAIU4gAHMAIU9AAHQAIQlHAACvAQAwSAAAsAEAEEkAAK8BADBKAgBxACFLAQByACFMAgBxACFNQAB0ACFOIABzACFPQAB0ACEFSgIAjgEAIUsBAIsBACFNQACMAQAhTiAAjQEAIU9AAIwBACEFSgIAjgEAIUsBAIsBACFNQACMAQAhTiAAjQEAIU9AAIwBACEFSgIAAAABSwEAAAABTUAAAAABTiAAAAABT0AAAAABCEoCAAAAAU9AAAAAAV8BAAAAAWABAAAAAWEBAAAAAWICAAAAAWNAAAAAAWRAAAAAAQIAAAAFACARAAC_AQAgAwAAAAUAIBEAAL8BACASAAC-AQAgAQwAAMgBADANAwAAhAEAIEcAAIUBADBIAAADABBJAACFAQAwSgIAAAABTAIAcQAhT0AAdAAhXwEAcgAhYAEAfwAhYQEAcgAhYgIAcQAhY0AAgAEAIWRAAIABACECAAAABQAgDAAAvgEAIAIAAAC8AQAgDAAAvQEAIAxHAAC7AQAwSAAAvAEAEEkAALsBADBKAgBxACFMAgBxACFPQAB0ACFfAQByACFgAQB_ACFhAQByACFiAgBxACFjQACAAQAhZEAAgAEAIQxHAAC7AQAwSAAAvAEAEEkAALsBADBKAgBxACFMAgBxACFPQAB0ACFfAQByACFgAQB_ACFhAQByACFiAgBxACFjQACAAQAhZEAAgAEAIQhKAgCOAQAhT0AAjAEAIV8BAIsBACFgAQCdAQAhYQEAiwEAIWICAI4BACFjQACeAQAhZEAAngEAIQhKAgCOAQAhT0AAjAEAIV8BAIsBACFgAQCdAQAhYQEAiwEAIWICAI4BACFjQACeAQAhZEAAngEAIQhKAgAAAAFPQAAAAAFfAQAAAAFgAQAAAAFhAQAAAAFiAgAAAAFjQAAAAAFkQAAAAAEEEQAAtAEAMHEAALUBADBzAAC3AQAgdwAAuAEAMAQRAACoAQAwcQAAqQEAMHMAAKsBACB3AACsAQAwAAABWwEAAAABBwQAAMIBACAFAADDAQAgZAAAlwEAIGgAAJcBACBpAACXAQAgagAAlwEAIHAAAMQBACABWwEAAAABAVsBAAAAAQhKAgAAAAFPQAAAAAFfAQAAAAFgAQAAAAFhAQAAAAFiAgAAAAFjQAAAAAFkQAAAAAEFSgIAAAABSwEAAAABTUAAAAABTiAAAAABT0AAAAABCwUAAMEBACBKAgAAAAFPQAAAAAFcAQAAAAFkQAAAAAFlAQAAAAFmAQAAAAFnIAAAAAFoAQAAAAFpAQAAAAFqAQAAAAECAAAAAQAgEQAAygEAIAMAAAAOACARAADKAQAgEgAAzgEAIA0AAAAOACAFAACnAQAgDAAAzgEAIEoCAI4BACFPQACMAQAhXAEAiwEAIWRAAJ4BACFlAQCLAQAhZgEAiwEAIWcgAI0BACFoAQCdAQAhaQEAnQEAIWoBAJ0BACELBQAApwEAIEoCAI4BACFPQACMAQAhXAEAiwEAIWRAAJ4BACFlAQCLAQAhZgEAiwEAIWcgAI0BACFoAQCdAQAhaQEAnQEAIWoBAJ0BACELBAAAwAEAIEoCAAAAAU9AAAAAAVwBAAAAAWRAAAAAAWUBAAAAAWYBAAAAAWcgAAAAAWgBAAAAAWkBAAAAAWoBAAAAAQIAAAABACARAADPAQAgAwAAAA4AIBEAAM8BACASAADTAQAgDQAAAA4AIAQAAKYBACAMAADTAQAgSgIAjgEAIU9AAIwBACFcAQCLAQAhZEAAngEAIWUBAIsBACFmAQCLAQAhZyAAjQEAIWgBAJ0BACFpAQCdAQAhagEAnQEAIQsEAACmAQAgSgIAjgEAIU9AAIwBACFcAQCLAQAhZEAAngEAIWUBAIsBACFmAQCLAQAhZyAAjQEAIWgBAJ0BACFpAQCdAQAhagEAnQEAIQMEBgIFCgMGAAQBAwABAQMAAQIECwAFDAAABQYABxcACBgACRkAChoACwAAAAAABQYABxcACBgACRkAChoACwUGAA4XAA8YABAZABEaABIAAAAAAAUGAA4XAA8YABAZABEaABIABQYAFhcAFxgAGBkAGRoAGgAAAAAABQYAFhcAFxgAGBkAGRoAGgUGAB0XAB4YAB8ZACAaACEAAAAAAAUGAB0XAB4YAB8ZACAaACEHAgEIDQEJEAEKEQELEgENFAEOFgUPGAEQGgUTGwEUHAEVHQUbIAYcIQwdIgIeIwIfJAIgJQIhJgIiKAIjKgUkLAIlLgUmLwInMAIoMQUpNA0qNRMrNxQsOBQtOxQuPBQvPRQwPxQxQQUyQxQzRQU0RhQ1RxQ2SAU3SxU4TBs5TQM6TgM7TwM8UAM9UQM-UwM_VQVAVwNBWQVCWgNDWwNEXAVFXxxGYCI"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.mysql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.mysql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/prisma.ts
var adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : void 0,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5
});
var prisma = new PrismaClient({ adapter });

// src/helper/helper.ts
import jwt from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";
var isTodayOrFuture = (date) => {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate >= today;
};
var generateToken = (payload) => {
  const secretKey = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload, secretKey, { expiresIn });
};
var generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};
var delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// src/utils/appError.ts
var AppError = class _AppError extends Error {
  statusCode;
  errors;
  constructor(message, statusCode, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, _AppError.prototype);
  }
};

// src/services/auth.service.ts
import bcrypt, { compare } from "bcrypt";
import { OAuth2Client } from "google-auth-library";
var saltRounds = 10;
var hashPassword = async (planText) => {
  return await bcrypt.hash(planText, saltRounds);
};
var comparePassword = async (planText, hashed) => {
  return await compare(planText, hashed);
};
var isEmailExists = async (email) => {
  const emailExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  return !!emailExists;
};
var registerNewUser = async (fullName, email, password, otp) => {
  const emailExists = await isEmailExists(email);
  if (emailExists) {
    throw new AppError("Email already exists.", 400, [{ field: "email", message: "Email already exists." }]);
  }
  const otpRecord = await prisma.authToken.findFirst({
    where: {
      email,
      token: otp,
      isUsed: false,
      type: "verify_email",
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    }
  });
  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP.", 400, [{ field: "otp", message: "Invalid or expired OTP." }]);
  }
  await prisma.authToken.update({
    where: {
      id: otpRecord.id
    },
    data: {
      isUsed: true
    }
  });
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      isVerified: true
    }
  });
  return newUser;
};
var handleLogin = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) {
    throw new AppError("Invalid email or password.", 401);
  }
  const payload = {
    userId: user.id,
    email: user.email
  };
  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1e3
      )
    }
  });
  return { accessToken, refreshToken };
};
var handleRateLimit = async (email, token, time, type) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
  const count = await prisma.authToken.count({
    where: {
      email,
      type,
      createdAt: {
        gte: oneHourAgo
      }
    }
  });
  if (count >= 5) {
    throw new AppError("Too many password reset requests. Please try again later.", 429);
  }
  const latest = await prisma.authToken.findFirst({
    where: {
      email,
      type
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  if (latest && Date.now() - new Date(latest.createdAt).getTime() < 6e4) {
    throw new AppError("Wait 60 seconds", 429);
  }
  await prisma.authToken.updateMany({
    where: {
      email,
      type,
      isUsed: false
    },
    data: {
      isUsed: true
    }
  });
  const result = await prisma.authToken.create({
    data: {
      token,
      type,
      email,
      expiresAt: new Date(Date.now() + time * 60 * 1e3)
    },
    select: {
      expiresAt: true,
      token: true
    }
  });
  return result;
};
var sendOTP = async (email) => {
  const emailExists = await isEmailExists(email);
  if (emailExists) {
    throw new AppError("Email already exists.", 400, [{ field: "email", message: "Email already exists." }]);
  }
  const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
  const time = +process.env.TIME_LiMIT_OTP;
  const result = handleRateLimit(email, otp, time, "verify_email");
  return result;
};
var handleCleanOTPs = async () => {
  const result = prisma.authToken.deleteMany({
    where: {
      expiresAt: {
        lt: /* @__PURE__ */ new Date()
      }
    }
  });
  return result;
};
var client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
var handleGoogleLogin = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  const email = payload?.email;
  const fullName = payload?.name;
  const googleId = payload?.sub;
  const avatar = payload?.picture;
  if (!email || !fullName || !googleId) {
    throw new AppError("Google login failed: missing required user information.", 400);
  }
  let user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      fullName: true,
      googleId: true,
      avatar: true,
      provider: true
    }
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        fullName,
        password: "",
        // No password for Google accounts
        googleId,
        avatar,
        provider: "google",
        isVerified: true
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        googleId: true,
        avatar: true,
        provider: true
      }
    });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      googleId,
      provider: "google"
    }
  });
  const payloadToken = {
    userId: user.id,
    email: user.email
  };
  const token = generateToken(payloadToken);
  const refreshToken = generateRefreshToken();
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1e3
      )
    }
  });
  return {
    message: "Google login success",
    token,
    refreshToken,
    user
  };
};
var handleCreateToken = async (email, token) => {
  const existEmail = await isEmailExists(email);
  if (!existEmail) {
    throw new AppError("User not found.", 404);
  }
  const time = Number(process.env.RATE_LIMIT_FORGOT_PASSWORD);
  const result = await handleRateLimit(email, token, time, "forgot_password");
  return result;
};
var handleUpdateUserNewPassword = async (token, newPassword) => {
  const result = await prisma.authToken.findFirst({
    where: {
      isUsed: false,
      type: "forgot_password",
      token,
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    }
  });
  if (!result) {
    throw new AppError("Invalid or expired token.", 400);
  }
  await prisma.authToken.update({
    where: {
      id: result.id
    },
    data: {
      isUsed: true
    }
  });
  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: {
      email: result.email
    },
    data: {
      password: hashedPassword
    }
  });
};
var handleRefreshToken = async (refreshToken) => {
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    include: {
      user: true
    }
  });
  if (!tokenRecord) {
    throw new AppError("Invalid or expired refresh token.", 401);
  }
  if (tokenRecord.revoked) {
    throw new AppError("Refresh token revoked", 401);
  }
  const payload = {
    userId: tokenRecord.user.id,
    email: tokenRecord.user.email
  };
  const newAccessToken = generateToken(payload);
  return {
    accessToken: newAccessToken
  };
};
var handleLogout = async (userId, refreshToken) => {
  const result = await prisma.refreshToken.updateMany({
    where: {
      userId,
      revoked: false,
      token: refreshToken,
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    data: {
      revoked: true
    }
  });
  if (result.count === 0) {
    throw new AppError("Invalid refresh token or already logged out.", 400);
  }
};

// src/validation/auth.schema.ts
import z from "zod";
var emailSchema = z.email("Invalid email format.");
var passwordSchema = z.string().min(8, "Password must be at least 8 characters long.").max(20, "Password must be at most 20 characters long.").regex(/[A-Z]/, "Password must contain at least one uppercase letter.").regex(/[a-z]/, "Password must contain at least one lowercase letter.").regex(/[0-9]/, "Password must contain at least one number.");
var registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters long.").max(50, "Full name must be at most 50 characters long."),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  otp: z.string().trim().length(6, "OTP must be exactly 6 characters long.")
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords do not match.",
  path: ["confirmPassword"]
});
var loginSchema = z.object({
  email: z.email("Invalid email format."),
  password: z.string().min(1, "Password is required.")
});
var resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  error: "Passwords do not match.",
  path: ["confirmPassword"]
});
var refreshTokenSchema = z.string().trim().min(1, "refreshToken is required.");

// src/controllers/auth.controller.ts
import crypto2 from "crypto";

// src/utils/mailer.ts
import nodemailer from "nodemailer";
import "dotenv/config";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var sendOTPEmail = async (to, otp) => {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
        <h1 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Verify Your Account</h1>
        <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
          Thank you for signing up for Task App. Please use the following One-Time Password (OTP) to complete your verification process.
        </p>
        <div style="background-color: #f0f7ff; border: 2px dashed #0066cc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="margin: 0; color: #0066cc; font-size: 36px; letter-spacing: 5px;">${otp}</h2>
        </div>
        <p style="color: #999999; font-size: 14px; margin-bottom: 0;">
          If you didn't request this code, you can safely ignore this email.
        </p>
        <p style="color: #565555ff; font-size: 14px; margin-bottom: 0;">
          This OTP will expire in <span style="font-weight: bold; color: #0066cc;">5 minutes</span>.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p style="color: #aaaaaa; font-size: 12px;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Task App. All rights reserved.</p>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: `"Task App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify your account",
    html: htmlTemplate
  });
};
var sendResetPasswordEmail = async (to, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const htmlTemplate = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f4f7f6; padding: 20px; border-radius: 8px;"></div>
        <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
            <h1 style="color: #333333; margin-bottom: 20px; font-size: 24px;">Reset Your Password</h1>
            <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 30px;"></p>
                We received a request to reset your password. Click the button below to reset it.
            </p>
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
            <p style="color: #999999; font-size: 14px; margin-top: 30px;">
                If you didn't request a password reset, you can safely ignore this email.
            </p>
            <p style="color: #565555ff; font-size: 14px; margin-top: 0;">
                This link will expire in <span style="font-weight: bold; color: #0066cc;">15 minutes</span>.
            </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
            <p style="color: #aaaaaa; font-size: 12px;">\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} Task App. All rights reserved.</p>
        </div>
    </div>`;
  await transporter.sendMail({
    from: `"Task App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your password",
    html: htmlTemplate
  });
};

// src/controllers/auth.controller.ts
var createUserAPI = async (req, res) => {
  const { fullName, email, password, confirmPassword, otp } = req.body;
  const validation = await registerSchema.safeParseAsync({ fullName, email, password, confirmPassword, otp });
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const seenFields = /* @__PURE__ */ new Set();
    const firstErrors = errorZod.filter((err) => {
      const field = String(err.path[0] ?? "general");
      if (seenFields.has(field)) return false;
      seenFields.add(field);
      return true;
    }).map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  await registerNewUser(fullName, email, password, otp);
  return res.status(201).json({
    success: true,
    message: "User registered successfully."
  });
};
var loginAPI = async (req, res) => {
  const { email, password } = req.body;
  const validation = await loginSchema.safeParseAsync({ email, password });
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const seenFields = /* @__PURE__ */ new Set();
    const firstErrors = errorZod.filter((err) => {
      const field = String(err.path[0] ?? "general");
      if (seenFields.has(field)) return false;
      seenFields.add(field);
      return true;
    }).map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  const accessToken = await handleLogin(email, password);
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: { accessToken }
  });
};
var sendOTPAPI = async (req, res) => {
  const validation = await emailSchema.safeParseAsync(req.body.email);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const firstErrors = errorZod.map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  const result = await sendOTP(validation.data);
  sendOTPEmail(validation.data, result.token);
  await delay(2e3);
  return res.status(200).json({
    success: true,
    message: "OTP sent successfully."
  });
};
var googleLogin = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken || typeof idToken !== "string") {
    throw new AppError("Invalid or missing idToken.", 400, [{ field: "idToken", message: "idToken is required and must be a string." }]);
  }
  const result = await handleGoogleLogin(idToken);
  return res.status(201).json(result);
};
var handleForgotPassword = async (req, res) => {
  const validation = await emailSchema.safeParseAsync(req.body.email);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const firstErrors = errorZod.map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  const token = crypto2.randomBytes(32).toString("hex");
  const result = await handleCreateToken(validation.data, token);
  await sendResetPasswordEmail(validation.data, token);
  return res.status(200).json({
    success: true,
    message: "Password reset token generated successfully.",
    data: {
      email: validation.data,
      expires: result.expiresAt
    }
  });
};
var handleResetPassword = async (req, res) => {
  const { token } = req.params;
  const validation = await resetPasswordSchema.safeParseAsync(req.body);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const seenFields = /* @__PURE__ */ new Set();
    const firstErrors = errorZod.filter((err) => {
      const field = String(err.path[0] ?? "general");
      if (seenFields.has(field)) return false;
      seenFields.add(field);
      return true;
    }).map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  if (!token) {
    throw new AppError("Missing token.", 400, [{ field: "token", message: "Token is required." }]);
  }
  await handleUpdateUserNewPassword(token, validation.data.password);
  return res.status(200).json({
    success: true,
    message: "Password reset successfully."
  });
};
var refreshTokenController = async (req, res) => {
  const { refreshToken } = req.body;
  const validation = await refreshTokenSchema.safeParseAsync(refreshToken);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const firstErrors = errorZod.map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  const result = await handleRefreshToken(refreshToken);
  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully.",
    data: {
      accessToken: result.accessToken
    }
  });
};
var logoutController = async (req, res) => {
  const userId = req.user?.userId;
  const { refreshToken } = req.body;
  const validation = await refreshTokenSchema.safeParseAsync(refreshToken);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const firstErrors = errorZod.map((err) => ({
      field: String(err.path[0] ?? "general"),
      message: err.message
    }));
    throw new AppError("Validation failed.", 400, firstErrors);
  }
  await handleLogout(+userId, refreshToken);
  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
};

// src/utils/priority.mapper.ts
var PRIORITY_REVERSE = {
  low: 0,
  medium: 1,
  high: 2
};

// src/services/task.service.ts
var handleGetAllTasks = async (userId, status, priority, search, page, limit, sort) => {
  const statusFilter = status === "not_completed" ? { in: ["pending", "in_progress"] } : status ?? void 0;
  const where = {
    userId,
    status: statusFilter,
    priority: priority !== void 0 ? priority : void 0,
    title: search ? { contains: search } : void 0
  };
  const result = await prisma.task.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      deadline: true
    },
    skip: page && limit ? (page - 1) * limit : void 0,
    take: limit ?? void 0,
    orderBy: sort
  });
  const count = await prisma.task.count({ where });
  return { tasks: result, count };
};
var handleCreateTask = async (userId, taskData) => {
  const result = await prisma.task.create({
    data: {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      ...taskData.priority !== void 0 && { priority: PRIORITY_REVERSE[taskData.priority] },
      deadline: taskData.deadline,
      userId: +userId
    }
  });
  return result;
};
var handleFindTaskById = async (userId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      deadline: true
    }
  });
  return task;
};
var handleUpdateTask = async (userId, taskId, updateData) => {
  const id = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    },
    select: {
      id: true
    }
  });
  if (!id) {
    throw new AppError("Task not found or unauthorized.", 400);
  }
  const data = { ...updateData };
  if (updateData.priority !== void 0) {
    data.priority = PRIORITY_REVERSE[updateData.priority];
  }
  const result = await prisma.task.updateMany({
    where: {
      id: taskId,
      userId
    },
    data
  });
  return result;
};
var handleDeleteTask = async (userId, taskId) => {
  const id = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId
    },
    select: {
      id: true
    }
  });
  if (!id) {
    throw new AppError("Task not found or unauthorized.", 400);
  }
  const result = await prisma.task.deleteMany({
    where: {
      id: +taskId,
      userId: +userId
    }
  });
  return result;
};

// src/validation/task.schema.ts
import z2 from "zod";
var taskSchema = z2.object({
  title: z2.string().min(1, "Title is required.").max(100, "Title must be at most 100 characters long."),
  description: z2.string().max(500, "Description must be at most 500 characters long.").optional(),
  status: z2.enum(["pending", "in_progress", "completed"], "Invalid status value.").optional(),
  priority: z2.enum(["low", "medium", "high"], "Invalid priority value.").optional().transform((value) => {
    if (!value) return void 0;
    return value === "low" ? 0 : value === "medium" ? 1 : 2;
  }),
  deadline: z2.coerce.date().refine(isTodayOrFuture, {
    message: "Deadline must be today or in the future."
  })
});
var updateTaskSchema = taskSchema.partial();

// src/validation/taskQuery.schema.ts
import z3 from "zod";
var taskQuerySchema = z3.object({
  search: z3.string().trim().max(100, "Search query must be at most 100 characters long.").optional(),
  status: z3.enum(["pending", "in_progress", "completed", "not_completed"], "Invalid status value.").optional(),
  priority: z3.enum(["low", "medium", "high"], "Invalid priority value.").optional().transform((value) => {
    if (!value) return void 0;
    return value === "low" ? 0 : value === "medium" ? 1 : 2;
  }),
  page: z3.coerce.number().int().positive("Page must be a positive integer.").optional().default(1),
  limit: z3.coerce.number().int().positive("Limit must be a positive integer.").optional().default(10),
  sort: z3.enum(["deadline", "-deadline", "priority", "-priority"]).optional().transform((value) => {
    if (!value) return void 0;
    const direction = value.startsWith("-") ? "desc" : "asc";
    const field = value.startsWith("-") ? value.slice(1) : value;
    return {
      [field]: direction
    };
  })
});

// src/controllers/task.controller.ts
var getAllTasksAPI = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const validation = await taskQuerySchema.safeParseAsync(req.query);
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const errors = errorZod.map((item) => {
      return {
        field: String(item.path[0] ?? "general"),
        message: item.message
      };
    });
    throw new AppError("Validation failed", 400, errors);
  }
  const {
    status: taskStatus,
    priority,
    search,
    page,
    limit,
    sort
  } = validation.data;
  const result = await handleGetAllTasks(
    Number(userId),
    taskStatus,
    priority,
    search,
    page,
    limit,
    sort
  );
  return res.status(200).json({
    success: true,
    data: {
      tasks: result.tasks,
      count: result.count,
      page: page ?? 1,
      limit: limit ?? result.count
    }
  });
};
var createTaskAPI = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const { title, description, status, priority, deadline } = req.body;
  const validation = await taskSchema.safeParseAsync({ title, description, status, priority, deadline });
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const errors = errorZod.map((item) => {
      return {
        field: String(item.path[0] ?? "general"),
        message: item.message
      };
    });
    throw new AppError("Validation failed", 400, errors);
  }
  const task = await handleCreateTask(+userId, validation.data);
  return res.status(201).json({
    success: true,
    message: "Task created successfully.",
    data: task
  });
};
var getTaskByIdAPI = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    throw new AppError("Invalid task id.", 400);
  }
  const task = await handleFindTaskById(+userId, +taskId);
  if (!task) {
    throw new AppError("Task not found.", 404);
  }
  return res.status(200).json({
    success: true,
    data: task
  });
};
var editTaskAPI = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    throw new AppError("Invalid task id.", 400);
  }
  const { title, description, status, priority, deadline } = req.body;
  const validation = await updateTaskSchema.safeParseAsync({ title, description, status, priority, deadline });
  if (!validation.success) {
    const errorZod = validation.error.issues;
    const errors = errorZod.map((item) => {
      return {
        field: String(item.path[0] ?? "general"),
        message: item.message
      };
    });
    throw new AppError("Validation failed", 400, errors);
  }
  if (Object.keys(validation.data).length === 0) {
    throw new AppError("At least one field must be provided for update.", 400);
  }
  const result = await handleUpdateTask(+userId, +taskId, validation.data);
  if (result.count === 0) {
    throw new AppError("Task not found.", 404);
  }
  return res.status(200).json({
    success: true,
    message: "Task updated successfully."
  });
};
var deleteTaskAPI = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
  const taskId = Number(req.params.id);
  if (Number.isNaN(taskId)) {
    throw new AppError("Invalid task id.", 400);
  }
  const result = await handleDeleteTask(+userId, +taskId);
  if (result.count === 0) {
    throw new AppError("Task not found.", 404);
  }
  return res.status(200).json({
    success: true,
    message: "Task deleted successfully."
  });
};

// src/controllers/user.controller.ts
var getUser = (req, res) => {
  if (!req.user) {
    throw new AppError("User not authenticated.", 401);
  }
  return res.status(200).json({
    success: true,
    message: "User profile",
    data: { user: req.user }
  });
};

// src/middlewares/jwt.middleware.ts
import jwt2 from "jsonwebtoken";
var checkValidJWT = (req, res, next) => {
  const path2 = req.path;
  const whiteList = ["/login", "/register", "/send-otp", "/google-login", "/forgot-password", "/refresh-token"];
  if (whiteList.includes(path2) || path2.startsWith("/reset-password/")) {
    return next();
  }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }
  try {
    const dataDecoded = jwt2.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: dataDecoded.userId,
      email: dataDecoded.email
    };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// src/utils/asyncHandler.ts
var asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var asyncHandler_default = asyncHandler;

// src/routes/api.ts
import express from "express";
var router = express.Router();
var wrap = (fn) => asyncHandler_default(fn);
var apiRoutes = (app2) => {
  router.post("/register", wrap(createUserAPI));
  router.post("/login", wrap(loginAPI));
  router.post("/send-otp", wrap(sendOTPAPI));
  router.post("/google-login", wrap(googleLogin));
  router.post("/forgot-password", wrap(handleForgotPassword));
  router.post("/reset-password/:token", wrap(handleResetPassword));
  router.post("/refresh-token", wrap(refreshTokenController));
  router.post("/logout", wrap(logoutController));
  router.get("/profile", getUser);
  router.get("/tasks", wrap(getAllTasksAPI));
  router.post("/tasks", wrap(createTaskAPI));
  router.get("/tasks/:id", wrap(getTaskByIdAPI));
  router.put("/tasks/:id", wrap(editTaskAPI));
  router.delete("/tasks/:id", wrap(deleteTaskAPI));
  app2.use("/api", checkValidJWT, router);
};
var api_default = apiRoutes;

// src/middlewares/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
};
var errorHandler_default = errorHandler;

// src/app.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [process.env.FRONTEND_URL];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);
api_default(app);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found."
  });
});
app.use(errorHandler_default);
var app_default = app;

// src/config/seed.ts
var initDatabase = async () => {
  const countUsers = await prisma.user.count();
  if (countUsers === 0) {
    const user = await prisma.user.create({
      data: {
        email: "tiep123@gmail.com",
        password: await hashPassword("12345678"),
        fullName: "Tiep Le",
        isVerified: true
      }
    });
    await prisma.task.createMany({
      data: [
        {
          title: "Prepare weekly report",
          description: "Collect progress updates and summarize completed work.",
          status: "pending",
          priority: 1,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3),
          userId: user.id
        }
      ]
    });
  }
};
var seed_default = initDatabase;

// src/jobs/otpCleanup.ts
import nodeCron from "node-cron";
var startOtpCleanupJob = () => {
  nodeCron.schedule("0 0 * * *", async () => {
    try {
      const result = await handleCleanOTPs();
      console.log(`Deleted ${result.count} expired OTP(s)`);
    } catch (error) {
      console.error("OTP cleanup error:", error);
    }
  });
};
var otpCleanup_default = startOtpCleanupJob;

// src/server.ts
var PORT = process.env.PORT || 3e3;
var start = async () => {
  await seed_default();
  console.log("Database initialized.");
  otpCleanup_default();
  app_default.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
