/*
  Warnings:

  - Made the column `release_year` on table `Movie` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Movie` MODIFY `release_year` VARCHAR(7) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `customerId` VARCHAR(191) NULL,
    ADD COLUMN `subscriptionId` VARCHAR(191) NULL;
