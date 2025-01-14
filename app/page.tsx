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
  searchParams: { cuisine?: string; guests?: string };
}) {
  const selectedCuisine = searchParams.cuisine?.toLowerCase() || "";
  const guestCount = parseInt(searchParams.guests || "1");

  // Construct the URL using search params with absolute path
  const url = selectedCuisine
    ? `${process.env.NEXT_PUBLIC_API_URL}/set-menus/${selectedCuisine}?page=1&guests=${guestCount}`
    : `${process.env.NEXT_PUBLIC_API_URL}/set-menus/all?page=1&guests=${guestCount}`;

  const response = await fetch(url, {
    // Ensure we're getting fresh data
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch menus: ${response.statusText}`);
  }

  const initialData: MenuResponse = await response.json();

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
