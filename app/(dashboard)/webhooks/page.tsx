import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";
import { headers } from "next/headers";

export default async function WebhooksPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <p className="text-muted-foreground">
          Integrate your drones and devices with the fleet management system
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Webhooks allow external devices (drones, control stations, etc.) to communicate with 
            the fleet management system in real-time. When a device sends data to a webhook endpoint, 
            the system automatically processes the information and updates the corresponding records.
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline">POST</Badge>
            <code className="text-sm bg-muted px-2 py-1 rounded">
              {baseUrl}/api/webhooks/drones
            </code>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Device Sends Data</h4>
                <p className="text-sm text-muted-foreground">
                  Your drone or device sends a POST request to the webhook endpoint with event data.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">System Processes</h4>
                <p className="text-sm text-muted-foreground">
                  The system validates the request, updates the database, and creates a log entry.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Response Sent</h4>
                <p className="text-sm text-muted-foreground">
                  The system responds with a success confirmation and relevant data.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Format</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Headers</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              Content-Type: application/json
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Required Fields</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><code className="bg-muted px-1 rounded">type</code> - Event type (registration, status_update, or ping)</li>
              <li><code className="bg-muted px-1 rounded">serialNumber</code> - Unique device identifier</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Optional Fields</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li><code className="bg-muted px-1 rounded">data</code> - Additional payload data (see examples below)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Registration Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Register a new drone or update an existing registration. New drones are created with 
              "pending" status until manually linked to a project in the dashboard.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Example Request</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`POST /api/webhooks/drones
Content-Type: application/json

{
  "type": "registration",
  "serialNumber": "DRN-001",
  "data": {
    "name": "Drone Alpha-1",
    "firmwareVersion": "3.2.1",
    "location": {
      "lat": 40.7128,
      "lng": -74.006,
      "address": "New York, NY"
    },
    "configuration": {
      "maxAltitude": 120,
      "batteryCapacity": 100
    },
    "metadata": {
      "model": "DJI Phantom 4"
    }
  }
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "droneId": "drone-1",
  "status": "pending"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What Happens</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Creates a new drone record if serial number doesn't exist</li>
                <li>Updates existing drone if already registered</li>
                <li>Sets status to "pending" for new drones</li>
                <li>Creates a log entry with type "registration"</li>
                <li>Stores raw message data for debugging</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              Status Update Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Update drone status and other information. The drone must be registered first.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Example Request</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`POST /api/webhooks/drones
Content-Type: application/json

{
  "type": "status_update",
  "serialNumber": "DRN-001",
  "data": {
    "status": "active",
    "firmwareVersion": "3.2.2",
    "location": {
      "lat": 40.7150,
      "lng": -74.0080
    },
    "configuration": {
      "battery": 85,
      "signalStrength": 95
    }
  }
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "droneId": "drone-1",
  "status": "active"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What Happens</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Updates drone status (active, inactive, maintenance, pending)</li>
                <li>Updates firmware version if provided</li>
                <li>Updates location if provided</li>
                <li>Updates configuration data</li>
                <li>Updates last ping timestamp</li>
                <li>Creates a log entry with type "status_update"</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Ping Webhook
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send periodic heartbeat/ping messages to indicate the drone is online and update its location.
            </p>
            
            <div>
              <h4 className="font-semibold mb-2">Example Request</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`POST /api/webhooks/drones
Content-Type: application/json

{
  "type": "ping",
  "serialNumber": "DRN-001",
  "data": {
    "location": {
      "lat": 40.7128,
      "lng": -74.006
    },
    "battery": 78,
    "altitude": 50
  }
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Example Response</h4>
              <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`{
  "success": true,
  "droneId": "drone-1",
  "timestamp": "2025-11-23T16:00:00.000Z"
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">What Happens</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Updates last ping timestamp</li>
                <li>Updates location if provided</li>
                <li>Creates a log entry with type "ping"</li>
                <li>Helps track drone connectivity and activity</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Error Handling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">400 Bad Request</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Missing required fields or invalid webhook type.
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "error": "Missing required fields: type, serialNumber"
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold mb-2">404 Not Found</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Drone not registered (for status_update and ping types).
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "error": "Drone not found. Please register first."
}`}
            </pre>
          </div>
          <div>
            <h4 className="font-semibold mb-2">500 Internal Server Error</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Server-side error occurred while processing the request.
            </p>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`{
  "error": "Internal server error"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testing Webhooks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You can test webhooks using curl, Postman, or any HTTP client. Here's a quick example:
          </p>
          <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`curl -X POST ${baseUrl}/api/webhooks/drones \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "ping",
    "serialNumber": "DRN-001",
    "data": {
      "location": {
        "lat": 40.7128,
        "lng": -74.006
      }
    }
  }'`}
          </pre>
          <p className="text-sm text-muted-foreground">
            After sending a webhook, check the <a href="/logs" className="text-primary hover:underline">Logs page</a> to see 
            the processed events and raw message data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

