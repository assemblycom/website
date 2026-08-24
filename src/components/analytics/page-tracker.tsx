"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function PageTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    // The Segment snippet fires analytics.page() on initial load, so skip
    // the first render to avoid a duplicate.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    window.analytics?.page();
  }, [pathname, searchParams]);

  return null;
}

export function PageTracker() {
  return (
    <Suspense>
      <PageTrackerInner />
    </Suspense>
  );
}
