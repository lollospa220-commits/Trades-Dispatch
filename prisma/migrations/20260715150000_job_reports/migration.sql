CREATE TABLE "job_reports" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "work_notes" TEXT,
    "signature_data" TEXT,
    "signed_by_name" TEXT,
    "photo_data" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_reports_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "job_reports_job_id_key" ON "job_reports"("job_id");
CREATE INDEX "job_reports_company_id_idx" ON "job_reports"("company_id");

ALTER TABLE "job_reports" ADD CONSTRAINT "job_reports_job_id_fkey"
    FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "job_reports" ADD CONSTRAINT "job_reports_company_id_fkey"
    FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;