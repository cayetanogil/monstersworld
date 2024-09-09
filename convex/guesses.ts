import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addGuess = mutation({
  args: {
    date: v.string(),
    distance: v.number(),
    latitude: v.number(),
    longitude: v.number(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const guessId = await ctx.db.insert("guesses", {
      date: args.date,
      distance: args.distance,
      latitude: args.latitude,
      longitude: args.longitude,
      userId: args.userId,
    });
  },
});
