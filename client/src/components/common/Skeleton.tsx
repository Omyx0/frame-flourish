import { useEffect, useState } from "react";
import { cn } from "@/utils/utils";

/**
 * Hook to avoid layout flash: only shows skeleton if loading takes longer than delayMs (default 300ms)
 */
export function useDelayedLoading(loading: boolean, delayMs = 300) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setShow(false);
      return;
    }
    const timer = setTimeout(() => {
      setShow(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [loading, delayMs]);

  return show;
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/70 dark:bg-muted/40", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

/**
 * Matches OpportunityRow exact layout to prevent layout jumping
 */
export function OpportunityRowSkeleton() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border px-1 py-5 sm:px-4 lg:grid-cols-[auto_2fr_1fr_1fr_auto_auto]">
      {/* Company logo box */}
      <Skeleton className="size-11 rounded-md border-2 border-border" />

      {/* Main info */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-48 sm:w-64" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2 lg:hidden">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Location / WorkMode (Desktop) */}
      <div className="hidden space-y-2 text-sm lg:block">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Pay / Type (Desktop) */}
      <div className="hidden space-y-2 text-sm lg:block">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Deadline (Desktop) */}
      <div className="hidden w-20 text-right lg:block">
        <Skeleton className="ml-auto h-4 w-14" />
      </div>

      {/* Bookmark button */}
      <Skeleton className="size-9 rounded-md" />
    </div>
  );
}

/**
 * Matches FeaturedCard exact layout on HomePage
 */
export function FeaturedCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-lg bg-card p-3 frame sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="size-8 rounded-md sm:size-11" />
        <Skeleton className="size-7 rounded-md sm:size-9" />
      </div>
      <Skeleton className="mt-2.5 h-3 w-24 sm:mt-5 sm:h-4 sm:w-32" />
      <Skeleton className="mt-2 h-6 w-3/4" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-16 rounded-sm" />
        <Skeleton className="h-5 w-20 rounded-sm" />
      </div>
      <div className="mt-auto flex items-end justify-between pt-6">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="size-5 rounded-sm" />
      </div>
    </div>
  );
}

/**
 * Matches OpportunityDetailsPage layout
 */
export function OpportunityDetailsSkeleton() {
  return (
    <div className="animate-rise pb-28 lg:pb-0" aria-busy="true" aria-label="Loading opportunity details">
      {/* Header banner skeleton */}
      <div className="border-b-2 border-frame bg-card grid-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Skeleton className="h-4 w-24" />
          <div className="mt-6 flex items-start gap-4">
            <Skeleton className="size-14 rounded-md shadow-hard-sm" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-2/3 sm:h-12" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <Skeleton className="hidden size-9 rounded-md sm:grid" />
          </div>
        </div>
      </div>

      {/* Main content grid skeleton */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-md" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-3/4" />
            ))}
          </div>
        </div>
        <aside className="hidden lg:block">
          <div className="rounded-lg bg-card p-6 frame space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
            <Skeleton className="mt-6 h-12 w-full rounded-md" />
          </div>
        </aside>
      </div>
    </div>
  );
}
