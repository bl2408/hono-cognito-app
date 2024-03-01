import { Hono } from "hono";
import {
	commandConfirmSignup,
	commandLogin,
	commandRefreshToken,
	commandRevokeToken,
	commandSignUp,
} from "../lib/aws-cognito/commands";
import { TryCommandType, tryCommand } from "../lib/aws-cognito/utils";
import { verifyToken } from "../lib/aws-cognito/tokens-verify";
import { is, safeParse, string } from "valibot";
import {
	mfaCodeSchema,
	passwordSchema,
	usernameSchema,
} from "../lib/valibot/schema-login";

const app = new Hono();

app.post("/auth/signup", async (c) => {
	const { username, password } = await c.req.parseBody();
	const checkUsername = safeParse(usernameSchema, username);
	const checkPassword = safeParse(passwordSchema, password);
	if (!checkUsername.success || !checkPassword.success) {
		return c.json({ error: "Invalid username or password" });
	}
	const res = await tryCommand(
		commandSignUp({
			username: checkUsername.output,
			password: checkPassword.output,
		}) as TryCommandType
	);
	return c.json(res);
});
app.post("/auth/confirm-signup", async (c) => {
	const { username, code } = await c.req.parseBody();
	const checkUsername = safeParse(usernameSchema, username);
	const checkCode = safeParse(mfaCodeSchema, code);
	if (!checkUsername.success || !checkCode.success) {
		return c.json({ error: "Invalid username or code" });
	}
	const res = await tryCommand(
		commandConfirmSignup({
			username: checkUsername.output,
			code: checkCode.output,
		}) as TryCommandType
	);
	return c.json(res);
});

app.post("/auth/login", async (c) => {
	const { username, password } = await c.req.parseBody();
	const checkUsername = safeParse(usernameSchema, username);
	const checkPassword = safeParse(passwordSchema, password);
	if (!checkUsername.success || !checkPassword.success) {
		return c.json({ error: "Invalid username or password" });
	}
	const res = await tryCommand(
		commandLogin({
			username: checkUsername.output,
			password: checkPassword.output,
		}) as TryCommandType
	);
	return c.json(res);
});

app.post("/auth/refresh", async (c) => {
	const { sub, refreshToken } = await c.req.parseBody();
	if (!is(string(), sub) || !is(string(), refreshToken)) {
		return c.json({ error: "Bad request" });
	}
	const res = await tryCommand(
		commandRefreshToken({ sub, refreshToken }) as TryCommandType
	);
	return c.json(res);
});

app.post("/auth/logout", async (c) => {
	const { token } = await c.req.parseBody();
	if (!is(string(), token)) {
		return c.json({ error: "Bad request" });
	}
	const res = await tryCommand(
		commandRevokeToken({ token }) as TryCommandType
	);
	return c.json(res);
});

app.use(async (c, next) => {
	console.log("MIDDLEWARE");
	const getHeader = c.req.header("Authorization");
	if (!getHeader || getHeader.length < 2) {
		return c.json({ message: "Forbidden" });
	}
	const token = getHeader.split(" ")[1];

	const res = await verifyToken(token);

	if (!res.payload) {
		return c.json({ error: "Token not valid" });
	}
	console.log(res.payload);

	await next();
});
app.get("/", (c) => {
	console.log("SDFSDF");
	return c.json({ message: "protected content" });
});

export default app;
