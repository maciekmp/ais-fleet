import { StatsCard } from "@/components/dashboard/stats-card";
import { getDrones } from "@/lib/actions/drones";
import { getControlStations } from "@/lib/actions/control-stations";
import { getDockingStations } from "@/lib/actions/docking-stations";
import { getProjects } from "@/lib/actions/projects";
import { getUsers } from "@/lib/actions/users";
import { getLogs } from "@/lib/actions/logs";
import {
  Plane,
  Radio,
  Home,
  FolderKanban,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";

export default async function DashboardPage() {
  const [drones, controlStations, dockingStations, projects, users, logs] =
    await Promise.all([
      getDrones(),
      getControlStations(),
      getDockingStations(),
      getProjects(),
      getUsers(),
      getLogs(),
    ]);

  const activeDrones = drones.filter((d) => d.status === "active").length;
  const pendingDrones = drones.filter((d) => d.status === "pending").length;
  const onlineStations = controlStations.filter((s) => s.status === "online").length;
  const availableDocks = dockingStations.filter((s) => s.status === "available").length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const recentLogs = logs.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your drone fleet system
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Drones"
          value={drones.length}
          icon={Plane}
          description={`${activeDrones} active, ${pendingDrones} pending`}
        />
        <StatsCard
          title="Control Stations"
          value={controlStations.length}
          icon={Radio}
          description={`${onlineStations} online`}
        />
        <StatsCard
          title="Docking Stations"
          value={dockingStations.length}
          icon={Home}
          description={`${availableDocks} available`}
        />
        <StatsCard
          title="Projects"
          value={projects.length}
          icon={FolderKanban}
          description={`${activeProjects} active`}
        />
      </div>

      <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    {log.severity === "error" ? (
                      <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                    ) : log.severity === "warning" ? (
                      <Clock className="h-4 w-4 text-yellow-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(log.timestamp, "PPp")} • {log.source}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/logs"
              className="text-sm text-primary hover:underline mt-4 block"
            >
              View all logs →
            </Link>
          </CardContent>
        </Card>
    </div>
  );
}