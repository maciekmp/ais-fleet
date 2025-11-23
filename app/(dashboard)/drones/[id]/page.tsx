import { getDrone } from "@/lib/actions/drones";
import { getProjects } from "@/lib/actions/projects";
import { getControlStations } from "@/lib/actions/control-stations";
import { getDockingStations } from "@/lib/actions/docking-stations";
import { DroneForm } from "@/components/forms/drone-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function DroneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [drone, projects, controlStations, dockingStations] = await Promise.all([
    getDrone(id),
    getProjects(),
    getControlStations(),
    getDockingStations(),
  ]);

  if (!drone) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/drones">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{drone.name}</h1>
          <p className="text-muted-foreground">Drone Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Drone</CardTitle>
        </CardHeader>
        <CardContent>
          <DroneForm
            drone={drone}
            projects={projects}
            controlStations={controlStations}
            dockingStations={dockingStations}
          />
        </CardContent>
      </Card>
    </div>
  );
}
