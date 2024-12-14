"use server";

import { signUpSchema } from "../../schemas";
import { ActionsResult } from "../../types/ActionsResult";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "../../db/user";
import { handleError } from "@/lib/utils";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const signUp = async (
  values: z.infer<typeof signUpSchema>
): Promise<ActionsResult> => {
  const validateFields = signUpSchema.safeParse(values);

  if (!validateFields.success) {
    return {
      isSuccess: false,
      error: {
        message: validateFields.error.message,
      },
    };
  }

  const { email, password, nickname } = validateFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return {
        isSuccess: false,
        error: {
          message: "このメールアドレスは既に登録されています。",
        },
      };
    }

    await createUser({
      email: email,
      password: hashedPassword,
      nickname: nickname,
    });

    const verificationToken = await generateVerificationToken(email);

    if (!verificationToken) {
      return {
        isSuccess: false,
        error: {
          message: "確認メールの送信に失敗しました。",
        },
      };
    }

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      isSuccess: true,
      message: "確認メールを送信しました",
    };
  } catch (error) {
    handleError(error);
    return {
      isSuccess: false,
      error: {
        message: "サインアップに失敗しました。",
      },
    };
  }
};
