interface SegmentAnalytics {
  page: (...args: unknown[]) => void;
  track: (event: string, properties?: Record<string, unknown>) => void;
  identify: (traits?: Record<string, unknown>) => void;
  [key: string]: unknown;
}

interface Window {
  analytics?: SegmentAnalytics;
  dataLayer?: Record<string, unknown>[];
}
