import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_featured_promo_inclusions_icon" AS ENUM('plane', 'calendar', 'ticket', 'map-pin');
  CREATE TYPE "public"."enum_featured_promo_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__featured_promo_v_version_inclusions_icon" AS ENUM('plane', 'calendar', 'ticket', 'map-pin');
  CREATE TYPE "public"."enum__featured_promo_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "featured_promo_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum_featured_promo_inclusions_icon"
  );
  
  CREATE TABLE "featured_promo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"destination_id" integer,
  	"ends_at" varchar,
  	"top_bar_text" varchar,
  	"badge_text" varchar,
  	"charter_text" varchar,
  	"title" varchar,
  	"description" varchar,
  	"price" varchar,
  	"price_note" varchar,
  	"tax_note" varchar,
  	"price_valid_until" timestamp(3) with time zone,
  	"image_id" integer,
  	"whatsapp_msg" varchar,
  	"_status" "enum_featured_promo_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_featured_promo_v_version_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"icon" "enum__featured_promo_v_version_inclusions_icon",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_featured_promo_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_enabled" boolean DEFAULT true,
  	"version_destination_id" integer,
  	"version_ends_at" varchar,
  	"version_top_bar_text" varchar,
  	"version_badge_text" varchar,
  	"version_charter_text" varchar,
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_price" varchar,
  	"version_price_note" varchar,
  	"version_tax_note" varchar,
  	"version_price_valid_until" timestamp(3) with time zone,
  	"version_image_id" integer,
  	"version_whatsapp_msg" varchar,
  	"version__status" "enum__featured_promo_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "featured_promo_inclusions" ADD CONSTRAINT "featured_promo_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."featured_promo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "featured_promo" ADD CONSTRAINT "featured_promo_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "featured_promo" ADD CONSTRAINT "featured_promo_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_featured_promo_v_version_inclusions" ADD CONSTRAINT "_featured_promo_v_version_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_featured_promo_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_featured_promo_v" ADD CONSTRAINT "_featured_promo_v_version_destination_id_destinations_id_fk" FOREIGN KEY ("version_destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_featured_promo_v" ADD CONSTRAINT "_featured_promo_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "featured_promo_inclusions_order_idx" ON "featured_promo_inclusions" USING btree ("_order");
  CREATE INDEX "featured_promo_inclusions_parent_id_idx" ON "featured_promo_inclusions" USING btree ("_parent_id");
  CREATE INDEX "featured_promo_destination_idx" ON "featured_promo" USING btree ("destination_id");
  CREATE INDEX "featured_promo_image_idx" ON "featured_promo" USING btree ("image_id");
  CREATE INDEX "featured_promo__status_idx" ON "featured_promo" USING btree ("_status");
  CREATE INDEX "_featured_promo_v_version_inclusions_order_idx" ON "_featured_promo_v_version_inclusions" USING btree ("_order");
  CREATE INDEX "_featured_promo_v_version_inclusions_parent_id_idx" ON "_featured_promo_v_version_inclusions" USING btree ("_parent_id");
  CREATE INDEX "_featured_promo_v_version_version_destination_idx" ON "_featured_promo_v" USING btree ("version_destination_id");
  CREATE INDEX "_featured_promo_v_version_version_image_idx" ON "_featured_promo_v" USING btree ("version_image_id");
  CREATE INDEX "_featured_promo_v_version_version__status_idx" ON "_featured_promo_v" USING btree ("version__status");
  CREATE INDEX "_featured_promo_v_created_at_idx" ON "_featured_promo_v" USING btree ("created_at");
  CREATE INDEX "_featured_promo_v_updated_at_idx" ON "_featured_promo_v" USING btree ("updated_at");
  CREATE INDEX "_featured_promo_v_latest_idx" ON "_featured_promo_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "featured_promo_inclusions" CASCADE;
  DROP TABLE "featured_promo" CASCADE;
  DROP TABLE "_featured_promo_v_version_inclusions" CASCADE;
  DROP TABLE "_featured_promo_v" CASCADE;
  DROP TYPE "public"."enum_featured_promo_inclusions_icon";
  DROP TYPE "public"."enum_featured_promo_status";
  DROP TYPE "public"."enum__featured_promo_v_version_inclusions_icon";
  DROP TYPE "public"."enum__featured_promo_v_version_status";`)
}
