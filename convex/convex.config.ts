import { ComponentDefinition, defineApp } from "convex/server";
import ratelimiter from "@convex-dev/ratelimiter/convex.config";
import crons from "@convex-dev/crons/convex.config";

const app = defineApp();
app.use(ratelimiter)
app.use(crons as ComponentDefinition<any>)
export default app;