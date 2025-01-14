"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

interface GuestCountProps {
  initialGuestCount: number;
}

export default function GuestCount({ initialGuestCount }: GuestCountProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [guestCount, setGuestCount] = useState(initialGuestCount);

  // Debounced function to update URL
  const debouncedUpdateURL = useCallback(
    debounce((count: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (count > 1) {
        params.set("guests", count.toString());
      } else {
        params.delete("guests");
      }
      router.push(`?${params.toString()}`);
    }, 500),
    [searchParams, router]
  );

  // Update URL when guest count changes
  useEffect(() => {
    debouncedUpdateURL(guestCount);
    return () => debouncedUpdateURL.cancel();
  }, [guestCount, debouncedUpdateURL]);

  const increment = () => {
    setGuestCount((prev) => Math.min(99, prev + 1));
  };

  const decrement = () => {
    setGuestCount((prev) => Math.max(1, prev - 1));
  };

  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold select-none">Number of Guests</h2>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
          <button
            className="h-8 w-8 rounded-full hover:bg-gray-200"
            onClick={decrement}
            disabled={guestCount <= 1}
          >
            <span className="sr-only">Decrease guests</span>-
          </button>
          <div className="w-10 text-center tabular-nums">{guestCount}</div>
          <button
            className="h-8 w-8 rounded-full hover:bg-gray-200"
            onClick={increment}
            disabled={guestCount >= 99}
          >
            <span className="sr-only">Increase guests</span>+
          </button>
        </div>
        <span className="text-gray-600 select-none">Guests</span>
      </div>
    </div>
  );
}
