"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface GuestCountProps {
  initialGuestCount: number;
}

export default function GuestCount({ initialGuestCount }: GuestCountProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateGuestCount = (newCount: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCount > 1) {
      params.set("guests", newCount.toString());
    } else {
      params.delete("guests");
    }
    router.push(`?${params.toString()}`);
  };

  const increment = () => {
    const newCount = Math.min(99, initialGuestCount + 1);
    updateGuestCount(newCount);
  };

  const decrement = () => {
    const newCount = Math.max(1, initialGuestCount - 1);
    updateGuestCount(newCount);
  };

  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold select-none">Number of Guests</h2>
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full bg-gray-100 p-1">
          <button
            className="h-8 w-8 rounded-full hover:bg-gray-200"
            onClick={decrement}
            disabled={initialGuestCount <= 1}
          >
            <span className="sr-only">Decrease guests</span>-
          </button>
          <div className="w-10 text-center tabular-nums">
            {initialGuestCount}
          </div>
          <button
            className="h-8 w-8 rounded-full hover:bg-gray-200"
            onClick={increment}
            disabled={initialGuestCount >= 99}
          >
            <span className="sr-only">Increase guests</span>+
          </button>
        </div>
        <span className="text-gray-600 select-none">Guests</span>
      </div>
    </div>
  );
}
