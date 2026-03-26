/**
 * Formats a 12-digit phone number (e.g., +420765432111) into a more readable format.
 * @param phone A 12-digit phone number string starting with '+'.
 */
export function formatPhoneNumber(phone: string): string {
	if (!phone || phone.length < 12) return phone;
	return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9, 12)}`;
}

/**
 * Validates a Czech phone number (9 digits).
 * @param phone A 9-digit string.
 */
export function isValidCzechPhone(phone: string): boolean {
	return /^[0-9]{9}$/.test(phone);
}
