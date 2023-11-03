/*
  Warnings:

  - You are about to drop the column `userAccountId` on the `MyList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `MyList` DROP FOREIGN KEY `MyList_userAccountId_fkey`;

-- AlterTable
ALTER TABLE `MyList` DROP COLUMN `userAccountId`,
    ADD COLUMN `userProfileId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `MyList` ADD CONSTRAINT `MyList_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
