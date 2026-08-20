import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getTodaysLocation } from "./locations";
import { haversineDistanceMiles } from "./haversine";

const FOUND_THRESHOLD_MILES = 25;

export const submitGuess = mutation({
  args: {
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const location = await getTodaysLocation(ctx);
    if (!location) {
      throw new Error("No monster location available for today");
    }

    const distance = haversineDistanceMiles(
      args.latitude,
      args.longitude,
      location.lat,
      location.lng,
    );

    await ctx.db.insert("guesses", {
      userId: identity.subject,
      date: new Date().toISOString(),
      latitude: args.latitude,
      longitude: args.longitude,
      distance,
    });

    const found = distance < FOUND_THRESHOLD_MILES;

    return {
      distance,
      found,
      tags: found ? location.tags : undefined,
    };
  },
});
