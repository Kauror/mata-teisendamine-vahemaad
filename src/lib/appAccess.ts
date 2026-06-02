export const APP_ACCESS_COOKIE = 'app_access';
export const APP_ACCESS_PIN = '6412';
export const APP_ACCESS_TOKEN = 'app_access_granted_v1';

export function isValidAppAccessPin(pin: string) {
  return pin.trim() === APP_ACCESS_PIN;
}

export function hasValidAppAccessToken(token?: string | null) {
  return token === APP_ACCESS_TOKEN;
}
