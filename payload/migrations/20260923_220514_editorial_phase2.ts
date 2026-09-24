import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN "name" varchar;
  ALTER TABLE "destinations" ADD COLUMN "pending_approval" boolean DEFAULT false;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_pending_approval" boolean DEFAULT false;
  CREATE INDEX "destinations_pending_approval_idx" ON "destinations" USING btree ("pending_approval");
  CREATE INDEX "_destinations_v_version_version_pending_approval_idx" ON "_destinations_v" USING btree ("version_pending_approval");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "destinations_pending_approval_idx";
  DROP INDEX "_destinations_v_version_version_pending_approval_idx";
  ALTER TABLE "users" DROP COLUMN "name";
  ALTER TABLE "destinations" DROP COLUMN "pending_approval";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_pending_approval";`)
}
