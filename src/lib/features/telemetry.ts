import { dev } from '$app/env';
import { injectAnalytics, track } from '@vercel/analytics/sveltekit';

export type TelemetryProps = Record<string, string | number | boolean | null | undefined>;

/** Keeps event names stable and lowercase across components. */
export function normalizeEventName(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/[\s-]+/g, '_')
		.replace(/[^a-z0-9_]/g, '')
		.replace(/^_+|_+$/g, '');
}

/** Cookieless page-view analytics, enabled only in production builds. */
export function initTelemetry(): void {
	if (dev) return;
	injectAnalytics({ mode: 'production' });
}

/** Sends a custom event; a no-op during development. */
export function trackEvent(name: string, properties: TelemetryProps = {}): void {
	if (dev) return;
	track(normalizeEventName(name), properties);
}
