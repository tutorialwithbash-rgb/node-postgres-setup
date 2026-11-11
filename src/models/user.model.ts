import { getPrismaClient } from "../db/connection";
import type { User as PrismaUser } from "@prisma/client";

export type UserUpdate = Partial<
  Pick<PrismaUser, "name" | "email" | "password" | "role" | "isActive">
>;

export const User = {
  findOne({ email }: { email: string }): Promise<PrismaUser | null> {
    return getPrismaClient().user.findUnique({ where: { email } });
  },

  create(user: Pick<PrismaUser, "name" | "email" | "password">): Promise<PrismaUser> {
    return getPrismaClient().user.create({ data: user });
  },

  find(): Promise<PrismaUser[]> {
    return getPrismaClient().user.findMany({ orderBy: { id: "asc" } });
  },

  findById(id: string | number): Promise<PrismaUser | null> {
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId < 1) return Promise.resolve(null);

    return getPrismaClient().user.findUnique({ where: { id: userId } });
  },

  async updateById(id: string | number, data: UserUpdate): Promise<PrismaUser | null> {
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId < 1) return null;

    const result = await getPrismaClient().user.updateMany({
      where: { id: userId },
      data,
    });
    if (result.count === 0) return null;

    return getPrismaClient().user.findUnique({ where: { id: userId } });
  },

  async deleteById(id: string | number): Promise<boolean> {
    const userId = Number(id);
    if (!Number.isSafeInteger(userId) || userId < 1) return false;

    const result = await getPrismaClient().user.deleteMany({
      where: { id: userId },
    });
    return result.count > 0;
  },
};
