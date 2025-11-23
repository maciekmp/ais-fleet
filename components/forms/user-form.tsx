"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser, createUser } from "@/lib/actions/users";
import type { User } from "@/lib/db/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "operator", "viewer"]),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "viewer",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && user) {
        await updateUser(user.id, {
          name: data.name,
          email: data.email,
          role: data.role,
        });
        router.refresh();
      } else {
        const result = await createUser({
          name: data.name,
          email: data.email,
          role: data.role,
        });

        if (result.success && result.user) {
          router.push(`/users/${result.user.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to create user");
        }
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} user:`, err);
      setError(`An error occurred while ${isEditMode ? "updating" : "creating"} the user`);
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
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register("email")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={form.watch("role")}
          onValueChange={(value) => form.setValue("role", value as any)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="operator">Operator</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
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
              : "Create User"}
        </Button>
      </div>
    </form>
  );
}
