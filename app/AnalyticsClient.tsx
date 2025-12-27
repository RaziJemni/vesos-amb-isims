"use client";

import { Analytics } from "@vercel/analytics/react"; // remove if not using Vercel analytics

export default function AnalyticsClient() {
  // If you don't use Vercel Analytics, replace the return with `return null;`
  return <Analytics />;
}
