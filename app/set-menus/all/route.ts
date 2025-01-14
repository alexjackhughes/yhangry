import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

const MAX_PAGE_SIZE = 50;
const MIN_PAGE = 1;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Sanitize and validate pagination parameters
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");

  const page = Math.max(MIN_PAGE, parseInt(rawPage || "1"));
  if (isNaN(page)) {
    return NextResponse.json(
      { status: "error", message: "Invalid page parameter" },
      { status: 400 }
    );
  }

  const limit = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parseInt(rawLimit || "10"))
  );
  if (isNaN(limit)) {
    return NextResponse.json(
      { status: "error", message: "Invalid limit parameter" },
      { status: 400 }
    );
  }

  try {
    // Fetch all menus without cuisine filtering
    const menus = await prisma.menu.findMany({
      where: {
        status: true, // Only live menus
      },
      orderBy: { numberOfOrders: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        cuisines: true,
      },
    });

    // Return 404 if no menus found
    if (menus.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "No menus found",
        },
        { status: 404 }
      );
    }

    // Fetch available cuisines
    const cuisines = await prisma.cuisine.findMany({
      include: {
        menus: {
          where: { status: true },
        },
      },
    });

    // Map cuisines with aggregated data
    const cuisineFilters = cuisines.map((cuisine) => ({
      id: cuisine.id,
      name: cuisine.name,
      numberOfOrders: cuisine.menus.reduce(
        (sum, menu) => sum + menu.numberOfOrders,
        0
      ),
      liveMenuCount: cuisine.menus.filter((menu) => menu.status).length,
    }));

    // Sort cuisines by aggregated number of orders
    cuisineFilters.sort((a, b) => b.numberOfOrders - a.numberOfOrders);

    // Total count for pagination
    const total = await prisma.menu.count({
      where: {
        status: true,
      },
    });

    // Return response
    return NextResponse.json({
      data: menus,
      cuisines: cuisineFilters,
      meta: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        code: 500,
        status: "error",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
