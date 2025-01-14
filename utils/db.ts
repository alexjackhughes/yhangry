import { ScrapedMenu } from "../models/ScrapedModels";
import prisma from "../prisma/db";
import { formatMenus } from "./format";

export const createMenus = async (menus: ScrapedMenu[]) => {
  const formattedMenus = formatMenus(menus);

  for (const formattedMenu of formattedMenus) {
    await prisma.menu.create({
      data: formattedMenu,
    });
  }
};
