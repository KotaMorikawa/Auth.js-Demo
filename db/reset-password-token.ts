import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token: token,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email: email,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const createPasswordResetToken = async (
  email: string,
  token: string,
  expires: Date
) => {
  try {
    const passwordResetToken = await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const deletePasswordResetToken = async (id: string) => {
  try {
    await db.passwordResetToken.delete({
      where: {
        id: id,
      },
    });
  } catch {
    return null;
  }
};
