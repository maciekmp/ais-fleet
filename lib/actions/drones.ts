"use server";

import { db } from "@/lib/db";
import type { Drone, DroneStatus, Location } from "@/lib/db/types";
import { revalidatePath } from "next/cache";

// Ensure database is initialized
import "@/lib/db/init";

export async function getDrones() {
  return db.getAllDrones();
}

export async function getDrone(id: string) {
  return db.getDrone(id);
}

export async function createDrone(data: {
  name: string;
  serialNumber: string;
  status: DroneStatus;
  firmwareVersion: string;
  location: Location;
  configuration?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}) {
  const existing = db.findDroneBySerial(data.serialNumber);
  if (existing) {
    return { error: "Drone with this serial number already exists" };
  }

  const drone = db.createDrone({
    ...data,
    configuration: data.configuration || {},
    metadata: data.metadata || {},
    projectId: null,
    controlStationId: null,
    dockingStationId: null,
    lastPing: null,
  });

  revalidatePath("/drones");
  return { success: true, drone };
}

export async function updateDrone(
  id: string,
  data: Partial<Omit<Drone, "id" | "registeredAt">>
) {
  const drone = db.updateDrone(id, data);
  if (!drone) {
    return { error: "Drone not found" };
  }

  revalidatePath("/drones");
  revalidatePath(`/drones/${id}`);
  return { success: true, drone };
}

export async function deleteDrone(id: string) {
  const deleted = db.deleteDrone(id);
  if (!deleted) {
    return { error: "Drone not found" };
  }

  revalidatePath("/drones");
  return { success: true };
}

export async function assignDroneToProject(
  droneId: string,
  projectId: string | null
) {
  const success = db.assignDroneToProject(droneId, projectId);
  if (!success) {
    return { error: "Failed to assign drone to project" };
  }

  revalidatePath("/drones");
  revalidatePath(`/drones/${droneId}`);
  revalidatePath("/projects");
  if (projectId) {
    revalidatePath(`/projects/${projectId}`);
  }
  return { success: true };
}

export async function assignDroneToControlStation(
  droneId: string,
  stationId: string | null
) {
  const success = db.assignDroneToControlStation(droneId, stationId);
  if (!success) {
    return { error: "Failed to assign drone to control station" };
  }

  revalidatePath("/drones");
  revalidatePath(`/drones/${droneId}`);
  revalidatePath("/control-stations");
  if (stationId) {
    revalidatePath(`/control-stations/${stationId}`);
  }
  return { success: true };
}

export async function assignDroneToDockingStation(
  droneId: string,
  stationId: string | null
) {
  const success = db.assignDroneToDockingStation(droneId, stationId);
  if (!success) {
    return { error: "Failed to assign drone to docking station" };
  }

  revalidatePath("/drones");
  revalidatePath(`/drones/${droneId}`);
  revalidatePath("/docking-stations");
  if (stationId) {
    revalidatePath(`/docking-stations/${stationId}`);
  }
  return { success: true };
}
