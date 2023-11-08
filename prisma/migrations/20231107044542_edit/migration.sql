/*
  Warnings:

  - You are about to drop the column `enumGenres` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `movieId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `History` DROP FOREIGN KEY `History_movieId_fkey`;

-- AlterTable
ALTER TABLE `History` DROP COLUMN `enumGenres`,
    DROP COLUMN `movieId`,
    ADD COLUMN `recentWatching` VARCHAR(191) NULL,
    ADD COLUMN `videoId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `customerId`;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `Video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
