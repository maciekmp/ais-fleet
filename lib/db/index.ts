import {
  type Drone,
  type ControlStation,
  type DockingStation,
  type Project,
  type User,
  type Log,
  type LogType,
} from "./types";

class Database {
  private drones: Map<string, Drone> = new Map();
  private controlStations: Map<string, ControlStation> = new Map();
  private dockingStations: Map<string, DockingStation> = new Map();
  private projects: Map<string, Project> = new Map();
  private users: Map<string, User> = new Map();
  private logs: Log[] = [];

  // Drone operations
  createDrone(drone: Omit<Drone, "id" | "registeredAt"> & { registeredAt?: Date }, id?: string): Drone {
    const droneId = id || crypto.randomUUID();
    const newDrone: Drone = {
      ...drone,
      id: droneId,
      registeredAt: drone.registeredAt || new Date(),
    };
    this.drones.set(droneId, newDrone);
    return newDrone;
  }

  getDrone(id: string): Drone | undefined {
    return this.drones.get(id);
  }

  getAllDrones(): Drone[] {
    return Array.from(this.drones.values());
  }

  updateDrone(id: string, updates: Partial<Drone>): Drone | null {
    const drone = this.drones.get(id);
    if (!drone) return null;
    const updated = { ...drone, ...updates };
    this.drones.set(id, updated);
    return updated;
  }

  deleteDrone(id: string): boolean {
    return this.drones.delete(id);
  }

  findDroneBySerial(serialNumber: string): Drone | undefined {
    return Array.from(this.drones.values()).find(
      (d) => d.serialNumber === serialNumber
    );
  }

  // Control Station operations
  createControlStation(
    station: Omit<ControlStation, "id">,
    id?: string
  ): ControlStation {
    const stationId = id || crypto.randomUUID();
    const newStation: ControlStation = {
      ...station,
      id: stationId,
    };
    this.controlStations.set(stationId, newStation);
    return newStation;
  }

  getControlStation(id: string): ControlStation | undefined {
    return this.controlStations.get(id);
  }

  getAllControlStations(): ControlStation[] {
    return Array.from(this.controlStations.values());
  }

  findControlStationByIdentifier(identifier: string): ControlStation | undefined {
    return Array.from(this.controlStations.values()).find(
      (s) => s.identifier === identifier
    );
  }

  updateControlStation(
    id: string,
    updates: Partial<ControlStation>
  ): ControlStation | null {
    const station = this.controlStations.get(id);
    if (!station) return null;
    const updated = { ...station, ...updates };
    this.controlStations.set(id, updated);
    return updated;
  }

  deleteControlStation(id: string): boolean {
    return this.controlStations.delete(id);
  }

  // Docking Station operations
  createDockingStation(
    station: Omit<DockingStation, "id">,
    id?: string
  ): DockingStation {
    const stationId = id || crypto.randomUUID();
    const newStation: DockingStation = {
      ...station,
      id: stationId,
    };
    this.dockingStations.set(stationId, newStation);
    return newStation;
  }

  getDockingStation(id: string): DockingStation | undefined {
    return this.dockingStations.get(id);
  }

  getAllDockingStations(): DockingStation[] {
    return Array.from(this.dockingStations.values());
  }

  findDockingStationByIdentifier(identifier: string): DockingStation | undefined {
    return Array.from(this.dockingStations.values()).find(
      (s) => s.identifier === identifier
    );
  }

  updateDockingStation(
    id: string,
    updates: Partial<DockingStation>
  ): DockingStation | null {
    const station = this.dockingStations.get(id);
    if (!station) return null;
    const updated = { ...station, ...updates };
    this.dockingStations.set(id, updated);
    return updated;
  }

  deleteDockingStation(id: string): boolean {
    return this.dockingStations.delete(id);
  }

