import { getProject } from "@/lib/actions/projects";
import { getDrones } from "@/lib/actions/drones";
import { getUsers } from "@/lib/actions/users";
import { ProjectForm } from "@/components/forms/project-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, drones, users] = await Promise.all([
    getProject(id),
    getDrones(),
    getUsers(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">Project Details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm project={project} drones={drones} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
