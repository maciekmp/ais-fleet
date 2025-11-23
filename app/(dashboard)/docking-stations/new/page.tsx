import { DockingStationForm } from "@/components/forms/docking-station-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewDockingStationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Docking Station</h1>
        <p className="text-muted-foreground">Create a new docking station entry</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Docking Station Information</CardTitle>
        </CardHeader>
        <CardContent>
          <DockingStationForm />
        </CardContent>
      </Card>
    </div>
  );
}
