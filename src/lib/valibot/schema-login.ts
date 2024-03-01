import { Output, email, minLength, string } from "valibot";

export const usernameSchema = string([minLength(1), email()]);
export const passwordSchema = string([minLength(1), minLength(8)]);
export const mfaCodeSchema = string([minLength(1)]);

export type Username = Output<typeof usernameSchema>;
export type Password = Output<typeof passwordSchema>;
export type MFACode = Output<typeof mfaCodeSchema>;
