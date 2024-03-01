import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
export const poolData = {
	userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
	appClientId: process.env.AWS_COGNITO_CLIENT_ID,
	appClientSecret: process.env.AWS_COGNITO_CLIENT_SECRET,
};

export const awsIDPIssuer = `https://cognito-idp.${process.env.AWS_COGNITO_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`;

export const cognitoClient = new CognitoIdentityProviderClient({
	// credentials: {
	// 	accessKeyId: process.env.AWS_ACCESS_KEY,
	// 	secretAccessKey: process.env.AWS_SECRET_KEY,
	// },
	// forcePathStyle: false,
	region: process.env.AWS_COGNITO_REGION,
});
