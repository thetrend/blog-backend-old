/*
  Warnings:

  - A unique constraint covering the columns `[verificationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email,verificationCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `verificationCode` VARCHAR(255) NULL,
    ADD COLUMN `verified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_verificationCode_key` ON `User`(`verificationCode`);

-- CreateIndex
CREATE INDEX `User_email_verificationCode_idx` ON `User`(`email`, `verificationCode`);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_verificationCode_key` ON `User`(`email`, `verificationCode`);
