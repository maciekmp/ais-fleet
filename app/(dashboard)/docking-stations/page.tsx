import { getDockingStations } from "@/lib/actions/docking-stations";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClickableTableRow } from "@/components/ui/clickable-table-row";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DockingStationsPage() {
  const stations = await getDockingStations();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "occupied":
        return "secondary";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Docking Stations</h1>
          <p className="text-muted-foreground">
            Manage docking stations
          </p>
        </div>
        <Link href="/docking-stations/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Station
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Identifier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Firmware</TableHead>
              <TableHead>Connected Drones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No docking stations found
                </TableCell>
              </TableRow>
            ) : (
              stations.map((station) => (
                <ClickableTableRow key={station.id} href={`/docking-stations/${station.id}`}>
                  <TableCell className="font-medium">{station.name}</TableCell>
                  <TableCell>{station.identifier}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(station.status)}>
                      {station.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{station.firmwareVersion}</TableCell>
                  <TableCell>{station.connectedDrones.length}</TableCell>
                </ClickableTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
