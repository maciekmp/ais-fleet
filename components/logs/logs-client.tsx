"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface LogsClientProps {
  initialType?: string;
  initialSeverity?: string;
  initialSource?: string;
  initialSearch?: string;
}

export function LogsClient({
  initialType,
  initialSeverity,
  initialSource,
  initialSearch,
}: LogsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState(initialType || "all");
  const [severity, setSeverity] = useState(initialSeverity || "all");
  const [source, setSource] = useState(initialSource || "");
  const [search, setSearch] = useState(initialSearch || "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (type && type !== "all") params.set("type", type);
    if (severity && severity !== "all") params.set("severity", severity);
    if (source) params.set("source", source);
    if (search) params.set("search", search);

    const timeoutId = setTimeout(() => {
      router.push(`/logs?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [type, severity, source, search, router]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="ping">Ping</SelectItem>
                <SelectItem value="status_update">Status Update</SelectItem>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger id="severity">
                <SelectValue placeholder="All severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All severities</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              placeholder="Filter by source..."
              value={source}
              onChange={(e) => setSource(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
