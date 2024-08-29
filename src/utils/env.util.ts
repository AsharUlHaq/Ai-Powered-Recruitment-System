import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ?? 5000,
  JWT_SECRET: process.env.JWT_SECRET ?? "SECRET",
  FLASK_SERVER_URL: process.env.FLASK_SERVER_URL,
};
