import {
	SignUpCommand,
	ConfirmSignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient, poolData } from "./config";
import { getSecretHash, tryCommand } from "./utils";
import { Username } from "../valibot/schema-login";

export const signUp = async ({
	username,
	password,
}: {
	username: Username;
	password: string;
}) => {
	const command = new SignUpCommand({
		ClientId: poolData.appClientId,
		Username: username,
		Password: password,
		SecretHash: getSecretHash(username),
		UserAttributes: [{ Name: "email", Value: username }],
	});

	return tryCommand(() => cognitoClient.send(command));
};

export const confirmSignup = async ({
	username,
	code,
}: {
	username: Username;
	code: string;
}) => {
	const command = new ConfirmSignUpCommand({
		ClientId: poolData.appClientId,
		ConfirmationCode: code,
		Username: username,
		SecretHash: getSecretHash(username),
	});

	return tryCommand(() => cognitoClient.send(command));
};
