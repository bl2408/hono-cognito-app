import { RevokeTokenCommand } from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, poolData } from "./config";
import { tryCommand } from "./utils";

export const revokeToken = async ({ token }: { token: string }) => {
	const command = new RevokeTokenCommand({
		Token: token,
		ClientId: poolData.appClientId,
		ClientSecret: poolData.appClientSecret,
	});

	return tryCommand(() => cognitoClient.send(command));
};
