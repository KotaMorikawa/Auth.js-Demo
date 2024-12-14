import {
  createPasswordResetToken,
  deletePasswordResetToken,
  getPasswordResetTokenByEmail,
} from "./../../db/reset-password-token";
import {
  createVerificationToken,
  deleteVerificationToken,
  getVerificationTokenByEmail,
} from "./../../db/verification-token";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationToken(existingToken.id);
  }

  const verificationToken = await createVerificationToken(
    email,
    token,
    expires
  );

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetToken(existingToken.id);
  }

  const passwordResetToken = await createPasswordResetToken(
    email,
    token,
    expires
  );

  return passwordResetToken;
};
