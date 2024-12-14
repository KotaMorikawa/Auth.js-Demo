import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "./auth.config";
import { getUserById, updateUserEmailVerified } from "./db/user";
import { UserRole } from "@prisma/client";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "./db/two-factor-confirmation";
import { getAccountByUserId } from "./db/account";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
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
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      if (!user.id) return false;

      const existingUser = await getUserById(user.id);
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;
        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }
      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const exisistingUser = await getUserById(token.sub);
      if (!exisistingUser) return token;

      const existingAccount = await getAccountByUserId(exisistingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = exisistingUser.name;
      token.email = exisistingUser.email;
      token.role = exisistingUser.role;
      token.isTwoFactorEnabled = exisistingUser.isTwoFactorEnabled;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
