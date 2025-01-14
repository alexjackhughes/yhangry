-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "priceIncludes" TEXT,
    "highlight" TEXT,
    "displayText" BOOLEAN NOT NULL,
    "isVegan" BOOLEAN NOT NULL,
    "isVegetarian" BOOLEAN NOT NULL,
    "status" BOOLEAN NOT NULL,
    "isSeated" BOOLEAN NOT NULL,
    "isStanding" BOOLEAN NOT NULL,
    "isCanape" BOOLEAN NOT NULL,
    "isMixedDietary" BOOLEAN NOT NULL,
    "isMealPrep" BOOLEAN NOT NULL,
    "isHalal" BOOLEAN NOT NULL,
    "isKosher" BOOLEAN NOT NULL,
    "available" BOOLEAN NOT NULL,
    "numberOfOrders" INTEGER NOT NULL,
    "pricePerPerson" INTEGER NOT NULL,
    "minSpend" INTEGER NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cuisines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "cuisines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" SERIAL NOT NULL,
    "dishesCount" INTEGER NOT NULL,
    "selectableDishesCount" INTEGER NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "group_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuCuisines" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MenuCuisines_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GroupMenu" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GroupMenu_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MenuCuisines_B_index" ON "_MenuCuisines"("B");

-- CreateIndex
CREATE INDEX "_GroupMenu_B_index" ON "_GroupMenu"("B");

-- AddForeignKey
ALTER TABLE "group_items" ADD CONSTRAINT "group_items_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuCuisines" ADD CONSTRAINT "_MenuCuisines_A_fkey" FOREIGN KEY ("A") REFERENCES "cuisines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuCuisines" ADD CONSTRAINT "_MenuCuisines_B_fkey" FOREIGN KEY ("B") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMenu" ADD CONSTRAINT "_GroupMenu_A_fkey" FOREIGN KEY ("A") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupMenu" ADD CONSTRAINT "_GroupMenu_B_fkey" FOREIGN KEY ("B") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
