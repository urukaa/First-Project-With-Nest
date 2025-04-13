-- CreateTable
CREATE TABLE `LivePlatform` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `coin_type` VARCHAR(20) NOT NULL,
    `price_per_coin` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Talent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `sexs` ENUM('MALE', 'FEMALE') NOT NULL,
    `streaming_id` VARCHAR(100) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `tiktok_username` VARCHAR(100) NOT NULL,
    `instagram_username` VARCHAR(100) NOT NULL,
    `host_location` VARCHAR(100) NOT NULL,
    `smartphone_used` VARCHAR(100) NOT NULL,
    `referred_by` VARCHAR(100) NOT NULL,
    `has_live_experience` VARCHAR(100) NOT NULL,
    `photo_closeup` VARCHAR(255) NOT NULL,
    `photo_fullbody` VARCHAR(255) NOT NULL,
    `photo_idcard` VARCHAR(255) NOT NULL,
    `app_profile_screenshot` VARCHAR(255) NOT NULL,
    `introduction_video` VARCHAR(255) NOT NULL,
    `photo_display` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPT', 'DECLINE') NOT NULL DEFAULT 'PENDING',
    `user_id` INTEGER NOT NULL,
    `live_platform_id` INTEGER NOT NULL,

    UNIQUE INDEX `Talent_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Talent` ADD CONSTRAINT `Talent_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Talent` ADD CONSTRAINT `Talent_live_platform_id_fkey` FOREIGN KEY (`live_platform_id`) REFERENCES `LivePlatform`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
