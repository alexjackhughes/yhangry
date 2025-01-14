"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CuisineFilter {
  id: number;
  name: string;
  liveMenuCount: number;
}

interface CuisineFiltersProps {
  cuisines: CuisineFilter[];
  selectedCuisine: string;
}

export default function CuisineFilters({
  cuisines,
  selectedCuisine,
}: CuisineFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCuisineSelect = (cuisineName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const newCuisine =
      selectedCuisine === cuisineName.toLowerCase()
        ? ""
        : cuisineName.toLowerCase();

    if (newCuisine) {
      params.set("cuisine", newCuisine);
    } else {
      params.delete("cuisine");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Cuisines</h2>
        {selectedCuisine && (
          <button
            onClick={() => handleCuisineSelect(selectedCuisine)}
            className="text-sm text-slate-900"
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
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-200 border border-slate-900 text-slate-900"
            }`}
          >
            {cuisine.name} ({cuisine.liveMenuCount})
          </button>
        ))}
      </div>
    </div>
  );
}
