import { getDrones } from "@/lib/actions/drones";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClickableTableRow } from "@/components/ui/clickable-table-row";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DronesPage() {
  const drones = await getDrones();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "pending":
        return "secondary";
      case "maintenance":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drones</h1>
          <p className="text-muted-foreground">
            Manage your drone fleet
          </p>
        </div>
        <Link href="/drones/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Drone
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Firmware</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Last Ping</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No drones found
                </TableCell>
              </TableRow>
            ) : (
              drones.map((drone) => (
                <ClickableTableRow key={drone.id} href={`/drones/${drone.id}`}>
                  <TableCell className="font-medium">{drone.name}</TableCell>
                  <TableCell>{drone.serialNumber}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(drone.status)}>
                      {drone.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{drone.firmwareVersion}</TableCell>
                  <TableCell>
                    {drone.projectId ? (
                      <Link
                        href={`/projects/${drone.projectId}`}
                        className="text-primary hover:underline"
                      >
                        View Project
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {drone.lastPing
                      ? new Date(drone.lastPing).toLocaleString()
                      : "Never"}
                  </TableCell>
                </ClickableTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
