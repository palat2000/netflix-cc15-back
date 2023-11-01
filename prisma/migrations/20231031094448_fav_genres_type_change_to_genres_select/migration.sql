/*
  Warnings:

  - You are about to alter the column `favoriteGenres` on the `UserProfile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Movie` ADD COLUMN `trailer` VARCHAR(191) NULL,
    MODIFY `enumGenres` ENUM('COMEDIES', 'ACTION', 'HORROR', 'SPORTS', 'KID', 'ROMANCE') NULL DEFAULT 'ACTION';

-- AlterTable
ALTER TABLE `UserProfile` MODIFY `favoriteGenres` ENUM('COMEDIES', 'ACTION', 'HORROR', 'SPORTS', 'KID', 'ROMANCE') NULL;
