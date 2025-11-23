export type DroneStatus = "active" | "inactive" | "maintenance" | "pending";
export type ControlStationStatus = "online" | "offline" | "maintenance";
export type DockingStationStatus = "available" | "occupied" | "maintenance";
export type ProjectStatus = "active" | "archived" | "planning";
export type UserRole = "admin" | "operator" | "viewer";
export type LogType = "ping" | "status_update" | "registration" | "system";
export type LogSeverity = "info" | "warning" | "error";

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Drone {
  id: string;
  name: string;
  serialNumber: string;
  status: DroneStatus;
  firmwareVersion: string;
  location: Location;
  configuration: Record<string, unknown>;
  projectId: string | null;
  controlStationId: string | null;
  dockingStationId: string | null;
  registeredAt: Date;
  lastPing: Date | null;
  metadata: Record<string, unknown>;
}

export interface ControlStation {
  id: string;
  name: string;
  identifier: string;
  status: ControlStationStatus;
  firmwareVersion: string;
  location: Location;
  configuration: Record<string, unknown>;
  connectedDrones: string[];
  metadata: Record<string, unknown>;
}

export interface DockingStation {
  id: string;
  name: string;
  identifier: string;
  status: DockingStationStatus;
  firmwareVersion: string;
  location: Location;
  configuration: Record<string, unknown>;
  connectedDrones: string[];
  metadata: Record<string, unknown>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  assignedDrones: string[];
  assignedUsers: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedProjects: string[];
  createdAt: Date;
  metadata: Record<string, unknown>;
}

export interface Log {
  id: string;
  type: LogType;
  source: string;
  message: string;
  rawMessage?: string; // Raw message from device
  data: Record<string, unknown>;
  timestamp: Date;
  severity: LogSeverity;
}
