"use server";

import { AuthError } from "next-auth";
import { signIn as signInByAuthJS } from "../../auth";
import { getUserByEmail } from "../../db/user";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { signInSchema } from "../../schemas";
import { ActionResultWithData } from "../../types/ActionsResult";
import { z } from "zod";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import {
  deleteTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "../../db/two-factor-token";
import {
  createTwoFactorConfirmation,
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "../../db/two-factor-confirmation";

export const signIn = async (
  values: z.infer<typeof signInSchema>
): Promise<ActionResultWithData<boolean>> => {
  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      isSuccess: false,
      error: {
        message: validatedFields.error.message,
      },
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      isSuccess: false,
      error: {
        message: "入力されたメールアドレスは登録されていません。",
      },
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    if (!verificationToken) {
      return {
        isSuccess: false,
        error: {
          message: "認証トークンの生成に失敗しました。",
        },
      };
    }

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      isSuccess: false,
      error: {
        message:
          "メールアドレスが確認されていません。メールアドレスを確認してください。",
      },
    };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          isSuccess: false,
          error: {
            message: "認証コードが存在しません",
          },
        };
      }

      if (twoFactorToken.token !== code) {
        return {
          isSuccess: false,
          error: {
            message: "認証コードが間違っています。",
          },
        };
      }

      const hasExpired = new Date() > twoFactorToken.expires;

      if (hasExpired) {
        return {
          isSuccess: false,
          error: {
            message: "認証コードが期限切れです。",
          },
        };
      }

      await deleteTwoFactorToken(twoFactorToken.id);

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await deleteTwoFactorConfirmation(existingConfirmation.id);
      }

      await createTwoFactorConfirmation(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      if (!twoFactorToken?.token)
        return {
          isSuccess: false,
          error: { message: "認証コードの生成に失敗しました。" },
        };
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

      return {
        isSuccess: true,
        message: "認証コードを送信しました。",
        data: {
          isTwoFactorEnabled: true,
        },
      };
    }
  }

  try {
    await signInByAuthJS("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

    return {
      isSuccess: true,
      message: "ログインに成功しました。",
      data: {
        isTwoFactorEnabled: false,
      },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            isSuccess: false,
            error: {
              message: "メールアドレスまたはパスワードが違います。",
            },
          };
        default:
          return {
            isSuccess: false,
            error: {
              message: "ログインに失敗しました。",
            },
          };
      }
    }
    throw error;
  }
};
