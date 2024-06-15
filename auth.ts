import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { UserRole } from "@prisma/client";

import authConfig from "./auth.config";
import { getUserById } from "./data/user";
import { db } from "./lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    async signIn({ user }) {
      let existingUser = null;

      try {
        existingUser = await getUserById(user.id as string);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return false;
      }

      if (!existingUser || !existingUser.emailVerified) return false;
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
