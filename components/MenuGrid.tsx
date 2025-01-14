"use client";

import { Menu } from "@prisma/client";
import MenuCard from "./MenuCard";

interface MenuWithCuisines extends Menu {
  cuisines: { id: number; name: string }[];
  uniqueKey: string;
}

interface MenuGridProps {
  menus: MenuWithCuisines[];
  guestCount: number;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-4" />
        <div className="flex justify-between items-center">
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-1" />
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MenuGrid({
  menus,
  guestCount,
  hasMore,
  isLoading,
  onLoadMore,
}: MenuGridProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <MenuCard key={menu.uniqueKey} menu={menu} guestCount={guestCount} />
        ))}
        {isLoading && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}
      </div>

      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="border border-slate-900 text-slate-900 px-6 py-2 rounded-full"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
