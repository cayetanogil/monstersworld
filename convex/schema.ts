import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  locations: defineTable({
    date: v.string(),
    filename: v.string(),
    lat: v.float64(),
    lng: v.float64(),
    tags: v.array(v.string()),
  }),
  guesses: defineTable({
    userId: v.string(),
    date: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    distance: v.number(),
  }),
  leaderboard: defineTable({
    userId: v.string(),
    date: v.string(),
    attempts: v.number(),
    distance: v.number(),
  }),
});
