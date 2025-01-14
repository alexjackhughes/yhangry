import prisma from "@/prisma/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { cuisineSlug: string } }
) {
  const { searchParams } = new URL(req.url);

  // Parse query parameters with default values
  const cuisineSlug = params.cuisineSlug;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    // Fetch filtered menus
    const menus = await prisma.menu.findMany({
      where: {
        status: true, // Only live menus
        ...(cuisineSlug && {
          cuisines: {
            some: {
              name: {
                equals: cuisineSlug,
                mode: "insensitive", // Ensures case-insensitive comparison
              },
            },
          },
        }),
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
        ...(cuisineSlug && {
          cuisines: {
            some: {
              name: {
                equals: cuisineSlug,
                mode: "insensitive", // Ensures case-insensitive comparison
              },
            },
          },
        }),
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
    return NextResponse.json({
      code: 500,
      status: "error",
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
