export function emailName(email: string): string {
  return email.split('@')[0];
}
