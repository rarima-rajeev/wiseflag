"use client";

import posthog from "posthog-js";

// Public project key (safe to ship in client code). US cloud.
export const POSTHOG_KEY = "phc_A7AQUNuHDWgP92hxthbkLJE53fGP2VnVBM3EbGgW9tKy";
export const POSTHOG_HOST = "https://us.i.posthog.com";

// Only the deployed site reports analytics, so local development doesn't pollute the data.
export function analyticsEnabled() {
  return typeof window !== "undefined" && !["localhost", "127.0.0.1"].includes(window.location.hostname);
}

// Fire-and-forget event; a no-op locally or before PostHog has loaded.
export function track(event: string, properties?: Record<string, unknown>) {
  if (analyticsEnabled() && posthog.__loaded) posthog.capture(event, properties);
}
