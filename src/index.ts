import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import "dotenv/config";
import "./lib/valibot/schema-env";
import v1 from "./v1";

const port = parseInt(process.env.PORT);
const app = new Hono().basePath("/api");

app.use(logger());

app.route("/v1", v1);

console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
