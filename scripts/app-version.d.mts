// Types for the build-time version resolver, so the unit test can import it.
export function formatVersionDate(iso: string): string | null;
export function isVersionString(value: unknown): boolean;
export function lastCommitIso(): string | null;
export function resolveAppVersion(options?: { env?: Record<string, string | undefined>; gitIso?: string | null }): string;
