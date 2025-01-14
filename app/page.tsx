"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import GuestCount from "../components/GuestCount";
import CuisineFilters from "../components/CuisineFilters";
import MenuGrid from "../components/MenuGrid";

interface CuisineFilter {
  id: number;
  name: string;
  liveMenuCount: number;
}

interface MenuWithCuisines extends Menu {
  cuisines: { id: number; name: string }[];
}

interface MenuResponse {
  data: MenuWithCuisines[];
  cuisines: CuisineFilter[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCuisine, setSelectedCuisine] = useState<string>(
    searchParams.get("cuisine")?.toLowerCase() || ""
  );
  const [guestCount, setGuestCount] = useState<number>(
    parseInt(searchParams.get("guests") || "1")
  );
  const [menus, setMenus] = useState<
    (MenuWithCuisines & { uniqueKey: string })[]
  >([]);
  const [cuisines, setCuisines] = useState<CuisineFilter[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const updateURL = useCallback(
    (cuisine: string, guests: number) => {
      const params = new URLSearchParams();
      if (cuisine) params.set("cuisine", cuisine);
      if (guests > 1) params.set("guests", guests.toString());

      const newURL = params.toString() ? `?${params.toString()}` : "/";
      router.push(newURL);
    },
    [router]
  );

  const fetchMenus = useCallback(
    async (reset = false) => {
      try {
        setIsLoading(true);
        const currentPage = reset ? 1 : page;
        const url = selectedCuisine
          ? `/set-menus/${selectedCuisine}?page=${currentPage}&guests=${guestCount}`
          : `/set-menus/all?page=${currentPage}&guests=${guestCount}`;

        const response = await fetch(url);
        const data: MenuResponse = await response.json();

        const menusWithKeys = data.data.map((menu) => ({
          ...menu,
          uniqueKey: `${menu.id}-${currentPage}-${Date.now()}`,
        }));

        setMenus((prev) =>
          reset ? menusWithKeys : [...prev, ...menusWithKeys]
        );
        setCuisines(data.cuisines);
        setHasMore(currentPage * 10 < data.meta.total);

        if (!reset) {
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCuisine, page, guestCount]
  );

  useEffect(() => {
    fetchMenus(true);
  }, [selectedCuisine]);

  useEffect(() => {
    updateURL(selectedCuisine, guestCount);
  }, [selectedCuisine, guestCount, updateURL]);

  const handleCuisineSelect = (cuisineName: string) => {
    const newCuisine =
      selectedCuisine === cuisineName.toLowerCase()
        ? ""
        : cuisineName.toLowerCase();
    setSelectedCuisine(newCuisine);
    setPage(1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <GuestCount guestCount={guestCount} onGuestCountChange={setGuestCount} />
      <CuisineFilters
        cuisines={cuisines}
        selectedCuisine={selectedCuisine}
        onCuisineSelect={handleCuisineSelect}
      />

      <MenuGrid
        menus={menus}
        guestCount={guestCount}
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={() => fetchMenus()}
      />
    </main>
  );
}
