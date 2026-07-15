-- Subscription plan + auth security tables

CREATE TYPE "SubscriptionPlan" AS ENUM ('SOLO', 'TEAM', 'PRO');

ALTER TABLE "companies" ADD COLUMN "plan" "SubscriptionPlan" NOT NULL DEFAULT 'SOLO';
ALTER TABLE "companies" ADD COLUMN "stripe_customer_id" TEXT;
ALTER TABLE "companies" ADD COLUMN "stripe_subscription_id" TEXT;
ALTER TABLE "companies" ADD COLUMN "subscription_status" TEXT NOT NULL DEFAULT 'trialing';

CREATE TABLE "password_reset_tokens" (
    "id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "password_reset_tokens_company_id_idx" ON "password_reset_tokens"("company_id");
CREATE INDEX "password_reset_tokens_token_hash_idx" ON "password_reset_tokens"("token_hash");

ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ip" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "login_attempts_email_created_at_idx" ON "login_attempts"("email", "created_at");