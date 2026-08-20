"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Guess, MapProps } from "../types";

const getSeverityColor = (distance: number) => {
  if (distance < 25) return "bg-red-300";
  if (distance < 150) return "bg-orange-300";
  if (distance < 500) return "bg-yellow-300";
  if (distance < 2500) return "bg-green-300";
  return "bg-blue-300";
};

const createCustomIcon = (distance: number) => {
  const severityClass = getSeverityColor(distance);

  return L.divIcon({
    className: "custom-icon",
    html: `<div class="rounded-full w-4 h-4 ${severityClass} border-2 border-white shadow-lg"></div>`,
  });
};

function LocationMarker({ onNewGuess, onFound }: MapProps): JSX.Element {
  const [positions, setPositions] = useState<Guess[]>([]);
  const submitGuess = useMutation(api.guesses.submitGuess);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      submitGuess({ latitude: lat, longitude: lng }).then((result) => {
        const newGuess: Guess = {
          latitude: lat,
          longitude: lng,
          distance: result.distance,
        };

        setPositions((prevPositions) => [...prevPositions, newGuess]);
        onNewGuess(newGuess);

        if (result.found) {
          onFound(result.tags ?? []);
        }
      });
    },
  });

  return (
    <>
      {positions.map((guess, index) => (
        <Marker
          key={`${guess.latitude}-${guess.longitude}`}
          position={[guess.latitude, guess.longitude]}
          icon={createCustomIcon(guess.distance)} // Custom marker icon
        ></Marker>
      ))}
    </>
  );
}

const Map = ({ onNewGuess, onFound }: MapProps) => {
  return (
    <MapContainer
      center={[40, -100]} // Default coordinates
      zoom={3}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onNewGuess={onNewGuess} onFound={onFound} />
    </MapContainer>
  );
};

export default Map;
