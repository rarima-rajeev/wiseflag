"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { POSTHOG_HOST, POSTHOG_KEY, analyticsEnabled } from "@/lib/analytics";

// Anonymous product analytics: page views, clicks and a few named events.
// No person profiles, no session recordings, and Do Not Track is respected.
export default function PostHogInit() {
  useEffect(() => {
    if (!analyticsEnabled() || posthog.__loaded) return;
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: "history_change",
      capture_pageleave: true,
      person_profiles: "identified_only",
      disable_session_recording: true,
      respect_dnt: true,
    });
  }, []);
  return null;
}
