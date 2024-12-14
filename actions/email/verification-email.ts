"use server";

import { getUserByEmail, updateUserEmailAndEmailVerified } from "../../db/user";
import {
  deleteVerificationToken,
  getVerificationTokenByToken,
} from "./../../db/verification-token";
import { ActionsResult } from "../../types/ActionsResult";

export const newVerification = async (
  token: string
): Promise<ActionsResult> => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return {
      isSuccess: false,
      error: {
        message: "トークンが見つかりませんでした。",
      },
    };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return {
      isSuccess: false,
      error: {
        message: "トークンの有効期限が切れています。",
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

  await updateUserEmailAndEmailVerified(existingToken.email);

  await deleteVerificationToken(existingToken.id);

  return {
    isSuccess: true,
    message: "メールアドレスの認証が完了しました。",
  };
};
