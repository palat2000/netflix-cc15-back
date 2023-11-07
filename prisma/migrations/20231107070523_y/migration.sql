-- CreateTable
CREATE TABLE `ActorMovie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `actorsId` INTEGER NULL,
    `movieId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActorMovie` ADD CONSTRAINT `ActorMovie_actorsId_fkey` FOREIGN KEY (`actorsId`) REFERENCES `Actors`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActorMovie` ADD CONSTRAINT `ActorMovie_movieId_fkey` FOREIGN KEY (`movieId`) REFERENCES `Movie`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
