import {
	InitiateAuthCommand,
	AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, poolData } from "./config";
import { getSecretHash, tryCommand } from "./utils";

export const refreshToken = async ({
	sub,
	refreshToken,
}: {
	sub: string;
	refreshToken: string;
}) => {
	const command = new InitiateAuthCommand({
		AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
		ClientId: poolData.appClientId,
		AuthParameters: {
			REFRESH_TOKEN: refreshToken,
			SECRET_HASH: getSecretHash(sub),
		},
	});

	return tryCommand(() => cognitoClient.send(command));
};
