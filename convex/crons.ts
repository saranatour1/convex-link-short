import { components, internal } from "./_generated/api";
// import { Crons } from "@convex-dev/crons";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { v } from "convex/values";
import { cronJobs } from "convex/server";

const crons = cronJobs();
// const crons = new Crons(components.crons);


export const removeAnonymous = internalMutation({
  args: {},
  handler: async (ctx, args_0) => {
    // Fetch users who are marked as anonymous
    const allUsers = (await ctx.db.query("users").collect()).filter((user) => user.isAnonymous === true);

    // When I find the users, I get their relations
    for (const user of allUsers) {
      const authAccounts = await ctx.db
        .query("authAccounts")
        .withIndex("userIdAndProvider", (q) => q.eq("userId", user._id))
        .collect();

      const authSessions = await ctx.db
        .query("authSessions")
        .withIndex("userId", (q) => q.eq("userId", user._id))
        .collect();

      const authRefreshTokens = await Promise.all(
        authSessions.map((session) =>
          ctx.db
            .query("authRefreshTokens")
            .withIndex("sessionId", (q) => q.eq("sessionId", session._id))
            .collect()
        )
      );

      // Fetch links to users
      const linksRelation = await ctx.db
        .query("linksToUsers")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      // Fetch links table (actual links connected to users)
      const links = await Promise.all(
        linksRelation.map((linkRelation) =>
          ctx.db
            .query("links")
            .withIndex("by_id", (q) => q.eq("_id", linkRelation.linkId))
            .collect()
        )
      );

      // Deleting related records in the correct order
      try {
        for (const tokens of authRefreshTokens) {
          await Promise.all(tokens.map((token) => ctx.db.delete(token._id)));
        }

        await Promise.all(authSessions.map((session) => ctx.db.delete(session._id)));

        await Promise.all(authAccounts.map((account) => ctx.db.delete(account._id)));

        await Promise.all(linksRelation.map((link) => ctx.db.delete(link._id)));

        for (const linkSet of links) {
          await Promise.all(linkSet.map((link) => ctx.db.delete(link._id)));
        }

        await ctx.db.delete(user._id);
      } catch (error) {
        console.error(`Error deleting user ${user._id}: `, error);
      }
    }
  },
});

crons.monthly(
  "delete all notes",
  { day: 8, hourUTC: 16, minuteUTC: 0 },
  internal.crons.removeAnonymous
)

export default crons;