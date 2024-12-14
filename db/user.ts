import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch {
    return null;
  }
};

// dataの型を定義する
type CreateUserInput = {
  email: string;
  password: string;
  nickname: string;
};

export const createUser = async (data: CreateUserInput) => {
  try {
    await db.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.nickname,
      },
    });
  } catch {
    return null;
  }
};

export const updateUserEmailVerified = async (id: string) => {
  try {
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        emailVerified: new Date(),
      },
    });
  } catch {
    return null;
  }
};

export const updateUserPassword = async (id: string, password: string) => {
  try {
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        password,
      },
    });
  } catch {
    return null;
  }
};

export const updateUserEmailAndEmailVerified = async (email: string) => {
  try {
    await db.user.update({
      where: {
        email: email,
      },
      data: {
        emailVerified: new Date(),
        email: email,
      },
    });
  } catch {
    return null;
  }
};
