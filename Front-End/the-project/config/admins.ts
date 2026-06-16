// config/admins.ts
export const ALLOWED_ADMIN_EMAILS = [
  "aethefifthofjuly@gmail.com", 
];

export const SUPER_ADMINS = [
  "aethefifthofjuly@gmail.com", 
];

export function isAllowedAdmin(email: string): boolean {
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

export function isSuperAdmin(email: string): boolean {
  return SUPER_ADMINS.includes(email.toLowerCase().trim());
}