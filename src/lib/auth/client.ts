'use client';

export function csrfToken(cookieName = 'app_csrf') {
  if (typeof document === 'undefined') return '';
  const prefix = `${encodeURIComponent(cookieName)}=`;
  const part = document.cookie.split(';').map((value) => value.trim()).find((value) => value.startsWith(prefix));
  return part ? decodeURIComponent(part.slice(prefix.length)) : '';
}

export function csrfHeaders(headers: HeadersInit = {}, cookieName = 'app_csrf'): HeadersInit {
  const token = csrfToken(cookieName);
  return token ? { ...Object.fromEntries(new Headers(headers).entries()), 'x-csrf-token': token } : headers;
}
