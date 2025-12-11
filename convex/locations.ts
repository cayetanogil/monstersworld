import { query } from "./_generated/server";

export const getTodaysMonster = query({
  args: {},
  handler: async (ctx) => {
    const locations = await ctx.db.query("locations").collect();

    if (locations.length === 0) {
      return null;
    }

    locations.sort((a, b) => a._creationTime - b._creationTime);

    const today = new Date();

    const todayUtcMidnight = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );

    const anchorUtcMidnight = Date.UTC(2025, 11, 10); // 2025-12-10

    const diffMs = todayUtcMidnight - anchorUtcMidnight;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const index =
      ((diffDays % locations.length) + locations.length) % locations.length;

    return locations[index];
  },
});
