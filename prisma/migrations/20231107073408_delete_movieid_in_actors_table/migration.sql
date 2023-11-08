/*
  Warnings:

  - You are about to drop the column `movieId` on the `Actors` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Actors` DROP FOREIGN KEY `Actors_movieId_fkey`;

-- AlterTable
ALTER TABLE `Actors` DROP COLUMN `movieId`;
