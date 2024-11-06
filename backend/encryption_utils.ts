import bcrypt from "bcrypt";
import crypto from 'crypto'

const saltRounds = 10;
const iv = "I02y9ZV0nv1h80h91EXJVg==";
const invitationCipherPrivateKey = "/PzEvpLIONi54y3B73qkyBZhJtcOSRsQ6LZm1P+wUkY=";

export async function hashPassword(plaintextPassword: string) {
    return await bcrypt.hash(plaintextPassword, saltRounds);
}

export async function doPasswordsMatch(plaintextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
}

export function encryptInvitationInfo(invitationId: string) {
    let cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(invitationCipherPrivateKey, "base64"), Buffer.from(iv, "base64"));
    let invitationCipher = cipher.update(invitationId, "utf8", "base64");
    invitationCipher += cipher.final("base64");
    return invitationCipher;
}

export function decryptInvitationInfo(invitationCipher: string) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(invitationCipherPrivateKey, "base64"), Buffer.from(iv, "base64"));
    return decipher.update(invitationCipher, "base64", "utf8");
}