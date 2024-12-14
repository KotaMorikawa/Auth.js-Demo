import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const TwoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId: userId,
      },
    });

    return TwoFactorConfirmation;
  } catch {
    return null;
  }
};

export const createTwoFactorConfirmation = async (id: string) => {
  try {
    const twoFactorToken = await db.twoFactorConfirmation.create({
      data: {
        userId: id,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const deleteTwoFactorConfirmation = async (id: string) => {
  try {
    await db.twoFactorConfirmation.delete({
      where: {
        id: id,
      },
    });
  } catch {
    return null;
  }
};
