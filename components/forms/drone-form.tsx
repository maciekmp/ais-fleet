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
import { updateDrone, createDrone, assignDroneToProject, assignDroneToControlStation, assignDroneToDockingStation } from "@/lib/actions/drones";
import type { Drone, Project, ControlStation, DockingStation } from "@/lib/db/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const droneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  status: z.enum(["active", "inactive", "maintenance", "pending"]),
  firmwareVersion: z.string().min(1, "Firmware version is required"),
  locationLat: z.string(),
  locationLng: z.string(),
  locationAddress: z.string().optional(),
  projectId: z.string().nullable(),
  controlStationId: z.string().nullable(),
  dockingStationId: z.string().nullable(),
});

type DroneFormData = z.infer<typeof droneSchema>;

interface DroneFormProps {
  drone?: Drone;
  projects: Project[];
  controlStations: ControlStation[];
  dockingStations: DockingStation[];
}

export function DroneForm({ drone, projects, controlStations, dockingStations }: DroneFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!drone;

  const form = useForm<DroneFormData>({
    resolver: zodResolver(droneSchema),
    defaultValues: {
      name: drone?.name || "",
      serialNumber: drone?.serialNumber || "",
      status: drone?.status || "pending",
      firmwareVersion: drone?.firmwareVersion || "1.0.0",
      locationLat: drone?.location.lat.toString() || "0",
      locationLng: drone?.location.lng.toString() || "0",
      locationAddress: drone?.location.address || "",
      projectId: drone?.projectId || null,
      controlStationId: drone?.controlStationId || null,
      dockingStationId: drone?.dockingStationId || null,
    },
  });

  const onSubmit = async (data: DroneFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && drone) {
        // Update existing drone
        await updateDrone(drone.id, {
          name: data.name,
          serialNumber: data.serialNumber,
          status: data.status,
          firmwareVersion: data.firmwareVersion,
          location: {
            lat: parseFloat(data.locationLat) || 0,
            lng: parseFloat(data.locationLng) || 0,
            address: data.locationAddress || undefined,
          },
        });

        // Update relationships
        if (data.projectId !== drone.projectId) {
          await assignDroneToProject(drone.id, data.projectId);
        }
        if (data.controlStationId !== drone.controlStationId) {
          await assignDroneToControlStation(drone.id, data.controlStationId);
        }
        if (data.dockingStationId !== drone.dockingStationId) {
          await assignDroneToDockingStation(drone.id, data.dockingStationId);
        }

        router.refresh();
      } else {
        // Create new drone
        const result = await createDrone({
          name: data.name,
          serialNumber: data.serialNumber,
          status: data.status,
          firmwareVersion: data.firmwareVersion,
          location: {
            lat: parseFloat(data.locationLat) || 0,
            lng: parseFloat(data.locationLng) || 0,
            address: data.locationAddress || undefined,
          },
        });

        if (result.success && result.drone) {
          // Assign relationships if provided
          if (data.projectId) {
            await assignDroneToProject(result.drone.id, data.projectId);
          }
          if (data.controlStationId) {
            await assignDroneToControlStation(result.drone.id, data.controlStationId);
          }
          if (data.dockingStationId) {
            await assignDroneToDockingStation(result.drone.id, data.dockingStationId);
          }

          router.push(`/drones/${result.drone.id}`);
          router.refresh();
        } else {
          setError(result.error || "Failed to create drone");
        }
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} drone:`, err);
      setError(`An error occurred while ${isEditMode ? "updating" : "creating"} the drone`);
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
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input id="serialNumber" {...form.register("serialNumber")} />
          {form.formState.errors.serialNumber && (
            <p className="text-sm text-destructive">
              {form.formState.errors.serialNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firmwareVersion">Firmware Version</Label>
          <Input id="firmwareVersion" {...form.register("firmwareVersion")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="locationLat">Latitude</Label>
            <Input
              id="locationLat"
              type="number"
              step="any"
              {...form.register("locationLat")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationLng">Longitude</Label>
            <Input
              id="locationLng"
              type="number"
              step="any"
              {...form.register("locationLng")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Address</Label>
            <Input id="locationAddress" {...form.register("locationAddress")} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="projectId">Project</Label>
          <Select
            value={form.watch("projectId") || "none"}
            onValueChange={(value) =>
              form.setValue("projectId", value === "none" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="controlStationId">Control Station</Label>
          <Select
            value={form.watch("controlStationId") || "none"}
            onValueChange={(value) =>
              form.setValue("controlStationId", value === "none" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No station</SelectItem>
              {controlStations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dockingStationId">Docking Station</Label>
          <Select
            value={form.watch("dockingStationId") || "none"}
            onValueChange={(value) =>
              form.setValue("dockingStationId", value === "none" ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="No station" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No station</SelectItem>
              {dockingStations.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              : "Create Drone"}
        </Button>
      </div>
    </form>
  );
}
