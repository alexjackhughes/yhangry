"use client";

interface GuestCountProps {
  guestCount: number;
  onGuestCountChange: (value: number) => void;
}

export default function GuestCount({
  guestCount,
  onGuestCountChange,
}: GuestCountProps) {
  const increment = () => {
    const newCount = Math.min(99, guestCount + 1);
    onGuestCountChange(newCount);
  };

  const decrement = () => {
    const newCount = Math.max(1, guestCount - 1);
    onGuestCountChange(newCount);
  };

  return (
    <div className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold">Number of Guests</h2>
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
        <span className="text-gray-600">Guests</span>
      </div>
    </div>
  );
}
