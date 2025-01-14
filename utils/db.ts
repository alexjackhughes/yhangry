import { ScrapedMenu } from "@/models/ScrapedModels";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMenus = async (menus: ScrapedMenu[]) => {
  // This doesn't quite work, as the data schema does not quite match

  for (const menu of menus) {
    await prisma.menu.create({
      data: menu,
    });
  }
};
