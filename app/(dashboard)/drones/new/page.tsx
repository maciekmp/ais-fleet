import { getProjects } from "@/lib/actions/projects";
import { getControlStations } from "@/lib/actions/control-stations";
import { getDockingStations } from "@/lib/actions/docking-stations";
import { DroneForm } from "@/components/forms/drone-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewDronePage() {
  const [projects, controlStations, dockingStations] = await Promise.all([
    getProjects(),
    getControlStations(),
    getDockingStations(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Drone</h1>
        <p className="text-muted-foreground">Create a new drone entry</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Drone Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DroneForm
            projects={projects}
            controlStations={controlStations}
            dockingStations={dockingStations}
          />
        </CardContent>
      </Card>
    </div>
  );
}
