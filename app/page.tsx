import { Suspense } from "react";
import { Menu } from "@prisma/client";
import GuestCount from "../components/GuestCount";
import CuisineFilters from "../components/CuisineFilters";
import MenuGrid from "../components/MenuGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";

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

export default async function Home({
  searchParams,
}: {
  searchParams: { cuisine?: string; guests?: string; page?: string };
}) {
  // Ensure searchParams is ready before accessing
  const params = await Promise.resolve(searchParams);
  const selectedCuisine = params.cuisine?.toLowerCase() || "";
  const guestCount = parseInt(params.guests || "1");
  const currentPage = parseInt(params.page || "1");

  // Fetch all pages up to the current page
  const allData: MenuWithCuisines[] = [];
  let cuisines: CuisineFilter[] = [];
  let meta: MenuResponse["meta"] | null = null;

  for (let page = 1; page <= currentPage; page++) {
    const url = selectedCuisine
      ? `${process.env.NEXT_PUBLIC_API_URL}/set-menus/${selectedCuisine}?page=${page}&guests=${guestCount}`
      : `${process.env.NEXT_PUBLIC_API_URL}/set-menus/all?page=${page}&guests=${guestCount}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menus: ${response.statusText}`);
    }

    const pageData: MenuResponse = await response.json();
    allData.push(...pageData.data);

    // Keep the latest cuisines and meta data
    cuisines = pageData.cuisines;
    meta = pageData.meta;
  }

  const initialData: MenuResponse = {
    data: allData,
    cuisines,
    meta: {
      ...meta!,
      page: currentPage,
    },
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <GuestCount initialGuestCount={guestCount} />
      <CuisineFilters
        cuisines={initialData.cuisines}
        selectedCuisine={selectedCuisine}
      />
      <Suspense fallback={<LoadingSkeleton />}>
        <MenuGrid
          initialData={initialData}
          guestCount={guestCount}
          selectedCuisine={selectedCuisine}
        />
      </Suspense>
    </main>
  );
}
