import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db, {
    client,
  }),
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    "https://*.vercel.app",
    "http://localhost:3000",
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_SECRET,
    },
  },
});
