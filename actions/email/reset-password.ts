"use server";

import * as z from "zod";

import { resetSchema } from "../../schemas";
import { getUserByEmail } from "../../db/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ActionsResult } from "../../types/ActionsResult";

export const resetPassword = async (
  values: z.infer<typeof resetSchema>
): Promise<ActionsResult> => {
  const validatedFields = resetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { isSuccess: false, error: validatedFields.error };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      isSuccess: false,
      error: {
        message: "メールアドレスが見つかりませんでした。",
      },
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

  if (!passwordResetToken) {
    return {
      isSuccess: false,
      error: {
        message: "パスワードリセットトークンの生成に失敗しました。",
      },
    };
  }

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { isSuccess: true, message: "メールを送信しました。" };
};
