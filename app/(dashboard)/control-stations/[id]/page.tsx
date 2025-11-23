import { getControlStation } from "@/lib/actions/control-stations";
import { ControlStationForm } from "@/components/forms/control-station-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ControlStationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const station = await getControlStation(id);

  if (!station) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/control-stations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{station.name}</h1>
          <p className="text-muted-foreground">Control Station Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Control Station</CardTitle>
        </CardHeader>
        <CardContent>
          <ControlStationForm station={station} />
        </CardContent>
      </Card>
    </div>
  );
}
