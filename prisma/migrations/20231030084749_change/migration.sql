/*
  Warnings:

  - You are about to drop the column `historyId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the `UserAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userProfileId` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `MyList` DROP FOREIGN KEY `MyList_userAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `UserAccount` DROP FOREIGN KEY `UserAccount_userId_fkey`;

-- AlterTable
ALTER TABLE `History` DROP COLUMN `historyId`,
    ADD COLUMN `userProfileId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `UserAccount`;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profileImageUrl` VARCHAR(191) NULL,
    `userProfileName` VARCHAR(191) NOT NULL,
    `isKid` BOOLEAN NOT NULL DEFAULT false,
    `favoriteGenres` VARCHAR(191) NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MyList` ADD CONSTRAINT `MyList_userAccountId_fkey` FOREIGN KEY (`userAccountId`) REFERENCES `UserProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
