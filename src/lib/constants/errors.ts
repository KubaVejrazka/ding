export const AUTH_ERRORS: Record<string, string> = {
	INVALID_EMAIL: 'Neplatný email.',
	INVALID_PHONE: 'Neplatné telefonní číslo.',
	INVALID_USERNAME: 'Neplatná přezdívka.',
	INVALID_EMAIL_OR_PASSWORD: 'Špatný email nebo heslo.',
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Uživatel s tímto emailem už existuje.',
	PASSWORD_TOO_SHORT: 'Heslo je moc krátké.',
	FAILED_TO_CREATE_USER:
		'Něco se nepovedlo. Ujistěte se, že toto telefonní číslo ještě není zaregistrované.',
	PASSWORD_MISMATCH: 'Hesla se neshodují.',
	UNKNOWN: 'Něco se nepovedlo :('
};

export function getErrorMessage(code: string | undefined): string {
	if (!code) return '';
	return AUTH_ERRORS[code] || AUTH_ERRORS.UNKNOWN;
}
