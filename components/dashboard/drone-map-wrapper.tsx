"use client";

import dynamic from "next/dynamic";
import type { Location } from "@/lib/db/types";

interface DroneMapWrapperProps {
  location: Location;
  droneName: string;
}

const DroneMap = dynamic(() => import("@/components/dashboard/drone-map").then((mod) => ({ default: mod.DroneMap })), {
  ssr: false,
});

export function DroneMapWrapper({ location, droneName }: DroneMapWrapperProps) {
  return (
    <div className="h-full w-full">
      <DroneMap location={location} droneName={droneName} />
    </div>
  );
}

