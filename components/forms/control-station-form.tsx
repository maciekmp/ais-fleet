"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateControlStation, createControlStation } from "@/lib/actions/control-stations";
import type { ControlStation } from "@/lib/db/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

const stationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  identifier: z.string().min(1, "Identifier is required"),
  status: z.enum(["online", "offline", "maintenance"]),
  firmwareVersion: z.string().min(1, "Firmware version is required"),
  locationLat: z.string(),
  locationLng: z.string(),
  locationAddress: z.string().optional(),
});

type StationFormData = z.infer<typeof stationSchema>;

interface ControlStationFormProps {
  station?: ControlStation;
}

export function ControlStationForm({ station }: ControlStationFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!station;

  const form = useForm<StationFormData>({
    resolver: zodResolver(stationSchema),
    defaultValues: {
      name: station?.name || "",
      identifier: station?.identifier || "",
      status: station?.status || "online",
      firmwareVersion: station?.firmwareVersion || "1.0.0",
      locationLat: station?.location.lat.toString() || "0",
      locationLng: station?.location.lng.toString() || "0",
      locationAddress: station?.location.address || "",
    },
  });

  const onSubmit = async (data: StationFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (isEditMode && station) {
        await updateControlStation(station.id, {
          name: data.name,
          identifier: data.identifier,
          status: data.status,
          firmwareVersion: data.firmwareVersion,
          location: {
            lat: parseFloat(data.locationLat) || 0,
            lng: parseFloat(data.locationLng) || 0,
            address: data.locationAddress || undefined,
          },
        });
        router.refresh();
      } else {
        const result = await createControlStation({
          name: data.name,
          identifier: data.identifier,
          status: data.status,
          firmwareVersion: data.firmwareVersion,
          location: {
            lat: parseFloat(data.locationLat) || 0,
            lng: parseFloat(data.locationLng) || 0,
            address: data.locationAddress || undefined,
          },
        });

        if ("error" in result && result.error) {
          setError(result.error);
        } else if (result.success && result.station) {
          router.push(`/control-stations/${result.station.id}`);
          router.refresh();
        } else {
          setError("Failed to create control station");
        }
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} control station:`, err);
      setError(`An error occurred while ${isEditMode ? "updating" : "creating"} the control station`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...form.register("name")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="identifier">Identifier</Label>
          <Input id="identifier" {...form.register("identifier")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(value) => form.setValue("status", value as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="firmwareVersion">Firmware Version</Label>
          <Input id="firmwareVersion" {...form.register("firmwareVersion")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="locationLat">Latitude</Label>
            <Input
              id="locationLat"
              type="number"
              step="any"
              {...form.register("locationLat")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationLng">Longitude</Label>
            <Input
              id="locationLng"
              type="number"
              step="any"
              {...form.register("locationLng")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="locationAddress">Address</Label>
            <Input id="locationAddress" {...form.register("locationAddress")} />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Control Station"}
        </Button>
      </div>
    </form>
  );
}
