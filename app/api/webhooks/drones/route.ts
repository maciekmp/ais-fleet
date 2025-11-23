import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createLog } from "@/lib/actions/logs";
import type { DroneStatus } from "@/lib/db/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, serialNumber, data: payload } = body;

    if (!type || !serialNumber) {
      return NextResponse.json(
        { error: "Missing required fields: type, serialNumber" },
        { status: 400 }
      );
    }

    // Find existing drone or create new one
    let drone = db.findDroneBySerial(serialNumber);

    if (type === "registration") {
      if (drone) {
        // Update existing drone registration
        const updated = db.updateDrone(drone.id, {
          firmwareVersion: payload?.firmwareVersion || drone.firmwareVersion,
          location: payload?.location || drone.location,
          lastPing: new Date(),
        });
        if (updated) drone = updated;
      } else {
        // Create new drone with pending status
        drone = db.createDrone({
          name: payload?.name || `Drone ${serialNumber}`,
          serialNumber,
          status: "pending",
          firmwareVersion: payload?.firmwareVersion || "1.0.0",
          location: payload?.location || { lat: 0, lng: 0 },
          configuration: payload?.configuration || {},
          metadata: payload?.metadata || {},
          projectId: null,
          controlStationId: null,
          dockingStationId: null,
          lastPing: new Date(),
        });
      }

      await createLog({
        type: "registration",
        source: serialNumber,
        message: `Drone ${serialNumber} registered`,
        rawMessage: JSON.stringify(body),
        data: payload,
        severity: "info",
      });

      return NextResponse.json({
        success: true,
        droneId: drone.id,
        status: drone.status,
      });
    }

    if (type === "status_update") {
      if (!drone) {
        return NextResponse.json(
          { error: "Drone not found. Please register first." },
          { status: 404 }
        );
      }

      const status = payload?.status as DroneStatus | undefined;
      if (status && ["active", "inactive", "maintenance", "pending"].includes(status)) {
        const updated = db.updateDrone(drone.id, {
          status,
          firmwareVersion: payload?.firmwareVersion || drone.firmwareVersion,
          location: payload?.location || drone.location,
          configuration: payload?.configuration || drone.configuration,
          lastPing: new Date(),
        });
        if (updated) drone = updated;
      } else {
        const updated = db.updateDrone(drone.id, {
          firmwareVersion: payload?.firmwareVersion || drone.firmwareVersion,
          location: payload?.location || drone.location,
          configuration: payload?.configuration || drone.configuration,
          lastPing: new Date(),
        });
        if (updated) drone = updated;
      }

      await createLog({
        type: "status_update",
        source: serialNumber,
        message: `Status update from ${serialNumber}: ${status || "no status change"}`,
        rawMessage: JSON.stringify(body),
        data: payload,
        severity: "info",
      });

      return NextResponse.json({
        success: true,
        droneId: drone.id,
        status: drone.status,
      });
    }

    if (type === "ping") {
      if (!drone) {
        return NextResponse.json(
          { error: "Drone not found. Please register first." },
          { status: 404 }
        );
      }

      const updated = db.updateDrone(drone.id, {
        lastPing: new Date(),
        location: payload?.location || drone.location,
      });
      if (updated) drone = updated;

      await createLog({
        type: "ping",
        source: serialNumber,
        message: `Ping from ${serialNumber}`,
        rawMessage: JSON.stringify(body),
        data: payload,
        severity: "info",
      });

      return NextResponse.json({
        success: true,
        droneId: drone.id,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: `Unknown type: ${type}. Supported types: registration, status_update, ping` },
      { status: 400 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
