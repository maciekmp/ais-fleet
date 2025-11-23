"use server";

import { db } from "@/lib/db";
// Ensure database is initialized
import "@/lib/db/init";
import type { ControlStation, ControlStationStatus, Location } from "@/lib/db/types";
import { revalidatePath } from "next/cache";

export async function getControlStations() {
  return db.getAllControlStations();
}

export async function getControlStation(id: string) {
  return db.getControlStation(id);
}

export async function createControlStation(data: {
  name: string;
  identifier: string;
  status: ControlStationStatus;
  firmwareVersion: string;
  location: Location;
  configuration?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}) {
  const existing = db.findControlStationByIdentifier(data.identifier);
  if (existing) {
    return { error: "Control station with this identifier already exists" };
  }

  const station = db.createControlStation({
    ...data,
    configuration: data.configuration || {},
    metadata: data.metadata || {},
    connectedDrones: [],
  });

  revalidatePath("/control-stations");
  return { success: true, station };
}

export async function updateControlStation(
  id: string,
  data: Partial<Omit<ControlStation, "id">>
) {
  const station = db.updateControlStation(id, data);
  if (!station) {
    return { error: "Control station not found" };
  }

  revalidatePath("/control-stations");
  revalidatePath(`/control-stations/${id}`);
  return { success: true, station };
}

export async function deleteControlStation(id: string) {
  const deleted = db.deleteControlStation(id);
  if (!deleted) {
    return { error: "Control station not found" };
  }

  revalidatePath("/control-stations");
  return { success: true };
}
