# Drone Fleet Management Dashboard

A Next.js dashboard application for managing drones, control stations, docking stations, projects, and users.

## Features

- **Asset Management**: Manage drones, control stations, docking stations, projects, and users
- **Unified Dashboard**: Overview of system status and statistics
- **Editable Forms**: Direct editing of asset details without needing an edit button
- **Webhook API**: Endpoint for drone communication (registration, status updates, pings)
- **Logging System**: View and filter system logs and drone communications
- **Relationship Management**: Assign drones to projects, stations to drones, users to projects
- **Pending Registrations**: New drones from webhooks start with "pending" status until linked to a project

## Tech Stack

- **Next.js** (latest) with App Router
- **TypeScript**
- **shadcn/ui** components
- **Tailwind CSS**
- **React Hook Form** with Zod validation
- **Mock Database** (in-memory with automatic seeding)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  (dashboard)/          # Dashboard routes
    page.tsx            # Main dashboard
    drones/             # Drone management
    control-stations/   # Control station management
    docking-stations/   # Docking station management
    projects/           # Project management
    users/              # User management
    logs/               # System logs
  api/
    webhooks/
      drones/           # Webhook endpoint for drone communication
lib/
  db/                   # Mock database
  actions/              # Server actions
components/
  ui/                   # shadcn/ui components
  forms/                # Form components
  dashboard/            # Dashboard components
  logs/                 # Log components
```

## Webhook API

The webhook endpoint accepts POST requests at `/api/webhooks/drones` with the following format:

```json
{
  "type": "registration" | "status_update" | "ping",
  "serialNumber": "DRN-001",
  "data": {
    "firmwareVersion": "3.2.1",
    "location": { "lat": 40.7128, "lng": -74.006 },
    "status": "active"
  }
}
```

### Webhook Types

- **registration**: Creates a new drone with "pending" status or updates existing registration
- **status_update**: Updates drone status and other information
- **ping**: Updates last ping timestamp and location

## Seed Data

The application automatically seeds sample data on first load if the database is empty.

## Development

- Run `npm run dev` to start the development server
- Run `npm run build` to build for production
- Run `npm start` to start the production server
