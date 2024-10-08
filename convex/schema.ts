import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  links: defineTable({
    name: v.string(),
    url: v.string(),
    clicks: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_url", ["url"])
    .index("by_clicks", ["clicks"]),
  linksToUsers: defineTable({
    userId: v.id("users"),
    linkId: v.id("links"),
  }).index("by_userId", ["userId"])
  .index("by_linkId",["linkId"]),
});
