import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { HealthLog } from "./entity/health_log";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "progress_tracker_db.sqlite",
  synchronize: true,
  logging: false,
  entities: [
    User, HealthLog
  ],
  migrations: ["src/migrations/*.ts"],
  subscribers: [],
});