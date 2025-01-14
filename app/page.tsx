"use client";

import { useCallback, useEffect, useState } from "react";
import { Menu } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

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
          ? `/set-menus/${selectedCuisine}?page=${currentPage}`
          : `/set-menus/all?page=${currentPage}`;

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
    [selectedCuisine, page]
  );

  useEffect(() => {
    fetchMenus(true);
  }, [selectedCuisine]);

  useEffect(() => {
    updateURL(selectedCuisine, guestCount);
  }, [selectedCuisine, guestCount, updateURL]);

  const calculateTotalPrice = (pricePerPerson: number, minSpend: number) => {
    const total = pricePerPerson * guestCount;
    return Math.max(total, minSpend);
  };

  const handleCuisineSelect = (cuisineName: string) => {
    const newCuisine =
      selectedCuisine === cuisineName.toLowerCase()
        ? ""
        : cuisineName.toLowerCase();
    setSelectedCuisine(newCuisine);
    setPage(1);
  };

  const handleGuestCountChange = (value: number) => {
    const newCount = Math.max(1, value);
    setGuestCount(newCount);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <label htmlFor="guests" className="block text-sm font-medium mb-2">
          Number of Guests
        </label>
        <input
          type="number"
          id="guests"
          min="1"
          value={guestCount}
          onChange={(e) =>
            handleGuestCountChange(parseInt(e.target.value) || 1)
          }
          className="border rounded px-3 py-2 w-full max-w-xs"
        />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Cuisines</h2>
          {selectedCuisine && (
            <button
              onClick={() => handleCuisineSelect(selectedCuisine)}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine.id}
              onClick={() => handleCuisineSelect(cuisine.name)}
              className={`px-4 py-2 rounded-full ${
                selectedCuisine === cuisine.name.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {cuisine.name} ({cuisine.liveMenuCount})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <div
            key={menu.uniqueKey}
            className="border rounded-lg overflow-hidden"
          >
            <img
              src={menu.thumbnail}
              alt={menu.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{menu.name}</h3>
              <p className="text-gray-600 mb-4">{menu.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Price per person</p>
                  <p className="font-semibold">£{menu.pricePerPerson}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Total for {guestCount} guests
                  </p>
                  <p className="font-semibold">
                    £{calculateTotalPrice(menu.pricePerPerson, menu.minSpend)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchMenus()}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </main>
  );
}
