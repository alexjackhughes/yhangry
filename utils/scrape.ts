import axios from "axios";
import { ScrapedMenu } from "../models/ScrapedModels";
import { createMenus } from "./db";

interface ApiResponse {
  data: any[];
  links: {
    next: string | null;
  };
}

export async function fetchAllData(endpoint: string): Promise<ScrapedMenu[]> {
  let allData: ScrapedMenu[] = [];
  let nextPage: string | null = endpoint;

  try {
    while (nextPage) {
      const response = await axios.get<ApiResponse>(nextPage);
      const responseData: ApiResponse = response.data;

      // Add delay between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Append current page data to allData
      allData = allData.concat(responseData.data);

      // Update nextPage to the next URL, if available
      nextPage = responseData.links.next;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }

  return allData;
}
