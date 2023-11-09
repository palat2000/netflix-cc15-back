/*
  Warnings:

  - You are about to alter the column `releaseDateForNetflix` on the `Movie` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `History` ADD COLUMN `latestWatchingAt` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Movie` MODIFY `releaseDateForNetflix` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `LikeMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userProfileId` INTEGER NULL,
    `movieId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `LikeMovie` ADD CONSTRAINT `LikeMovie_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeMovie` ADD CONSTRAINT `LikeMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
