import { db } from "./index";
import { readFileSync } from "fs";
import { join } from "path";
import type { Drone, ControlStation, DockingStation, Project, User, Log } from "./types";

// Use a global flag to prevent multiple loadings across module reloads
declare global {
  // eslint-disable-next-line no-var
  var __dbLoaded: boolean | undefined;
}

export function initDatabase() {
  // Check global flag first
  if (global.__dbLoaded) return;
  
  // Always check if database is empty and load from JSON if needed
  const hasData = 
    db.getAllDrones().length > 0 ||
    db.getAllProjects().length > 0 ||
    db.getAllUsers().length > 0;
  
  if (!hasData) {
    try {
      const dataPath = join(process.cwd(), "lib/db/mock-data.json");
      const fileContent = readFileSync(dataPath, "utf-8");
      const data = JSON.parse(fileContent);
      
      console.log("Loading mock data from JSON...");
      
      // Load drones
      data.drones.forEach((drone: any) => {
        db.createDrone(
          {
            name: drone.name,
            serialNumber: drone.serialNumber,
            status: drone.status,
            firmwareVersion: drone.firmwareVersion,
            location: drone.location,
            configuration: drone.configuration,
            projectId: drone.projectId,
            controlStationId: drone.controlStationId,
            dockingStationId: drone.dockingStationId,
            lastPing: drone.lastPing ? new Date(drone.lastPing) : null,
            metadata: drone.metadata,
            registeredAt: new Date(drone.registeredAt),
          },
          drone.id
        );
      });
      
      // Load control stations
      data.controlStations.forEach((station: any) => {
        db.createControlStation(
          {
            name: station.name,
            identifier: station.identifier,
            status: station.status,
            firmwareVersion: station.firmwareVersion,
            location: station.location,
            configuration: station.configuration,
            connectedDrones: station.connectedDrones,
            metadata: station.metadata,
          },
          station.id
        );
      });
      
      // Load docking stations
      data.dockingStations.forEach((station: any) => {
        db.createDockingStation(
          {
            name: station.name,
            identifier: station.identifier,
            status: station.status,
            firmwareVersion: station.firmwareVersion,
            location: station.location,
            configuration: station.configuration,
            connectedDrones: station.connectedDrones,
            metadata: station.metadata,
          },
          station.id
        );
      });
      
      // Load projects
      data.projects.forEach((project: any) => {
        db.createProject(
          {
            name: project.name,
            description: project.description,
            status: project.status,
            assignedDrones: project.assignedDrones,
            assignedUsers: project.assignedUsers,
            metadata: project.metadata,
            createdAt: new Date(project.createdAt),
            updatedAt: new Date(project.updatedAt),
          },
          project.id
        );
      });
      
      // Load users
      data.users.forEach((user: any) => {
        db.createUser(
          {
            name: user.name,
            email: user.email,
            role: user.role,
            assignedProjects: user.assignedProjects,
            metadata: user.metadata,
            createdAt: new Date(user.createdAt),
          },
          user.id
        );
      });
      
      // Load logs
      data.logs.forEach((log: any) => {
        db.createLog(
          {
            type: log.type,
            source: log.source,
            message: log.message,
            rawMessage: log.rawMessage,
            data: log.data,
            severity: log.severity,
            timestamp: new Date(log.timestamp),
          },
          log.id
        );
      });
      
      // Set up relationships
      data.drones.forEach((drone: any) => {
        if (drone.projectId) {
          db.assignDroneToProject(drone.id, drone.projectId);
        }
        if (drone.controlStationId) {
          db.assignDroneToControlStation(drone.id, drone.controlStationId);
        }
        if (drone.dockingStationId) {
          db.assignDroneToDockingStation(drone.id, drone.dockingStationId);
        }
      });
      
      data.projects.forEach((project: any) => {
        project.assignedUsers.forEach((userId: string) => {
          db.assignUserToProject(userId, project.id);
        });
      });
      
      global.__dbLoaded = true;
      console.log(`Loaded ${data.drones.length} drones, ${data.projects.length} projects, ${data.users.length} users`);
    } catch (error) {
      console.error("Failed to load mock data:", error);
      // If JSON loading fails, the database will remain empty
    }
  } else {
    global.__dbLoaded = true;
  }
}

// Initialize on module load - ensure it only runs on server
if (typeof window === "undefined") {
  initDatabase();
}
