"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { HaversineDistance } from "../utils";
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

function LocationMarker({
  monster,
  userId,
  onNewGuess,
  onFound,
}: MapProps): JSX.Element {
  const [positions, setPositions] = useState<Guess[]>([]);
  const mutateGuess = useMutation(api.guesses.addGuess);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const todaysDate = new Date().toISOString();
      const correctLocation = { lat: monster.lat, lng: monster.lng };
      const distance = HaversineDistance(
        lat,
        lng,
        correctLocation.lat,
        correctLocation.lng,
      );

      const newGuess: Guess = {
        date: todaysDate,
        userId: userId,
        latitude: lat,
        longitude: lng,
        distance: distance,
      };

      setPositions((prevPositions) => [...prevPositions, newGuess]);
      onNewGuess(newGuess);
      mutateGuess(newGuess);
      if (distance < 25) {
        onFound();
        return;
      }
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

const Map = ({ monster, userId, onNewGuess, onFound }: MapProps) => {
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
      <LocationMarker
        monster={monster}
        userId={userId}
        onNewGuess={onNewGuess}
        onFound={onFound}
      />
    </MapContainer>
  );
};

export default Map;
