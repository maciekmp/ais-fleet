"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import type { Location } from "@/lib/db/types";

interface DroneMapProps {
  location: Location;
  droneName: string;
}

export function DroneMap({ location, droneName }: DroneMapProps) {
  // Create a custom icon for the drone marker
  const droneIcon = new Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]} icon={droneIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{droneName}</p>
              <p className="text-muted-foreground">
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              {location.address && (
                <p className="text-muted-foreground">{location.address}</p>
              )}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

