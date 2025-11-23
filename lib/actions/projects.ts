"use server";

import { db } from "@/lib/db";
// Ensure database is initialized
import "@/lib/db/init";
import type { Project, ProjectStatus } from "@/lib/db/types";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return db.getAllProjects();
}

export async function getProject(id: string) {
  return db.getProject(id);
}

export async function createProject(data: {
  name: string;
  description: string;
  status: ProjectStatus;
  metadata?: Record<string, unknown>;
}) {
  const project = db.createProject({
    ...data,
    metadata: data.metadata || {},
    assignedDrones: [],
    assignedUsers: [],
  });

  revalidatePath("/projects");
  return { success: true, project };
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>
) {
  const project = db.updateProject(id, data);
  if (!project) {
    return { error: "Project not found" };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return { success: true, project };
}

export async function deleteProject(id: string) {
  const deleted = db.deleteProject(id);
  if (!deleted) {
    return { error: "Project not found" };
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function assignUserToProject(userId: string, projectId: string) {
  const success = db.assignUserToProject(userId, projectId);
  if (!success) {
    return { error: "Failed to assign user to project" };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/users");
  revalidatePath(`/users/${userId}`);
  return { success: true };
}

export async function removeUserFromProject(userId: string, projectId: string) {
  const success = db.removeUserFromProject(userId, projectId);
  if (!success) {
    return { error: "Failed to remove user from project" };
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/users");
  revalidatePath(`/users/${userId}`);
  return { success: true };
}
