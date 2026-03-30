export function formatPhoneNumber(phone: string): string {
  if (!phone || phone.length < 12) return phone;
  return `+${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9, 12)}`;
}

export function isValidCzechPhone(phone: string): boolean {
  return /^[0-9]{9}$/.test(phone);
}
