export interface ScrapedCuisine {
  id: number;
  name: string;
}

export interface ScrapedMenu {
  created_at: string;
  cuisines: ScrapedCuisine[];
  description: string;
  display_text: number;
  image: string;
  thumbnail: string;
  is_vegan: number;
  is_vegetarian: number;
  name: string;
  status: number;
  groups: {
    dishes_count: number;
    selectable_dishes_count: number;
    groups: {
      [key: string]: number;
    };
  };
  price_per_person: number;
  min_spend: number;
  is_seated: number;
  is_standing: number;
  is_canape: number;
  is_mixed_dietary: number;
  is_meal_prep: number;
  is_halal: number;
  is_kosher: number;
  price_includes: string | null;
  highlight: string | null;
  available: boolean;
  number_of_orders: number;
}
