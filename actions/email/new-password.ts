"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import {
  deletePasswordResetToken,
  getPasswordResetTokenByToken,
} from "./../../db/reset-password-token";
import { newPasswordSchema } from "../../schemas";
import { getUserByEmail, updateUserPassword } from "../../db/user";
import { ActionsResult } from "../../types/ActionsResult";

export const newPassword = async (
  values: z.infer<typeof newPasswordSchema>,
  token?: string | null
): Promise<ActionsResult> => {
  if (!token) {
    return {
      isSuccess: false,
      error: {
        message: "トークンが含まれていません",
      },
    };
  }

  const validatedFields = newPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      error: {
        message: validatedFields.error.message,
      },
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return {
      isSuccess: false,
      error: {
        message: "トークンが見つかりませんでした。",
      },
    };
  }

  const hasExpired = new Date() > existingToken.expires;

  if (hasExpired) {
    return {
      isSuccess: false,
      error: {
        message: "トークンの有効祈願が切れています。",
      },
    };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      isSuccess: false,
      error: {
        message: "ユーザーが見つかりませんでした。",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUserPassword(existingUser.id, hashedPassword);

  await deletePasswordResetToken(existingToken.id);

  return {
    isSuccess: true,
    message: "パスワードをリセットしました。",
  };
};
