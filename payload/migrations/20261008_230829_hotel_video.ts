import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "videos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric
  );
  
  ALTER TABLE "destinations" ADD COLUMN "hotel_video_file_id" integer;
  ALTER TABLE "destinations" ADD COLUMN "hotel_video_poster_id" integer;
  ALTER TABLE "destinations" ADD COLUMN "hotel_video_hotel_name" varchar;
  ALTER TABLE "destinations" ADD COLUMN "hotel_video_caption" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_hotel_video_file_id" integer;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_hotel_video_poster_id" integer;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_hotel_video_hotel_name" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_hotel_video_caption" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "videos_id" integer;
  CREATE INDEX "videos_updated_at_idx" ON "videos" USING btree ("updated_at");
  CREATE INDEX "videos_created_at_idx" ON "videos" USING btree ("created_at");
  CREATE UNIQUE INDEX "videos_filename_idx" ON "videos" USING btree ("filename");
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hotel_video_file_id_videos_id_fk" FOREIGN KEY ("hotel_video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hotel_video_poster_id_media_id_fk" FOREIGN KEY ("hotel_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_version_hotel_video_file_id_videos_id_fk" FOREIGN KEY ("version_hotel_video_file_id") REFERENCES "public"."videos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_version_hotel_video_poster_id_media_id_fk" FOREIGN KEY ("version_hotel_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_videos_fk" FOREIGN KEY ("videos_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "destinations_hotel_video_hotel_video_file_idx" ON "destinations" USING btree ("hotel_video_file_id");
  CREATE INDEX "destinations_hotel_video_hotel_video_poster_idx" ON "destinations" USING btree ("hotel_video_poster_id");
  CREATE INDEX "_destinations_v_version_hotel_video_version_hotel_video__idx" ON "_destinations_v" USING btree ("version_hotel_video_file_id");
  CREATE INDEX "_destinations_v_version_hotel_video_version_hotel_vide_1_idx" ON "_destinations_v" USING btree ("version_hotel_video_poster_id");
  CREATE INDEX "payload_locked_documents_rels_videos_id_idx" ON "payload_locked_documents_rels" USING btree ("videos_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "videos" CASCADE;
  ALTER TABLE "destinations" DROP CONSTRAINT "destinations_hotel_video_file_id_videos_id_fk";
  
  ALTER TABLE "destinations" DROP CONSTRAINT "destinations_hotel_video_poster_id_media_id_fk";
  
  ALTER TABLE "_destinations_v" DROP CONSTRAINT "_destinations_v_version_hotel_video_file_id_videos_id_fk";
  
  ALTER TABLE "_destinations_v" DROP CONSTRAINT "_destinations_v_version_hotel_video_poster_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_videos_fk";
  
  DROP INDEX "destinations_hotel_video_hotel_video_file_idx";
  DROP INDEX "destinations_hotel_video_hotel_video_poster_idx";
  DROP INDEX "_destinations_v_version_hotel_video_version_hotel_video__idx";
  DROP INDEX "_destinations_v_version_hotel_video_version_hotel_vide_1_idx";
  DROP INDEX "payload_locked_documents_rels_videos_id_idx";
  ALTER TABLE "destinations" DROP COLUMN "hotel_video_file_id";
  ALTER TABLE "destinations" DROP COLUMN "hotel_video_poster_id";
  ALTER TABLE "destinations" DROP COLUMN "hotel_video_hotel_name";
  ALTER TABLE "destinations" DROP COLUMN "hotel_video_caption";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_hotel_video_file_id";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_hotel_video_poster_id";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_hotel_video_hotel_name";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_hotel_video_caption";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "videos_id";`)
}
