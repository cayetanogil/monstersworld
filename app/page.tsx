"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Map from "../app/components/Map";
import moment from "moment";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

interface MonsterLocation {
  date: string;
  filename: string;
  lat: number;
  lng: number;
  tags: string[];
}

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const [todaysMonster, setTodaysMonster] = useState<MonsterLocation | null>(
    null,
  );
  const todaysDate = moment().format("YYYY-MM-DD");

  const response = useQuery(api.locations.getTodaysMonster, { todaysDate });

  useEffect(() => {
    if (response) {
      setTodaysMonster(response);
    }
  }, [response]);

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <>
      <div className="flex w-4/12 flex-col p-4">
        <h2 className="text-2xl font-semibold">Sighting of the Day</h2>
        <p className="py-2">
          Someone out there just sent us this report.
          <br />
          Can you help us locate the monster?
        </p>
        <div className="relative h-80 w-80 overflow-hidden">
          {todaysMonster ? (
            <Image
              src={`/monsters/${todaysMonster.filename}`}
              alt="Today's monster"
              fill={true}
            />
          ) : (
            <p>No monster found for today!</p>
          )}
        </div>
      </div>

      <div className="relative h-[500px] w-full p-4">
        {todaysMonster ? (
          <Map monster={todaysMonster} userId={userId} />
        ) : (
          <p>No monster found for today!</p>
        )}
      </div>
    </>
  );
}
