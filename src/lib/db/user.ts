import { db } from "./client";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function createUser(data: {
  email: string;
  name: string;
  password: string;
  tenantId: string;
  role?: string;
}) {
  const hashedPassword = await hashPassword(data.password);

  return db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      tenantId: data.tenantId,
      role: data.role || "member",
    },
  });
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      tenant: true,
    },
  });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: {
      tenant: true,
    },
  });
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    avatar?: string;
    role?: string;
  }
) {
  return db.user.update({
    where: { id },
    data,
  });
}

export async function deleteUser(id: string) {
  return db.user.delete({
    where: { id },
  });
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  return isValid ? user : null;
}
