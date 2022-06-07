import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function encryptPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
	plain: string,
	hash: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(plain, hash);
	} catch (error) {
		return false;
	}
}
