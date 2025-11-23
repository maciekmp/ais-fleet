"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProject, createProject, assignUserToProject, removeUserFromProject } from "@/lib/actions/projects";
import type { Project, Drone, User } from "@/lib/db/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  status: z.enum(["active", "archived", "planning"]),
  assignedDrones: z.array(z.string()),
  assignedUsers: z.array(z.string()),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
  drones: Drone[];
  users: User[];
}

export function ProjectForm({ project, drones, users }: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "planning",
      assignedDrones: project?.assignedDrones || [],
      assignedUsers: project?.assignedUsers || [],
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && project) {
        await updateProject(project.id, {
          name: data.name,
          description: data.description,
          status: data.status,
          assignedDrones: data.assignedDrones,
        });

        // Update user assignments
        const currentUsers = project.assignedUsers;
        const newUsers = data.assignedUsers;

        // Remove users that were unassigned
        for (const userId of currentUsers) {
          if (!newUsers.includes(userId)) {
            await removeUserFromProject(userId, project.id);
          }
        }

        // Add users that were newly assigned
        for (const userId of newUsers) {
          if (!currentUsers.includes(userId)) {
            await assignUserToProject(userId, project.id);
          }
        }

        router.refresh();
      } else {
        const result = await createProject({
          name: data.name,
          description: data.description,
          status: data.status,
        });

        if (result.success && result.project) {
          // Assign users if provided
          for (const userId of data.assignedUsers) {
            await assignUserToProject(userId, result.project.id);
          }

          router.push(`/projects/${result.project.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to create project");
        }
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} project:`, err);
      setError(`An error occurred while ${isEditMode ? "updating" : "creating"} the project`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Assigned Drones</Label>
        <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
          {drones.map((drone) => (
            <label key={drone.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.watch("assignedDrones").includes(drone.id)}
                onChange={(e) => {
                  const current = form.getValues("assignedDrones");
                  if (e.target.checked) {
                    form.setValue("assignedDrones", [...current, drone.id]);
                  } else {
                    form.setValue(
                      "assignedDrones",
                      current.filter((id) => id !== drone.id)
                    );
                  }
                }}
              />
              <span className="text-sm">{drone.name} ({drone.serialNumber})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Assigned Users</Label>
        <div className="grid gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
          {users.map((user) => (
            <label key={user.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={form.watch("assignedUsers").includes(user.id)}
                onChange={(e) => {
                  const current = form.getValues("assignedUsers");
                  if (e.target.checked) {
                    form.setValue("assignedUsers", [...current, user.id]);
                  } else {
                    form.setValue(
                      "assignedUsers",
                      current.filter((id) => id !== user.id)
                    );
                  }
                }}
              />
              <span className="text-sm">{user.name} ({user.email})</span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
