import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Destinations } from "./payload/collections/Destinations";
import { Media } from "./payload/collections/Media";
import { Users } from "./payload/collections/Users";
import { Videos } from "./payload/collections/Videos";
import { FeaturedPromo } from "./payload/globals/FeaturedPromo";
import { mcp } from "./payload/mcp/plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: "— 787 Rumbos",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ["/payload/components/ReviewQueue#ReviewQueue"],
    },
  },
  collections: [Users, Media, Videos, Destinations],
  globals: [FeaturedPromo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: "es",
  },
  db: postgresAdapter({
    pool: {
      // La integración de Neon en Vercel inyecta `DATABASE_URL`, distinta por preview.
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || "",
    },
    // El esquema entra por migraciones. `PAYLOAD_DB_PUSH=true` solo para un experimento local.
    push: process.env.PAYLOAD_DB_PUSH === "true",
    migrationDir: path.resolve(dirname, "payload/migrations"),
  }),
  sharp,
  graphQL: {
    disable: true,
  },
  plugins: [
    mcp,
    vercelBlobStorage({
      // Sin token (dev y CI) los archivos quedan en disco (`media/`).
      // alwaysInsertFields deja el esquema igual cuando en prod el plugin se enciende.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      // Subida directa a Blob: evita el tope de body de las funciones de Vercel (~4.5 MB).
      clientUploads: true,
      collections: {
        media: true,
        videos: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
