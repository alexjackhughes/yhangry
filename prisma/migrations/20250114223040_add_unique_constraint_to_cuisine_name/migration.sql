/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `cuisines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cuisines_name_key" ON "cuisines"("name");
