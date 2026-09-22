/// <reference types="astro/client" />

declare global {
	interface Window {
		/** GTM/GA4 testbed data layer. Every tracked interaction pushes here. */
		dataLayer: Record<string, unknown>[];
	}
}

export {};
