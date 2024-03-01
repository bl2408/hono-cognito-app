import { createHmac } from "crypto";
import { cognitoClient, poolData } from "./config";

export type TryCommandType = Parameters<typeof cognitoClient.send>[0];

export const tryCommand = async (command: TryCommandType) => {
	try {
		const callFn = await cognitoClient.send(command);
		return {
			success: true,
			result: callFn,
		};
	} catch (error) {
		return {
			success: false,
			result: error,
		};
	}
};

export const getSecretHash = (username: string) => {
	const hasher = createHmac("SHA256", poolData.appClientSecret);
	hasher.update(`${username}${poolData.appClientId}`);
	return hasher.digest("base64");
};
