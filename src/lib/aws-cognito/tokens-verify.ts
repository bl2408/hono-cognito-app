// import { CognitoJwtVerifier } from "aws-jwt-verify";
import { JwtRsaVerifier } from "aws-jwt-verify";
import { validateCognitoJwtFields } from "aws-jwt-verify/cognito-verifier";
import { awsIDPIssuer } from "./config";

const verifier = JwtRsaVerifier.create([
	{
		issuer: awsIDPIssuer, // set this to the expected "iss" claim on your JWTs
		jwksUri: `${awsIDPIssuer}/.well-known/jwks.json`, // set this to the JWKS uri from your OpenID configuration
		audience: null, // audience (~clientId) is checked instead, by the Cognito specific checks below
		// scope: ["aws.cognito.signin.user.admin"],
		customJwtCheck: ({ payload }) =>
			validateCognitoJwtFields(payload, {
				tokenUse: null, // set to "id" or "access" (or null if both are fine)
				clientId: process.env.AWS_COGNITO_CLIENT_ID, // provide the client id, or an array of client ids (or null if you do not want to check client id)
				// groups: ["admin", "others"], // optional, provide a group name, or array of group names
			}),
	},
]);

export const verifyToken = async (token: string) => {
	try {
		const payload = await verifier.verify(token);
		const currentTime = Math.floor(new Date().getTime() / 1000);
		console.log(
			payload.exp,
			currentTime,
			payload.exp && Number(payload.exp) ? payload.exp - currentTime : 0
		);

		// if (
		// 	payload.exp &&
		// 	Number(payload.exp) &&
		// 	// 1500secs = 25mins
		// 	payload.exp - currentTime < 1500
		// ) {

		// }

		return { payload };
	} catch {
		console.log("Token not valid");
		return { payload: null };
	}
};
