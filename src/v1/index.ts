import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.json({ message: "Hello Honoo!" });
});

export default app;
