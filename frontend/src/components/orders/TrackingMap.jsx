import React from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const TrackingMap = ({ routeMap }) => {
  if (!routeMap?.source?.lat || !routeMap?.destination?.lat) {
    return null;
  }

  const path = [
    [routeMap.source.lat, routeMap.source.lng],
    [routeMap.destination.lat, routeMap.destination.lng]
  ];

  return (
    <div className="tracking-map-shell">
      <MapContainer
        center={path[0]}
        zoom={5}
        scrollWheelZoom={false}
        className="tracking-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={path[0]} icon={markerIcon}>
          <Popup>{routeMap.source.label}</Popup>
        </Marker>
        <Marker position={path[1]} icon={markerIcon}>
          <Popup>{routeMap.destination.label}</Popup>
        </Marker>
        <Polyline positions={path} pathOptions={{ color: "#204f38", weight: 4 }} />
      </MapContainer>
    </div>
  );
};

export default TrackingMap;
