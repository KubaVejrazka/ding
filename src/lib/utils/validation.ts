// Validates a username (1-15 characters, alphanumeric, spaces, dots, dashes).
export function isValidUsername(name: string): boolean {
  return /^[a-zA-Z0-9 _.-]{1,15}$/.test(name);
}
