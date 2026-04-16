/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DELETED', 'DISABLED', 'LOCKED', 'PENDING');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED');

-- CreateTable
CREATE TABLE "user_profile" (
    "id" SERIAL NOT NULL,
    "nickname" TEXT,
    "avatar_url" TEXT,
    "birthday" DATE,
    "gender" "Gender" NOT NULL DEFAULT 'UNSPECIFIED',
    "bio" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_sign_in_at" TIMESTAMP(3),
ADD COLUMN     "last_sign_in_ip" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profile_id" INTEGER,
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "username" TEXT;

-- BackfillProfile
ALTER TABLE "user_profile" ADD COLUMN     "legacy_user_id" INTEGER;

INSERT INTO "user_profile" (
    "nickname",
    "avatar_url",
    "birthday",
    "gender",
    "bio",
    "country",
    "city",
    "address",
    "created_at",
    "updated_at",
    "legacy_user_id"
)
SELECT
    NULL,
    NULL,
    NULL,
    'UNSPECIFIED'::"Gender",
    NULL,
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    "id"
FROM "users";

UPDATE "users"
SET "profile_id" = "user_profile"."id"
FROM "user_profile"
WHERE "user_profile"."legacy_user_id" = "users"."id";

ALTER TABLE "users" ALTER COLUMN "profile_id" SET NOT NULL;

ALTER TABLE "user_profile" DROP COLUMN "legacy_user_id";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_profile_id_key" ON "users"("profile_id");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "user_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
