-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('COMPANY', 'SOLO');

-- AlterTable
ALTER TABLE "companies" ADD COLUMN "account_type" "AccountType" NOT NULL DEFAULT 'COMPANY';