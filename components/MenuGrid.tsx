"use client";

import { Menu } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import MenuCard from "./MenuCard";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    const nextPage = (initialData.meta.page + 1).toString();
    params.set("page", nextPage);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const hasMore =
    initialData.meta.page * initialData.meta.limit < initialData.meta.total;
  const totalMenusShown = initialData.data.length;
  const totalMenus = initialData.meta.total;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialData.data.map((menu) => (
          <MenuCard key={menu.id} menu={menu} guestCount={guestCount} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="border border-slate-900 text-slate-900 px-6 py-2 rounded-full"
          >
            Show More ({totalMenusShown} of {totalMenus})
          </button>
        </div>
      )}
    </>
  );
}
