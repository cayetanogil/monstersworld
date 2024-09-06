import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTodaysMonster = query({
  args: { todaysDate: v.string() },
  handler: async (ctx, args) => {
    const monster = await ctx.db
      .query("locations")
      .filter((q) => q.eq(q.field("date"), args.todaysDate))
      .first();
    return monster;
  },
});
