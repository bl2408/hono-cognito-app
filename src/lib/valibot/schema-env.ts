import { Output, ValiError, object, parse, string } from "valibot";

const envSchema = object({
	PORT: string(),
	AWS_COGNITO_REGION: string(),
	AWS_COGNITO_USER_POOL_ID: string(),
	AWS_COGNITO_CLIENT_ID: string(),
	AWS_COGNITO_CLIENT_SECRET: string(),
	AWS_IDP_ISSUER: string(),
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
