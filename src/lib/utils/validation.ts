/**
 * Validates a username (1-15 characters, alphanumeric, spaces, dots, dashes).
 * @param name The username to validate.
 */
export function isValidUsername(name: string): boolean {
	return /^[a-zA-Z0-9 _.-]{1,15}$/.test(name);
}
