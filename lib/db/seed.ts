import { db } from "./index";

export function seedDatabase() {
  // Create sample projects
  const project1 = db.createProject({
    name: "Urban Survey Project",
    description: "Surveying urban areas for mapping and analysis",
    status: "active",
    metadata: {},
    assignedDrones: [],
    assignedUsers: [],
  });

  const project2 = db.createProject({
    name: "Agricultural Monitoring",
    description: "Monitoring crop health and growth",
    status: "active",
    metadata: {},
    assignedDrones: [],
    assignedUsers: [],
  });

  // Create sample users
  const user1 = db.createUser({
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    metadata: {},
    assignedProjects: [],
  });

  const user2 = db.createUser({
    name: "Jane Smith",
    email: "jane@example.com",
    role: "operator",
    metadata: {},
    assignedProjects: [],
  });

  // Assign users to projects
  db.assignUserToProject(user1.id, project1.id);
  db.assignUserToProject(user2.id, project1.id);
  db.assignUserToProject(user2.id, project2.id);

  // Create control stations
  const controlStation1 = db.createControlStation({
    name: "Main Control Center",
    identifier: "CTRL-001",
    status: "online",
    firmwareVersion: "2.1.0",
    location: { lat: 40.7128, lng: -74.006, address: "New York, NY" },
    configuration: {},
    metadata: {},
    connectedDrones: [],
  });

  const controlStation2 = db.createControlStation({
    name: "Field Control Station",
    identifier: "CTRL-002",
    status: "online",
    firmwareVersion: "2.0.5",
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    configuration: {},
    metadata: {},
    connectedDrones: [],
  });

  // Create docking stations
  const dockingStation1 = db.createDockingStation({
    name: "Dock Alpha",
    identifier: "DOCK-001",
    status: "available",
    firmwareVersion: "1.5.0",
    location: { lat: 40.7128, lng: -74.006, address: "New York, NY" },
    configuration: {},
    metadata: {},
    connectedDrones: [],
  });

  const dockingStation2 = db.createDockingStation({
    name: "Dock Beta",
    identifier: "DOCK-002",
    status: "available",
    firmwareVersion: "1.5.0",
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    configuration: {},
    metadata: {},
    connectedDrones: [],
  });

  // Create drones
  const drone1 = db.createDrone({
    name: "Drone Alpha-1",
    serialNumber: "DRN-001",
    status: "active",
    firmwareVersion: "3.2.1",
    location: { lat: 40.7128, lng: -74.006, address: "New York, NY" },
    configuration: { maxAltitude: 120, batteryCapacity: 100 },
    metadata: { model: "DJI Phantom 4" },
    projectId: project1.id,
    controlStationId: controlStation1.id,
    dockingStationId: dockingStation1.id,
    lastPing: new Date(),
  });

  const drone2 = db.createDrone({
    name: "Drone Beta-1",
    serialNumber: "DRN-002",
    status: "active",
    firmwareVersion: "3.1.5",
    location: { lat: 34.0522, lng: -118.2437, address: "Los Angeles, CA" },
    configuration: { maxAltitude: 150, batteryCapacity: 95 },
    metadata: { model: "DJI Mavic 3" },
    projectId: project2.id,
    controlStationId: controlStation2.id,
    dockingStationId: null,
    lastPing: new Date(Date.now() - 300000), // 5 minutes ago
  });

  const drone3 = db.createDrone({
    name: "Drone Gamma-1",
    serialNumber: "DRN-003",
    status: "pending",
    firmwareVersion: "2.9.0",
    location: { lat: 41.8781, lng: -87.6298, address: "Chicago, IL" },
    configuration: { maxAltitude: 100, batteryCapacity: 80 },
    metadata: { model: "Autel EVO II" },
    projectId: null,
    controlStationId: null,
    dockingStationId: null,
    lastPing: null,
  });

  // Create some logs
  db.createLog({
    type: "registration",
    source: "DRN-001",
    message: "Drone DRN-001 registered successfully",
    data: { firmwareVersion: "3.2.1" },
    severity: "info",
  });

  db.createLog({
    type: "ping",
    source: "DRN-001",
    message: "Ping received from DRN-001",
    data: { location: { lat: 40.7128, lng: -74.006 } },
    severity: "info",
  });

  db.createLog({
    type: "status_update",
    source: "DRN-002",
    message: "Status update from DRN-002: active",
    data: { status: "active", battery: 95 },
    severity: "info",
  });

  db.createLog({
    type: "registration",
    source: "DRN-003",
    message: "New drone DRN-003 registered - pending assignment",
    data: { firmwareVersion: "2.9.0" },
    severity: "warning",
  });

  db.createLog({
    type: "system",
    source: "system",
    message: "System backup completed successfully",
    data: {},
    severity: "info",
  });

  return {
    projects: [project1, project2],
    users: [user1, user2],
    controlStations: [controlStation1, controlStation2],
    dockingStations: [dockingStation1, dockingStation2],
    drones: [drone1, drone2, drone3],
  };
}
