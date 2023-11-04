-- AlterTable
ALTER TABLE `Video` ADD COLUMN `videoEpisodeNo` INTEGER NOT NULL DEFAULT 1,
    MODIFY `videoEpisodeName` VARCHAR(191) NOT NULL;
