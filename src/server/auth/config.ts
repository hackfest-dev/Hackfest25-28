import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  type DefaultSession,
  type NextAuthConfig,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "CUSTOMER" | "MIDDLEMAN" | "SHOPKEEPER" | "MANUFACTURER" | null;
      // Role-specific IDs
      manufacturerId?: number;
      shopkeeperId?: number;
      middlemanId?: number;
      customerId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    role: "ADMIN" | "CUSTOMER" | "MIDDLEMAN" | "SHOPKEEPER" | "MANUFACTURER" | null;
    manufacturerId?: number;
    shopkeeperId?: number;
    middlemanId?: number;
    customerId?: number;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: async ({ session, user }) => {
      // Fetch user with role-specific data
      const fullUser = await db.user.findUnique({
        where: { id: user.id },
        include: {
          manufacturer: true,
          shopkeeper: true,
          middleMen: true,
          customer: true,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: fullUser?.role ?? null,
          // Include role-specific IDs if they exist
          manufacturerId: fullUser?.manufacturer?.id,
          shopkeeperId: fullUser?.shopkeeper?.id,
          middlemanId: fullUser?.middleMen?.id,
          customerId: fullUser?.customer?.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;