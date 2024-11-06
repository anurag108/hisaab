import bcrypt from "bcrypt";
const saltRounds = 10;

export async function hashPassword(plaintextPassword: string) {
    return await bcrypt.hash(plaintextPassword, saltRounds);
}

export async function doPasswordsMatch(plaintextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plaintextPassword, hashedPassword);
}