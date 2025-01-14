"use client";

import { Menu } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import LoadingSkeleton from "./LoadingSkeleton";

interface MenuWithCuisines extends Menu {
  cuisines: { id: number; name: string }[];
}

interface MenuResponse {
  data: MenuWithCuisines[];
  cuisines: { id: number; name: string; liveMenuCount: number }[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

interface MenuGridProps {
  initialData: MenuResponse;
  guestCount: number;
  selectedCuisine: string;
}

export default function MenuGrid({
  initialData,
  guestCount,
  selectedCuisine,
}: MenuGridProps) {
  const [menus, setMenus] = useState<MenuWithCuisines[]>(initialData.data);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(page * 10 < initialData.meta.total);

  const fetchMoreMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const url = selectedCuisine
        ? `${baseUrl}/api/set-menus/${selectedCuisine}?page=${nextPage}&guests=${guestCount}`
        : `${baseUrl}/api/set-menus/all?page=${nextPage}&guests=${guestCount}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch more menus: ${response.statusText}`);
      }

      const data: MenuResponse = await response.json();

      setMenus((prev) => [...prev, ...data.data]);
      setPage(nextPage);
      setHasMore(nextPage * 10 < data.meta.total);
    } catch (error) {
      console.error("Error fetching more menus:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedCuisine, guestCount]);

  // Reset when filters change
  useEffect(() => {
    setMenus(initialData.data);
    setPage(1);
    setHasMore(10 < initialData.meta.total);
  }, [initialData]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} guestCount={guestCount} />
        ))}
      </div>

      {isLoading && <LoadingSkeleton />}

      {hasMore && !isLoading && (
        <div className="mt-8 text-center">
          <button
            onClick={fetchMoreMenus}
            className="border border-slate-900 text-slate-900 px-6 py-2 rounded-full"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
