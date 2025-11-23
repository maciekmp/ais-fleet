import { ControlStationForm } from "@/components/forms/control-station-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewControlStationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Control Station</h1>
        <p className="text-muted-foreground">Create a new control station entry</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Control Station Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlStationForm />
        </CardContent>
      </Card>
    </div>
  );
}
