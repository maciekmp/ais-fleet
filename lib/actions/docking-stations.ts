"use server";

import { db } from "@/lib/db";
// Ensure database is initialized
import "@/lib/db/init";
import type { DockingStation, DockingStationStatus, Location } from "@/lib/db/types";
import { revalidatePath } from "next/cache";

export async function getDockingStations() {
  return db.getAllDockingStations();
}

export async function getDockingStation(id: string) {
  return db.getDockingStation(id);
}

export async function createDockingStation(data: {
  name: string;
  identifier: string;
  status: DockingStationStatus;
  firmwareVersion: string;
  location: Location;
  configuration?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}) {
  const station = db.createDockingStation({
    ...data,
    configuration: data.configuration || {},
    metadata: data.metadata || {},
    connectedDrones: [],
  });

  revalidatePath("/docking-stations");
  return { success: true, station };
}

export async function updateDockingStation(
  id: string,
  data: Partial<Omit<DockingStation, "id">>
) {
  const station = db.updateDockingStation(id, data);
  if (!station) {
    return { error: "Docking station not found" };
  }

  revalidatePath("/docking-stations");
  revalidatePath(`/docking-stations/${id}`);
  return { success: true, station };
}

export async function deleteDockingStation(id: string) {
  const deleted = db.deleteDockingStation(id);
  if (!deleted) {
    return { error: "Docking station not found" };
  }

  revalidatePath("/docking-stations");
  return { success: true };
}
