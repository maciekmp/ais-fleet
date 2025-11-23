"use server";

import { db } from "@/lib/db";
// Ensure database is initialized
import "@/lib/db/init";
import type { User, UserRole } from "@/lib/db/types";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return db.getAllUsers();
}

export async function getUser(id: string) {
  return db.getUser(id);
}

export async function createUser(data: {
  name: string;
  email: string;
  role: UserRole;
  metadata?: Record<string, unknown>;
}) {
  const existing = db.findUserByEmail(data.email);
  if (existing) {
    return { error: "User with this email already exists" };
  }

  const user = db.createUser({
    ...data,
    metadata: data.metadata || {},
    assignedProjects: [],
  });

  revalidatePath("/users");
  return { success: true, user };
}

export async function updateUser(
  id: string,
  data: Partial<Omit<User, "id" | "createdAt">>
) {
  const user = db.updateUser(id, data);
  if (!user) {
    return { error: "User not found" };
  }

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return { success: true, user };
}

export async function deleteUser(id: string) {
  const deleted = db.deleteUser(id);
  if (!deleted) {
    return { error: "User not found" };
  }

  revalidatePath("/users");
  return { success: true };
}
