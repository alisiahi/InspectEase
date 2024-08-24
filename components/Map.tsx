"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.svg",
  iconUrl: "/leaflet/marker-icon.svg",
  shadowUrl: "/leaflet/marker-shadow.svg",
});

interface MapProps {
  initialPosition?: [number, number];
  markers?: [number, number][];
  selectable?: boolean;
  onLocationSelected?: (lat: number, lng: number) => void;
  showCurrentLocationMarker?: boolean;
  width?: string;
  height?: string;
}
const Map: React.FC<MapProps> = ({
  initialPosition,
  markers = [],
  selectable = false,
  onLocationSelected,
  showCurrentLocationMarker = true,
  width = "100%",
  height = "400px",
}) => {
  const [position, setPosition] = useState<[number, number]>(
    initialPosition || [51.505, -0.09]
  ); // Default to London
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            setPosition([latitude, longitude]);
            setLoading(false);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setPosition(initialPosition || [51.505, -0.09]); // Default to London
            setLoading(false);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
        setPosition(initialPosition || [51.505, -0.09]); // Default to London
        setLoading(false);
      }
    };

    if (showCurrentLocationMarker && !initialPosition) {
      getUserLocation();
    } else {
      setPosition(initialPosition || [51.505, -0.09]); // Default to London
      setLoading(false);
    }
  }, [initialPosition, showCurrentLocationMarker]);

  const MapContent = () => {
    const map = useMap();

    useEffect(() => {
      map.flyTo(position, map.getZoom());
    }, [position]);

    const handleClick = (e: L.LeafletMouseEvent) => {
      if (selectable) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelected?.(lat, lng);
      }
    };

    useEffect(() => {
      if (selectable) {
        map.on("click", handleClick);
      }
      return () => {
        map.off("click", handleClick);
      };
    }, [selectable]);

    return (
      <>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {showCurrentLocationMarker && <Marker position={position} />}
      </>
    );
  };

  if (loading) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: height, width: width }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapContent />
    </MapContainer>
  );
};

export default Map;
