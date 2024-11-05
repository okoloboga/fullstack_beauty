import { DataSource } from "typeorm";

console.log("Entities path:", process.env.NODE_ENV === "production" ? "dist/models/**/*.js" : "src/models/**/*.ts");

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST || "db",
  port: 5432,
  username: process.env.POSTGRES_USER || "beauty",
  password: process.env.POSTGRES_PASSWORD || "password",
  database: process.env.POSTGRES_DB || "beauty_db",
  synchronize: true,
  logging: false,
  entities: [
      process.env.NODE_ENV === "production"
          ? "dist/models/**/*.js"
          : "src/models/**/*.ts"
  ],
  migrations: [
      process.env.NODE_ENV === "production"
          ? "dist/migration/**/*.js"
          : "src/migration/**/*.ts"
  ],
  subscribers: [
      process.env.NODE_ENV === "production"
          ? "dist/subscriber/**/*.js"
          : "src/subscriber/**/*.ts"
  ],
});
