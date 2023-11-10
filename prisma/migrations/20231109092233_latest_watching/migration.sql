/*
  Warnings:

  - You are about to alter the column `latestWatchingAt` on the `History` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `History` MODIFY `latestWatchingAt` DATETIME(3) NULL;
