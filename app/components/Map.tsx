import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import moment from "moment";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface MonsterLocation {
  date: string;
  filename: string;
  lat: number;
  lng: number;
  tags: string[];
}

interface MapProps {
  monster: MonsterLocation;
  userId: string;
}

export const HaversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
};

function LocationMarker({ monster, userId }: MapProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const mutateGuess = useMutation(api.guesses.addGuess);

  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const todaysDate = moment().format("YYYY-MM-DD");
      const correctLocation = { lat: monster.lat, lng: monster.lng };
      const distance = HaversineDistance(
        lat,
        lng,
        correctLocation.lat,
        correctLocation.lng,
      );

      const newGuess = {
        date: todaysDate,
        userId: userId,
        latitude: lat,
        longitude: lng,
        distance: distance,
      };

      mutateGuess(newGuess);
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>
        Your Guess
        <br /> Latitude: {position.lat.toFixed(4)}, Longitude:{" "}
        {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  );
}

const Map = ({ monster, userId }: MapProps) => {
  return (
    <MapContainer
      center={[40, -100]} // Example valid center coordinate
      zoom={3}
      scrollWheelZoom={false}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker monster={monster} userId={userId} />
    </MapContainer>
  );
};

export default Map;
