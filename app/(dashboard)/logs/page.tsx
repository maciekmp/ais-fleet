import { getLogs } from "@/lib/actions/logs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { LogsClient } from "@/components/logs/logs-client";
import type { Log, LogType, LogSeverity } from "@/lib/db/types";

interface LogsPageProps {
  searchParams: Promise<{
    type?: string;
    severity?: string;
    source?: string;
    search?: string;
  }>;
}

export default async function LogsPage({ searchParams }: LogsPageProps) {
  const params = await searchParams;
  let logs = await getLogs();

  // Server-side filtering
  if (params.type && params.type !== "all") {
    logs = logs.filter((log) => log.type === params.type);
  }
  if (params.severity && params.severity !== "all") {
    logs = logs.filter((log) => log.severity === params.severity);
  }
  if (params.source) {
    logs = logs.filter((log) =>
      log.source.toLowerCase().includes(params.source!.toLowerCase())
    );
  }
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    logs = logs.filter(
      (log) =>
        log.message.toLowerCase().includes(searchLower) ||
        log.source.toLowerCase().includes(searchLower)
    );
  }

  const getSeverityVariant = (severity: LogSeverity) => {
    switch (severity) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getTypeColor = (type: LogType) => {
    switch (type) {
      case "registration":
        return "text-blue-600";
      case "status_update":
        return "text-green-600";
      case "ping":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Logs</h1>
        <p className="text-muted-foreground">
          View and filter system logs and drone communications
        </p>
      </div>

      <LogsClient
        initialType={params.type || "all"}
        initialSeverity={params.severity || "all"}
        initialSource={params.source}
        initialSearch={params.search}
      />

      <Card>
        <CardHeader>
          <CardTitle>Logs ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Raw Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(
                          log.timestamp instanceof Date
                            ? log.timestamp
                            : new Date(log.timestamp),
                          "PPp"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={getTypeColor(log.type)}>{log.type}</span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.source}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityVariant(log.severity)}>
                          {log.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {log.message}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {log.rawMessage ? (
                          <pre className="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-32">
                            {log.rawMessage}
                          </pre>
                        ) : (
                          <span className="text-muted-foreground text-xs">No raw data</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
