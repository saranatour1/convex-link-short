import { z } from "zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery, zid } from "convex-helpers/server/zod";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { randomisedId } from "./helpers";
import { Doc } from "./_generated/dataModel";

const zMutation = zCustomMutation(mutation, NoOp);
const zQuery = zCustomQuery(query, NoOp);

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

export const addUrl = zMutation({
  args: { url: z.string().url(), name: z.string().optional() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Please login to add a new url");
    }

    if (!args.url) {
      throw new ConvexError("Please add a valid url");
    }

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

export const deleteLink = zMutation({
  args: { id: zid("links") },
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

export const updateLink = zMutation({
  args: { name: z.string().optional(), url: z.string().url().optional(), id: zid("links") },
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
