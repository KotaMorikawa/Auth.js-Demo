import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "./auth.config";
import { getUserById, updateUserEmailVerified } from "./db/user";
import { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
  },
  events: {
    async linkAccount({ user }) {
      if (!user.id) return;
      await updateUserEmailVerified(user.id);
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const exisistingUser = await getUserById(token.sub);
      if (!exisistingUser) return token;
      token.role = exisistingUser.role;

      return token;
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
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
