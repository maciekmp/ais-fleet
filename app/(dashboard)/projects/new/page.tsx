import { getDrones } from "@/lib/actions/drones";
import { getUsers } from "@/lib/actions/users";
import { ProjectForm } from "@/components/forms/project-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NewProjectPage() {
  const [drones, users] = await Promise.all([getDrones(), getUsers()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Project</h1>
        <p className="text-muted-foreground">Create a new project</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm drones={drones} users={users} />
        </CardContent>
      </Card>
    </div>
  );
}
