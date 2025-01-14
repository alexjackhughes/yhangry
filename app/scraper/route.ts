import { createMenus } from "@/utils/db";
import { fetchAllData } from "@/utils/scrape";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const endpoint = "https://staging.yhangry.com/booking/test/set-menus";
    const data = await fetchAllData(endpoint);

    // Here we format and save the data to the database
    await createMenus(data);

    // Send response
    return NextResponse.json({ code: 200, status: "success" });
  } catch (error) {
    return NextResponse.json({ code: 500, status: "error", error: error });
  }
}
