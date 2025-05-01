"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { geocodeAddress } from "@/lib/utils/geocode";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function MapPreview({
  latitude,
  longitude,
  location,
  markerText,
  showDirection,
}: {
  latitude: number;
  longitude: number;
  markerText: string;
  location?: {
    address?: string;
    city?: string;
    country?: string;
    postcode?: string;
  };
  showDirection?: boolean;
}) {
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setCoordinates({ lat: latitude, lng: longitude });
    } else if (location?.address || location?.city || location?.country) {
      const fullAddress = [location?.address, location?.city, location?.country]
        .filter(Boolean)
        .join(", ");

      geocodeAddress(fullAddress).then((coords) => {
        if (coords) setCoordinates(coords);
      });
    } else {
      return;
    }
  }, []);
  // Custom marker with always-visible text
  const ModernIcon = L.divIcon({
    html: `
      <div style="position: relative; display: inline-block;">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#3367D6" stroke="#ffffff" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <div style="
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          background: white;
          padding: 2px 8px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          font-size: 12px;
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        ">
          ${markerText}
        </div>
      </div>
    `,
    iconSize: [32, 42], // Increased height to accommodate label
    iconAnchor: [16, 42], // Adjusted anchor point
    className: "",
  });

  if (!coordinates?.lat || !coordinates.lng) {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          height: "300px",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
          isolation: "isolate",
        }}
      >
        <MapContainer
          center={[coordinates?.lat, coordinates?.lng]}
          zoom={15}
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
          }}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            opacity={0.15}
            zIndex={0}
          />

          <Marker
            position={[coordinates?.lat, coordinates?.lng]}
            icon={ModernIcon}
            eventHandlers={{
              add: (e) => {
                // Type-safe event handling
                const marker = e.target as L.Marker;
                marker.openPopup();
              },
            }}
          >
            <Popup closeButton={false} className="">
              <div
                style={{
                  padding: "4px 8px",
                  fontWeight: "500",
                  color: "#1f2937",
                }}
              >
                {markerText}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
      {showDirection && (
        <Button
          variant="outline"
          className="w-full mt-3 border-hairsby-orange text-hairsby-orange hover:bg-hairsby-orange/10"
          asChild
        >
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Get Directions
          </a>
        </Button>
      )}
    </div>
  );
}
