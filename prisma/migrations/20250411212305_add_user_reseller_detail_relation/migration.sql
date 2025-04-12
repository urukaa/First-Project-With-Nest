-- CreateTable
CREATE TABLE `Reseller` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `phone` VARCHAR(15) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPT', 'DECLINE') NOT NULL DEFAULT 'PENDING',
    `user_id` INTEGER NOT NULL,

    UNIQUE INDEX `Reseller_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reseller` ADD CONSTRAINT `Reseller_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
