"use client";

import { Menu } from "@prisma/client";

interface MenuWithCuisines extends Menu {
  cuisines: { id: number; name: string }[];
  uniqueKey: string;
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
    <div className="border rounded-lg overflow-hidden">
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
  );
}
