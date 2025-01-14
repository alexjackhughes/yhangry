import { NextResponse } from "next/server";
import prisma from "@/prisma/db";

export async function GET() {
  try {
    const cuisines = await prisma.cuisine.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            menus: {
              where: {
                available: true,
              },
            },
          },
        },
        menus: {
          where: {
            available: true,
          },
          select: {
            numberOfOrders: true,
          },
        },
      },
    });

    const processedCuisines = cuisines
      .map((cuisine) => ({
        id: cuisine.id,
        name: cuisine.name,
        liveMenuCount: cuisine._count.menus,
        totalOrders: cuisine.menus.reduce(
          (sum, menu) => sum + menu.numberOfOrders,
          0
        ),
      }))
      .filter((cuisine) => cuisine.liveMenuCount > 0)
      .sort((a, b) => b.totalOrders - a.totalOrders);

    return NextResponse.json(processedCuisines);
  } catch (error) {
    console.error("Error fetching cuisine filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cuisine filters" },
      { status: 500 }
    );
  }
}
