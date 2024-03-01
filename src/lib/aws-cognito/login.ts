import {
	InitiateAuthCommand,
	AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, poolData } from "./config";
import { getSecretHash, tryCommand } from "./utils";
import { Username } from "../valibot/schema-login";

export const login = async ({
	username,
	password,
}: {
	username: Username;
	password: string;
}) => {
	const command = new InitiateAuthCommand({
		AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
		ClientId: poolData.appClientId,
		AuthParameters: {
			USERNAME: username,
			PASSWORD: password,
			SECRET_HASH: getSecretHash(username),
		},
	});

	return tryCommand(() => cognitoClient.send(command));
};
