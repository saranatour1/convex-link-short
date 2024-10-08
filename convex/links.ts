import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { randomisedId } from "./helpers";
import { MINUTE, RateLimiter } from "@convex-dev/ratelimiter";
import { components, internal } from "./_generated/api";

const rateLimiter = new RateLimiter(components.ratelimiter, {
  // One global / singleton rate limit
  // freeTrialSignUp: { kind: "fixed window", rate: 100, period: HOUR },
  addUrl: { kind: "token bucket", rate: 10, period: MINUTE, capacity: 3 },
});

export const viewer = query({
  args: {},
  handler: async (ctx, args_0) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Please login to add a new url");
    }
    
    const linksWithUserId = await ctx.db
      .query("linksToUsers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const links = (await Promise.all(linksWithUserId.map((item) => ctx.db.get(item.linkId)))).filter((i) => i != null);
    return links;
  },
});

export const addUrl = mutation({
  args: { url: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.links.testMutation, {
      name: args.name,
      url: args.url,
    });
  },
});

export const testMutation = internalMutation({
  args: { url: v.string(), name: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Please login to add a new url");
    }

    if (!args.url) {
      throw new ConvexError("Please add a valid url");
    }
    // rate limit component
    const  {ok, retryAfter } = await rateLimiter.limit(ctx, "addUrl", { key: userId, throws:true, count:3, });
    const randomId = randomisedId();
    const linkId = await ctx.db.insert("links", {
      name: args.name ? args.name : randomId,
      url: args.url,
      clicks: 0,
    });

    await ctx.db.insert("linksToUsers", {
      userId: userId,
      linkId: linkId,
    });
  },
});

export const deleteLink = mutation({
  args: { id: v.id("links") },
  handler: async (ctx, args_0) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Please login to add a new url");
    }

    const relationDelete = await ctx.db
      .query("linksToUsers")
      .withIndex("by_linkId", (q) => q.eq("linkId", args_0.id))
      .unique();

    await ctx.db.delete(relationDelete?._id!);
    await ctx.db.delete(args_0.id);
  },
});

export const updateLink = mutation({
  args: { name: v.string(), url: v.string(), id: v.id("links") },
  handler: async (ctx, args_0) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Please login to update this new url");
    }
    await ctx.db.patch(args_0.id, {
      name: args_0.name,
      url: args_0.url,
    });
  },
});
