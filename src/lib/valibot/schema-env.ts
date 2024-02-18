import { Output, ValiError, object, parse, string } from "valibot";

const envSchema = object({
	PORT: string(),
});

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Output<typeof envSchema> {}
	}
}

try {
	parse(envSchema, process.env);
} catch (error) {
	if (error instanceof ValiError) {
		console.log("Env Schema Error");
		console.log(error.issues);
	}
	process.exit(1);
}
