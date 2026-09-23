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
  collections: [Users, Media, Destinations],
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
      connectionString: process.env.DATABASE_URI || "",
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
    vercelBlobStorage({
      // Sin token (dev y CI) los archivos quedan en disco (`media/`).
      // alwaysInsertFields deja el esquema igual cuando en prod el plugin se enciende.
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      alwaysInsertFields: true,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
});
