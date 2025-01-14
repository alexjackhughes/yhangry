import { Prisma } from "@prisma/client";
import { ScrapedMenu } from "../models/ScrapedModels";

export const formatMenu = (menu: ScrapedMenu): Prisma.MenuCreateInput => {
  return {
    name: menu.name,
    description: menu.description,
    image: menu.image,
    thumbnail: menu.thumbnail,
    priceIncludes: menu.price_includes,
    highlight: menu.highlight,
    displayText: toBoolean(menu.display_text),
    isVegan: toBoolean(menu.is_vegan),
    isVegetarian: toBoolean(menu.is_vegetarian),
    status: toBoolean(menu.status),
    isSeated: toBoolean(menu.is_seated),
    isStanding: toBoolean(menu.is_standing),
    isCanape: toBoolean(menu.is_canape),
    isMixedDietary: toBoolean(menu.is_mixed_dietary),
    isMealPrep: toBoolean(menu.is_meal_prep),
    isHalal: toBoolean(menu.is_halal),
    isKosher: toBoolean(menu.is_kosher),
    available: menu.available,
    numberOfOrders: menu.number_of_orders,
    pricePerPerson: menu.price_per_person,
    minSpend: menu.min_spend,
    // Handle relationships
    cuisines: {
      connectOrCreate: menu.cuisines.map((cuisine) => ({
        where: { id: cuisine.id },
        create: { name: cuisine.name },
      })),
    },
    groups: {
      create: [
        {
          dishesCount: menu.groups.dishes_count,
          selectableDishesCount: menu.groups.selectable_dishes_count,
          groupItems: {
            create: Object.entries(menu.groups.groups).map(
              ([name, available]) => ({
                name,
                available: toBoolean(available),
              })
            ),
          },
        },
      ],
    },
  };
};

export const formatMenus = (menus: ScrapedMenu[]): Prisma.MenuCreateInput[] => {
  return menus.map(formatMenu);
};

// Helper to convert 0/1 to boolean
const toBoolean = (value: number): boolean => value === 1;
