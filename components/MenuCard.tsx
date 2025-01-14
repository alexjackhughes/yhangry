"use client";

import { Menu } from "@prisma/client";

interface MenuWithCuisines extends Menu {
  cuisines: { id: number; name: string }[];
}

interface MenuCardProps {
  menu: MenuWithCuisines;
  guestCount: number;
}

export default function MenuCard({ menu, guestCount }: MenuCardProps) {
  const calculateTotalPrice = (pricePerPerson: number, minSpend: number) => {
    const total = pricePerPerson * guestCount;
    return Math.max(total, minSpend);
  };

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden group transition-all duration-300">
      <div className="overflow-hidden h-48">
        <img
          src={menu.thumbnail}
          alt={menu.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-125"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-xl mb-1">{menu.name}</h3>
        <p className="text-gray-600 mb-4">
          {menu.description && menu.description.length > 50
            ? `${menu.description.slice(0, 50)}...`
            : menu.description || ""}
        </p>
        <div className="flex justify-between items-center border-t border-slate-200 pt-4">
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
  );
}
