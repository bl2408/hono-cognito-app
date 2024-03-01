import {
	AuthFlowType,
	ConfirmSignUpCommand,
	InitiateAuthCommand,
	RevokeTokenCommand,
	SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { poolData } from "./config";
import { getSecretHash } from "./utils";
import { Username } from "../valibot/schema-login";

export const commandSignUp = ({
	username,
	password,
}: {
	username: Username;
	password: string;
}) =>
	new SignUpCommand({
		ClientId: poolData.appClientId,
		Username: username,
		Password: password,
		SecretHash: getSecretHash(username),
		UserAttributes: [{ Name: "email", Value: username }],
	});

export const commandConfirmSignup = ({
	username,
	code,
}: {
	username: Username;
	code: string;
}) =>
	new ConfirmSignUpCommand({
		ClientId: poolData.appClientId,
		ConfirmationCode: code,
		Username: username,
		SecretHash: getSecretHash(username),
	});

export const commandLogin = ({
	username,
	password,
}: {
	username: Username;
	password: string;
}) =>
	new InitiateAuthCommand({
		AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
		ClientId: poolData.appClientId,
		AuthParameters: {
			USERNAME: username,
			PASSWORD: password,
			SECRET_HASH: getSecretHash(username),
		},
	});
export const commandRefreshToken = ({
	sub,
	refreshToken,
}: {
	sub: string;
	refreshToken: string;
}) =>
	new InitiateAuthCommand({
		AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
		ClientId: poolData.appClientId,
		AuthParameters: {
			REFRESH_TOKEN: refreshToken,
			SECRET_HASH: getSecretHash(sub),
		},
	});

export const commandRevokeToken = ({ token }: { token: string }) =>
	new RevokeTokenCommand({
		Token: token,
		ClientId: poolData.appClientId,
		ClientSecret: poolData.appClientSecret,
	});
