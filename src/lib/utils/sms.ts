/**
 * Sanitizes a string for GSM-compatible SMS broadcasting.
 * Removes diacritics and strips potentially problematic characters.
 */
export function sanitizeForSMS(text: string): string {
	if (!text) return '';

	// Mapping of common Czech diacritics to plain ASCII
	const diacriticsMap: Record<string, string> = {
		á: 'a',
		č: 'c',
		ď: 'd',
		é: 'e',
		ě: 'e',
		í: 'i',
		ň: 'n',
		ó: 'o',
		ř: 'r',
		š: 's',
		ť: 't',
		ú: 'u',
		ů: 'u',
		ý: 'y',
		ž: 'z',
		Á: 'A',
		Č: 'C',
		Ď: 'D',
		É: 'E',
		Ě: 'E',
		Í: 'I',
		Ň: 'N',
		Ó: 'O',
		Ř: 'R',
		Š: 'S',
		Ť: 'T',
		Ú: 'U',
		Ů: 'U',
		Ý: 'Y',
		Ž: 'Z'
	};

	let sanitized = text
		.split('')
		.map((char) => diacriticsMap[char] || char)
		.join('');

	// Strip out non-ASCII or non-GSM characters (optional but safer)
	// Keeps common punctuation and spaces
	sanitized = sanitized.replace(/[^\x20-\x7E\n]/g, '');

	// Limit to standard SMS length if necessary, but we'll let the service handle that
	return sanitized.trim();
}