  // Project operations
  createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt"> & { createdAt?: Date; updatedAt?: Date }, id?: string): Project {
    const projectId = id || crypto.randomUUID();
    const now = new Date();
    const newProject: Project = {
      ...project,
      id: projectId,
      createdAt: project.createdAt || now,
      updatedAt: project.updatedAt || now,
    };
    this.projects.set(projectId, newProject);
    return newProject;
  }

  getProject(id: string): Project | undefined {
    return this.projects.get(id);
  }

  getAllProjects(): Project[] {
    return Array.from(this.projects.values());
  }

  findProjectByName(name: string): Project | undefined {
    return Array.from(this.projects.values()).find(
      (p) => p.name === name
    );
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const project = this.projects.get(id);
    if (!project) return null;
    const updated = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updated);
    return updated;
  }

  deleteProject(id: string): boolean {
    return this.projects.delete(id);
  }

  // User operations
  createUser(user: Omit<User, "id" | "createdAt"> & { createdAt?: Date }, id?: string): User {
    const userId = id || crypto.randomUUID();
    const newUser: User = {
      ...user,
      id: userId,
      createdAt: user.createdAt || new Date(),
    };
    this.users.set(userId, newUser);
    return newUser;
  }

  getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  findUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.email === email);
  }

  // Log operations
  createLog(log: Omit<Log, "id" | "timestamp"> & { timestamp?: Date }, id?: string): Log {
    const logId = id || crypto.randomUUID();
    const newLog: Log = {
      ...log,
      id: logId,
      timestamp: log.timestamp || new Date(),
    };
    this.logs.push(newLog);
    // Keep only last 10000 logs
    if (this.logs.length > 10000) {
      this.logs = this.logs.slice(-10000);
    }
    return newLog;
  }

  getAllLogs(): Log[] {
    return [...this.logs].reverse(); // Most recent first
  }

  getLogsByType(type: LogType): Log[] {
    return this.logs.filter((log) => log.type === type).reverse();
  }

  getLogsBySource(source: string): Log[] {
    return this.logs.filter((log) => log.source === source).reverse();
  }

  // Relationship management
  assignDroneToProject(droneId: string, projectId: string | null): boolean {
    const drone = this.drones.get(droneId);
    if (!drone) return false;

    // Remove from old project
    if (drone.projectId) {
      const oldProject = this.projects.get(drone.projectId);
      if (oldProject) {
        oldProject.assignedDrones = oldProject.assignedDrones.filter(
          (id) => id !== droneId
        );
      }
    }

    // Add to new project
    drone.projectId = projectId;
    if (projectId) {
      const project = this.projects.get(projectId);
      if (project && !project.assignedDrones.includes(droneId)) {
        project.assignedDrones.push(droneId);
      }
    }

    return true;
  }

  assignDroneToControlStation(
    droneId: string,
    stationId: string | null
  ): boolean {
    const drone = this.drones.get(droneId);
    if (!drone) return false;

    // Remove from old station
    if (drone.controlStationId) {
      const oldStation = this.controlStations.get(drone.controlStationId);
      if (oldStation) {
        oldStation.connectedDrones = oldStation.connectedDrones.filter(
          (id) => id !== droneId
        );
      }
    }

    // Add to new station
    drone.controlStationId = stationId;
    if (stationId) {
      const station = this.controlStations.get(stationId);
      if (station && !station.connectedDrones.includes(droneId)) {
        station.connectedDrones.push(droneId);
      }
    }

    return true;
  }

  assignDroneToDockingStation(
    droneId: string,
    stationId: string | null
  ): boolean {
    const drone = this.drones.get(droneId);
    if (!drone) return false;

    // Remove from old station
    if (drone.dockingStationId) {
      const oldStation = this.dockingStations.get(drone.dockingStationId);
      if (oldStation) {
        oldStation.connectedDrones = oldStation.connectedDrones.filter(
          (id) => id !== droneId
        );
      }
    }

    // Add to new station
    drone.dockingStationId = stationId;
    if (stationId) {
      const station = this.dockingStations.get(stationId);
      if (station && !station.connectedDrones.includes(droneId)) {
        station.connectedDrones.push(droneId);
      }
    }

    return true;
  }

  assignUserToProject(userId: string, projectId: string): boolean {
    const user = this.users.get(userId);
    const project = this.projects.get(projectId);
    if (!user || !project) return false;

    if (!user.assignedProjects.includes(projectId)) {
      user.assignedProjects.push(projectId);
    }
    if (!project.assignedUsers.includes(userId)) {
      project.assignedUsers.push(userId);
    }

    return true;
  }

  removeUserFromProject(userId: string, projectId: string): boolean {
    const user = this.users.get(userId);
    const project = this.projects.get(projectId);
    if (!user || !project) return false;

    user.assignedProjects = user.assignedProjects.filter((id) => id !== projectId);
    project.assignedUsers = project.assignedUsers.filter((id) => id !== userId);

    return true;
  }
}

// Singleton instance
export const db = new Database();

// Initialize seed data synchronously on server side
if (typeof window === "undefined") {
  // Import and call initDatabase immediately
  // This ensures data is seeded before any requests
  (async () => {
    try {
      const { initDatabase } = await import("./init");
      initDatabase();
    } catch (e) {
      // If async import fails, try require
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const initModule = require("./init");
        initModule.initDatabase();
      } catch (err) {
        console.error("Failed to initialize database:", err);
      }
    }
  })();
}
