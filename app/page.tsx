import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import moment from "moment";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import { useAuth } from "@clerk/nextjs";

import Map from "../app/components/Map";
import SeverityBadge from "./components/SeverityBadge";

import { Guess, MonsterLocation } from "./types";

export default function Home(): JSX.Element {
  const { isLoaded, userId } = useAuth();

  const [todaysMonster, setTodaysMonster] = useState<MonsterLocation | null>(
    null,
  );
  const [attempts, setAttempts] = useState<Guess[] | null>(null);
  const [isWinnerOpen, setIsWinnerOpen] = useState<boolean>(false);

  const todaysDate = moment().format("YYYY-MM-DD");

  const response = useQuery(api.locations.getTodaysMonster, { todaysDate });

  function handleGuess(guess: Guess): Guess {
    const tempAttemptList: Guess[] = [guess, ...(attempts || [])];
    setAttempts(tempAttemptList);
    return guess;
  }

  function handleFound() {
    setIsWinnerOpen(true);
  }

  const formatDistanceCopy = useCallback((distance: number) => {
    const newDistance = Math.round(distance * 10) / 10;
    let colorSeverity;
    let copy;

    if (distance > 2500) {
      colorSeverity = 5;
      copy = "You are oceans away!";
    } else if (distance > 500) {
      colorSeverity = 4;
      copy = "You are in the same continent!";
    } else if (distance > 150) {
      colorSeverity = 3;
      copy = "You are in a nearby city!";
    } else if (distance > 25) {
      colorSeverity = 2;
      copy = "The monster is close, look for cover!";
    } else {
      colorSeverity = 1;
      copy = "You found the monster!";
    }

    return (
      <div>
        <SeverityBadge severity={colorSeverity}>
          {newDistance} miles
        </SeverityBadge>
        <span className="ml-2">{copy}</span>
      </div>
    );
  }, []);

  useEffect(() => {
    if (response) {
      setTodaysMonster(response);
    }
  }, [response]);

  if (!isLoaded || !userId) {
    return (
      <div className="mx-auto flex w-1/3 flex-col rounded-xl bg-slate-800 p-8 shadow">
        <h2 className="mb-4 text-center text-2xl font-semibold uppercase tracking-wider text-blue-200">
          Monster Map Challenge
        </h2>
        <p className="mb-2 text-pretty leading-relaxed">
          Embark on a thrilling global adventure!{" "}
        </p>
        <p className="mb-2 text-pretty leading-relaxed">
          Each day, a new monster image appears against a famous landmark
          background.{" "}
        </p>
        <p className="mb-2 text-pretty leading-relaxed">
          Your mission? Identify the location and place your guess on the map.
          The closer you get, the higher your score!
        </p>
        <p className="mb-2 leading-relaxed">
          Unleash your inner explorer and see how your guessing skills stack up
          against players around the world.
        </p>
        <p className="mb-2">
          Join the challenge, have fun, and discover exciting new places!
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row px-4">
      <div className="flex flex-1 flex-grow flex-col justify-between p-4">
        <h2 className="text-2xl font-semibold uppercase tracking-wider text-blue-200">
          Sighting of the Day
        </h2>
        <p className="">
          A new terrifying report just arrived!
          <br />
          Can you help us locate the monster?
        </p>
        <div className="mx-auto w-80 -rotate-3 rounded-sm bg-slate-100 px-4 pb-12 pt-4 shadow-lg">
          <div className="relative flex h-80 flex-col items-center justify-around overflow-hidden bg-slate-300">
            {todaysMonster ? (
              <Image
                src={`/monsters/${todaysMonster.filename}`}
                alt="Picture of today's monster!"
                fill={true}
                priority={true}
                sizes="1024px"
              />
            ) : (
              <p className="text-slate-600">Loading picture...</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex-grow p-4">
        <div className="relative h-[540px] w-full bg-slate-100 p-4 shadow-lg">
          {todaysMonster && (
            <Map
              monster={todaysMonster}
              userId={userId}
              onNewGuess={handleGuess}
              onFound={handleFound}
            />
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-grow flex-col p-4">
        <h3 className="bg-slate-800 px-4 text-xl font-semibold leading-loose tracking-wide">
          Attempts
        </h3>
        <div className="h-[500px] overflow-x-hidden overflow-y-scroll bg-slate-600">
          <ul className="h-full">
            {attempts ? (
              attempts.map((value, index) => (
                <li className="border-b-2 border-b-slate-700 p-2" key={index}>
                  {formatDistanceCopy(value.distance)}
                </li>
              ))
            ) : (
              <li className="flex h-full flex-col items-center justify-around text-slate-400">
                <span>Click on the map to start!</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Winner Dialog */}
      <Dialog
        open={isWinnerOpen}
        onClose={() => setIsWinnerOpen(false)}
        className="relative z-[9999]"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 rounded-2xl border-8 border-slate-700 bg-slate-800 p-12 shadow-lg">
            <DialogTitle className="text-pretty text-xl font-bold uppercase tracking-wide">
              Congrats, you captured the monster!
            </DialogTitle>
            {todaysMonster && todaysMonster?.tags?.length > 0 && (
              <Description>
                <div className="text-slate-200">
                  <div className="mb-2">
                    <span className="font-mono uppercase">🏛️ Landmark : </span>
                    {todaysMonster.tags[0]}
                  </div>

                  <div className="mb-2">
                    <span className="font-mono uppercase">📍 Location : </span>
                    {todaysMonster.tags[1]}
                  </div>
                  <div>
                    <span className="block text-pretty py-2 leading-normal">
                      {todaysMonster.tags[2]}
                    </span>
                  </div>
                </div>
              </Description>
            )}
            <div className="flex flex-row justify-end">
              <button
                className="rounded bg-slate-700 px-6 py-2 text-sm tracking-wide transition-all hover:bg-slate-600"
                onClick={() => {
                  setAttempts(null);
                  setIsWinnerOpen(false);
                }}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
